#!/bin/sh
set -eu

#############################################
# FrugalSOT Installation Script
# Installs Ollama and FrugalSOT
#############################################

status() {
    echo ""
    echo "============================================"
    echo ">>> $*"
    echo "============================================"
    echo ""
}

error() {
    echo ""
    echo "ERROR: $*" >&2
    exit 1
}

# verbose output
set -x

# linux check
[ "$(uname -s)" = "Linux" ] || error 'This script only supports Linux'

# detect architecture
ARCH=$(uname -m)
status "Detected architecture: $ARCH"

case "$ARCH" in
    x86_64) 
        GO_ARCH="amd64" 
        ;;
    aarch64|arm64) 
        GO_ARCH="arm64" 
        ;;
    *) 
        error "Unsupported architecture: $ARCH" 
        ;;
esac

# setup sudo
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
    status "Running as non-root user, will use sudo for privileged operations"
    if ! command -v sudo >/dev/null; then
        error "This script requires root privileges or sudo"
    fi
    SUDO="sudo"
else
    status "Running as root"
fi

# check for required tools
status "Checking for required tools..."
for cmd in curl git tar; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        error "Required tool not found: $cmd. Please install it first."
    else
        echo "   Found: $cmd"
    fi
done


# if frugalsot is already installed, we need to remove it first
if command -v frugalsot >/dev/null 2>&1; then
    FRUGALSOT_VERSION=$(frugalsot --version 2>&1 || echo "unknown")
    status "Found existing FrugalSOT installation: $FRUGALSOT_VERSION"
    status "Removing old FrugalSOT installation..."
    $SUDO rm -f /usr/local/bin/frugalsot
fi


#############################################
# INSTALL OLLAMA
#############################################

status "Checking for existing Ollama installation..."
if command -v ollama >/dev/null 2>&1; then
    OLLAMA_VERSION=$(ollama --version 2>&1 || echo "unknown")
    status "Found existing Ollama: $OLLAMA_VERSION"
else
    status "Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    
    status "Verifying Ollama installation..."
    ollama --version || error "Ollama installation failed"
fi

status "Starting Ollama service..."
if command -v systemctl >/dev/null 2>&1; then
    $SUDO systemctl enable ollama 2>/dev/null || true
    $SUDO systemctl start ollama 2>/dev/null || true
    sleep 2
    
    status "Checking Ollama status..."
    $SUDO systemctl status ollama --no-pager || true
else
    echo "Systemd not found, skipping service setup"
fi

#############################################
# INSTALL FRUGALSOT
#############################################

REPO_URL="https://github.com/HyperKuvid-Labs/FrugalSOT.git"
CLONE_DIR="FrugalSOT"

status "Creating temporary directory..."
TEMP_DIR=$(mktemp -d)
echo "Temp directory: $TEMP_DIR"

cleanup() {
    status "Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

cd "$TEMP_DIR"

status "Cloning FrugalSOT repository..."
echo "Repository: $REPO_URL"
echo "Target directory: $CLONE_DIR"
git clone "$REPO_URL"

status "Verifying clone and entering project directory..."
if [ ! -d "$CLONE_DIR" ]; then
    error "Cloned directory '$CLONE_DIR' not found. Clone may have failed."
fi

cd FrugalSOT
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

cd FrugalSOT-Go
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

status "Installing pre-built FrugalSOT binary..."
if [ ! -f "bin/frugalsot" ]; then
    error "Pre-built binary not found at bin/frugalsot"
fi

# make binary executable and copy to system location
chmod +x bin/frugalsot
$SUDO cp bin/frugalsot /usr/local/bin/frugalsot

# install configs folder
status "Installing FrugalSOT configuration files..."
if [ -d "configs" ]; then
    $SUDO mkdir -p /usr/local/share/frugalsot
    $SUDO cp -r configs /usr/local/share/frugalsot/
    echo "   Configs installed to /usr/local/share/frugalsot/configs"
else
    error "configs directory not found in $(pwd)"
fi

status "Verifying FrugalSOT installation..."
which frugalsot
ls -lh /usr/local/bin/frugalsot
ls -lh /usr/local/share/frugalsot/configs

#############################################
# FINAL CHECKS
#############################################

set +x

status "Installation Summary"
echo "  Ollama:    $(ollama --version 2>&1 | head -1 || echo 'installed')"
echo "  FrugalSOT: $(which frugalsot)"
echo ""
echo "Installation complete!"
echo ""
echo "To use FrugalSOT, run:"
echo '  frugalsot run "What is AI and how does it affect climate"'
echo ""
echo "Make sure to reload your shell or run:"
echo "  source ~/.bashrc"
echo ""
