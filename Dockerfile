# Use Ubuntu 22.04 as base image for compatibility
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PATH="/app:$PATH"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    wget \
    jq \
    bc \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Copy the application code
COPY . .

# Create data directory and set permissions
RUN mkdir -p /app/data && \
    chmod +x /app/frugalsot-cli && \
    chmod +x /app/scripts/frugalSot-cli.sh

# Download required NLTK data
RUN python3 -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger'); nltk.download('maxent_ne_chunker'); nltk.download('words'); nltk.download('punkt_tab'); nltk.download('averaged_perceptron_tagger_eng'); nltk.download('maxent_ne_chunker_tab')"

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Start Ollama in the background\n\
echo "🚀 Starting Ollama service..."\n\
ollama serve &\n\
OLLAMA_PID=$!\n\
\n\
# Wait for Ollama to be ready\n\
echo "⏳ Waiting for Ollama to be ready..."\n\
sleep 5\n\
\n\
# Function to pull models if needed\n\
pull_model_if_needed() {\n\
    local model=$1\n\
    if ! ollama list | grep -q "$model"; then\n\
        echo "📥 Pulling model: $model"\n\
        ollama pull "$model" || echo "⚠️ Failed to pull $model, will attempt during runtime"\n\
    else\n\
        echo "✅ Model $model already available"\n\
    fi\n\
}\n\
\n\
# Determine RAM and pull appropriate models\n\
total_ram_kb=$(grep MemTotal /proc/meminfo | awk "{print $2}")\n\
total_ram_gb=$(echo "scale=2; $total_ram_kb / 1024 / 1024" | bc)\n\
echo "💾 Detected RAM: ${total_ram_gb}GB"\n\
\n\
# Pull models based on RAM\n\
if (( $(echo "$total_ram_gb >= 8" | bc -l) )); then\n\
    echo "🖥️ High RAM system detected, pulling larger models..."\n\
    pull_model_if_needed "llama2:7b"\n\
    pull_model_if_needed "mistral"\n\
    pull_model_if_needed "llama3.2:3b"\n\
    pull_model_if_needed "llama2:13b"\n\
else\n\
    echo "🔧 Resource-constrained system detected, pulling lightweight models..."\n\
    pull_model_if_needed "tinyllama"\n\
    pull_model_if_needed "tinydolphin"\n\
    pull_model_if_needed "gemma2:2b"\n\
    pull_model_if_needed "phi"\n\
fi\n\
\n\
echo "✅ FrugalSOT is ready!"\n\
\n\
# If arguments provided, run the CLI\n\
if [ $# -gt 0 ]; then\n\
    /app/frugalsot-cli "$@"\n\
else\n\
    echo "Usage: docker run frugalsot \"your prompt here\""\n\
    echo "Example: docker run frugalsot \"What is artificial intelligence?\""\n\
fi\n\
\n\
# Keep container running if no command provided\n\
if [ $# -eq 0 ]; then\n\
    echo "Container is ready. You can exec into it or provide a prompt."\n\
    tail -f /dev/null\n\
fi' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Expose port for Ollama (though not strictly necessary for CLI usage)
EXPOSE 11434

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]