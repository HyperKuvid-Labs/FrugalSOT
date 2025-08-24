#!/bin/bash

# FrugalSOT CLI Demo Script
# Demonstrates different complexity levels and model selection

set -e

echo "🚀 FrugalSOT CLI Demo"
echo "===================="
echo ""

# Array of test prompts with different complexity levels
declare -a prompts=(
    "What is AI?"
    "Explain machine learning algorithms"
    "Compare and contrast supervised learning, unsupervised learning, and reinforcement learning methodologies, including their mathematical foundations, practical applications, and performance evaluation metrics in real-world scenarios"
)

declare -a descriptions=(
    "Simple question (Low complexity)"
    "Moderate question (Mid complexity)"  
    "Complex analytical question (High complexity)"
)

echo "Testing FrugalSOT with prompts of varying complexity:"
echo ""

for i in "${!prompts[@]}"; do
    echo "📝 Test $((i+1)): ${descriptions[i]}"
    echo "   Prompt: \"${prompts[i]}\""
    echo "   Running..."
    echo ""
    
    # Run the test CLI
    ./frugalsot-cli-test "${prompts[i]}"
    
    echo ""
    echo "─────────────────────────────────────────────────"
    echo ""
done

echo "🎉 Demo completed! All complexity levels tested successfully."
echo ""
echo "💡 Key observations:"
echo "   • Low complexity prompts use lightweight models (e.g., tinyllama)"
echo "   • Mid complexity prompts use balanced models (e.g., tinydolphin)"
echo "   • High complexity prompts use powerful models (e.g., gemma2:2b)"
echo "   • Model selection is automatic based on prompt analysis"
echo ""
echo "🐳 To run with Docker:"
echo "   docker run --rm frugalsot-cli \"Your prompt here\""