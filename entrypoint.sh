#!/bin/bash
set -e

echo "🚀 Starting Ollama service..."
ollama serve &
OLLAMA_PID=$!

echo "⏳ Waiting for Ollama to be ready..."
# Wait until 'ollama list' responds or timeout
max_wait=60
count=0
until ollama list >/dev/null 2>&1; do
  sleep 1
  count=$((count+1))
  if [ "$count" -ge "$max_wait" ]; then
    echo "⚠️ Ollama did not become ready within ${max_wait}s, continuing..." >&2
    break
  fi
done

CONFIG_PATH="/app/data/config.json"
if [ ! -f "$CONFIG_PATH" ]; then
  echo "⚠️ Config file $CONFIG_PATH not found. No models will be pulled."
else
  echo "📄 Loading model list from $CONFIG_PATH"
  models=$(jq -r '.[]' "$CONFIG_PATH" 2>/dev/null || true)
  if [ -z "$models" ]; then
    echo "⚠️ No models found in config or failed to parse JSON."
  else
    for model in $models; do
      echo "📥 Ensuring model: $model"
      if ! ollama list | grep -q "$model"; then
        echo "📥 Pulling model: $model"
        if ! ollama pull "$model"; then
          echo "⚠️ Failed to pull $model; will attempt at runtime" >&2
        fi
      else
        echo "✅ Model $model already available"
      fi
    done
  fi
fi

echo "✅ FrugalSOT is ready!"

if [ $# -gt 0 ]; then
  exec /app/frugalsot-cli "$@"
else
  echo 'Usage: docker run frugalsot "your prompt here"'
  echo 'Example: docker run frugalsot "What is artificial intelligence?"'
fi

if [ $# -eq 0 ]; then
  echo "Container is ready. You can exec into it or provide a prompt."
  tail -f /dev/null
fi
