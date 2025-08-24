# FrugalSOT Docker CLI

This document explains how to use FrugalSOT as a Docker container with CLI interface.

## Quick Start

### Using Docker directly

```bash
# Build the image
docker build -t frugalsot-cli .

# Run with a prompt
docker run --rm frugalsot-cli "What is artificial intelligence?"

# Run interactively
docker run -it --rm frugalsot-cli bash
```

### Using Docker Compose

```bash
# Build and run with a prompt
docker-compose run --rm frugalsot "What is machine learning?"

# Run interactively
docker-compose run --rm --profile interactive frugalsot-interactive
```

## Features

- **Non-interactive CLI**: Accepts prompts as command-line arguments
- **Automatic model selection**: Based on system RAM and prompt complexity
- **Lightweight models**: Optimized for resource-constrained environments
- **Self-contained**: All dependencies included in the container

## System Requirements

- Docker installed
- At least 4GB RAM (8GB+ recommended for larger models)
- 10GB+ disk space for models

## Model Selection

The system automatically selects models based on available RAM:

### Low RAM Systems (<8GB)
- **Low Complexity**: tinyllama
- **Mid Complexity**: tinydolphin  
- **High Complexity**: gemma2:2b
- **Fallback**: phi

### High RAM Systems (≥8GB)
- **Low Complexity**: llama2:7b
- **Mid Complexity**: mistral
- **High Complexity**: llama3.2:3b
- **Fallback**: llama2:13b

## Usage Examples

```bash
# Simple question
docker run --rm frugalsot-cli "What is AI?"

# Complex analysis
docker run --rm frugalsot-cli "Explain the differences between supervised and unsupervised machine learning algorithms, including their respective use cases and performance metrics."

# Mount data directory to persist outputs
docker run --rm -v $(pwd)/data:/app/data frugalsot-cli "Summarize quantum computing"
```

## Output

Results are saved to `/app/data/output.txt` inside the container. Mount the data directory to access outputs on the host system.

## Building for Production

```bash
# Build optimized image
docker build --no-cache -t frugalsot-cli:latest .

# Tag for registry
docker tag frugalsot-cli:latest your-registry/frugalsot-cli:latest

# Push to registry
docker push your-registry/frugalsot-cli:latest
```

## Troubleshooting

### Model Download Issues
If models fail to download during container startup:
```bash
# Run interactively and pull models manually
docker run -it frugalsot-cli bash
ollama pull tinyllama
```

### Memory Issues
- Ensure Docker has enough memory allocated (8GB+ recommended)
- Use smaller models for resource-constrained environments

### Performance
- First run will be slower due to model downloads
- Subsequent runs use cached models for faster execution