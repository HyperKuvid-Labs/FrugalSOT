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
# CONFIGURE FRUGALSOT
#############################################


set +x


status "Configuration Setup"
echo ""
read -p "Would you like to use the default configuration? (yes/no) " yn


case $yn in
    [Yy]|[Yy][Ee][Ss])
        echo ""
        echo "Using default configuration..."
        CONFIG_PATH="/usr/local/share/frugalsot/configs/config.yaml"
        $SUDO tee "$CONFIG_PATH" > /dev/null <<EOF
Low: tinyllama
Mid: tinydolphin
High: gemma2:2b
Fallback: phi:2.7b
EmbeddingModel: all-minilm:33m
EOF
        echo "Default configuration written to $CONFIG_PATH"
        ;;
    
    [Nn]|[Nn][Oo])
        echo ""
        echo "Enter your custom model configuration:"
        echo ""
        
        read -p "Low complexity model: " low_model
        read -p "Mid complexity model: " mid_model
        read -p "High complexity model: " high_model
        read -p "Fallback model: " fallback_model
        read -p "Embedding model: " embedding_model
        
        if [ -z "$low_model" ] || [ -z "$mid_model" ] || [ -z "$high_model" ] || [ -z "$fallback_model" ] || [ -z "$embedding_model" ]; then
            error "All model fields are required. Configuration failed."
        fi
        
        CONFIG_PATH="/usr/local/share/frugalsot/configs/config.yaml"
        $SUDO tee "$CONFIG_PATH" > /dev/null <<EOF
Low: $low_model
Mid: $mid_model
High: $high_model
Fallback: $fallback_model
EmbeddingModel: $embedding_model
EOF
        echo ""
        echo "Custom configuration written to $CONFIG_PATH"
        ;;
    
    *)
        error "Invalid response. Please answer yes or no."
        ;;
esac


#############################################
# FINAL CHECKS
#############################################


echo ""
status "Installation Summary"
echo "  Ollama:    $(ollama --version 2>&1 | head -1 || echo 'installed')"
echo "  FrugalSOT: $(which frugalsot)"
echo ""
echo "Configuration:"
cat "$CONFIG_PATH"
echo ""
echo "Installation complete!"
echo ""
echo "To use FrugalSOT, run:"
echo '  frugalsot run "What is AI and how does it affect climate"'
echo ""
echo "Make sure to reload your shell or run:"
echo "  source ~/.bashrc"
echo ""
