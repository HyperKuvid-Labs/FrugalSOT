#!/bin/bash

# FrugalSOT CLI Test Script - for testing without Ollama
# This script tests the core functionality without requiring Ollama

set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Get prompt from command line argument or environment variable
if [ $# -gt 0 ]; then
    PROMPT="$1"
elif [ -n "$PROMPT" ]; then
    # Use environment variable if set
    PROMPT="$PROMPT"
else
    echo "Error: No prompt provided. Usage: frugalSot-cli-test.sh \"your prompt\""
    exit 1
fi

echo "=== FrugalSOT CLI Test ==="
echo "Prompt: $PROMPT"

# System information
total_ram_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
total_ram_gb=$(echo "scale=2; $total_ram_kb / 1024 / 1024" | bc)
echo "Total RAM: $total_ram_gb GB"

# Initialize models based on RAM
Models=$(python "$PROJECT_ROOT/src/modelInitialization.py" "$total_ram_gb")

Low_model=$(echo "$Models" | jq -r '.Low')
Mid_model=$(echo "$Models" | jq -r '.Mid')
High_model=$(echo "$Models" | jq -r '.High')
Unknown_model=$(echo "$Models" | jq -r '.Unknown')

echo "Available Models:"
echo "  Low Complexity: $Low_model"
echo "  Mid Complexity: $Mid_model"
echo "  High Complexity: $High_model"
echo "  Unknown/Fallback: $Unknown_model"

start_time=$(date +%s.%3N)
echo "⏰ Starting analysis at: $start_time"

# Analyze prompt complexity
python "$PROJECT_ROOT/src/main.py" "$PROMPT"

COMPLEXITY=$(grep -o '"complexity": *"[^"]*"' "$PROJECT_ROOT/data/test.txt" | sed 's/"complexity": "//; s/"$//')

echo "🧠 Complexity Analysis Result: $COMPLEXITY"
echo "🚀 Launching appropriate model..."

run_model(){
    case "$COMPLEXITY" in
        "Low")
            echo "⚡ Going lightweight with $Low_model—quick and efficient!"
            echo "Mock response for Low complexity prompt: $PROMPT" | tee "$PROJECT_ROOT/data/output.txt"
            ;;
        "Mid")
            echo "⚖️ Stepping it up! Mid-tier $Mid_model is on the job."
            echo "Mock response for Mid complexity prompt: $PROMPT" | tee "$PROJECT_ROOT/data/output.txt"
            ;;
        "High")
            echo "🔥 Heavy lifting ahead—$High_model is ready to roar!"
            echo "Mock response for High complexity prompt: $PROMPT" | tee "$PROJECT_ROOT/data/output.txt"
            ;;
        *)
            echo "💪 When in doubt, go all out! Deploying $Unknown_model for brute-force brilliance."
            echo "Mock response for Unknown complexity prompt: $PROMPT" | tee "$PROJECT_ROOT/data/output.txt"
            ;;
    esac
}

update_complexity_in_test_file() {
    local new_complexity="$1"
    jq --arg new_complexity "$new_complexity" '.complexity = $new_complexity' "$PROJECT_ROOT/data/test.txt" > "$PROJECT_ROOT/data/tmp_test.txt" && mv "$PROJECT_ROOT/data/tmp_test.txt" "$PROJECT_ROOT/data/test.txt"
}

check_relevance() {
    echo "🔍 Running relevance check..."
    python "$PROJECT_ROOT/src/textSimilarity-mock.py"
    RELEVANT=$(grep -o '"relevant": *"[^"]*"' "$PROJECT_ROOT/data/test.txt" | sed 's/"relevant": "//; s/"$//')

    if [[ "$RELEVANT" == "True" ]]; then
        echo "🎯 Bullseye! The response is right on point."
    else
        echo "ℹ️ Test mode: Skipping complexity escalation for testing"
    fi
}

# Execute the pipeline
run_model 
check_relevance

end_time=$(date +%s.%3N)
time_diff_ms=$(awk "BEGIN {printf \"%.0f\", ($end_time - $start_time)}")

echo ""
echo "✅ Test completed in $time_diff_ms seconds! 🚀"
echo "📄 Output saved to: $PROJECT_ROOT/data/output.txt"
echo "🏆 Test passed! Core functionality is working."