#!/bin/bash

# the steps are:
# 1. read config.json to get current models according to the system
# 2. read prompts from threshold_calculations/low_complexity_prompts.txt, mid_complexity_prompts.txt, high_complexity_prompts.txt and run them through the respective models one by one
# 3. calculate text similarity between the prompt and the output using textSimilarity.py
# 4. store the similarity scores and calculate average thresholds for each complexity level
# 5. update threshold.json with the new thresholds

echo "threshold calculator..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

CONFIG_FILE="data/config.json"
THRESHOLD_FILE="data/threshold.json"
LOW_PROMPTS="threshold_calculations/low_complexity_prompts.txt"
MID_PROMPTS="threshold_calculations/mid_complexity_prompts.txt"
HIGH_PROMPTS="threshold_calculations/high_complexity_prompts.txt"


total_ram_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
total_ram_gb=$(echo "scale=2; $total_ram_kb / 1024 / 1024" | bc)
echo "💻 Total RAM: $total_ram_gb GB"

Models=$(python src/modelInitialization.py "$total_ram_gb")

Low_model=$(echo "$Models" | jq -r '.Low')
Mid_model=$(echo "$Models" | jq -r '.Mid')
High_model=$(echo "$Models" | jq -r '.High')
Unknown_model=$(echo "$Models" | jq -r '.Unknown')

echo "  Low Complexity: $Low_model"
echo "  Mid Complexity: $Mid_model"
echo "  High Complexity: $High_model"
echo "  Unknown/Fallback: $Unknown_model"

total_prompts=0
processed_prompts=0

run_model_for_prompt() {
    local prompt="$1"
    local expected_complexity="$2"
    local model_name="$3"
    
    python src/main.py "$prompt" > /dev/null 2>&1
    
    echo " running model $model_name..."
    timeout 60s ollama run "$model_name" "$prompt" > data/output.txt 2>&1
    
    echo "calculating similarity..."
    python src/textSimilarity.py > /dev/null 2>&1
    
    echo "watha done.."
    return 0
}
process_complexity_prompts() {
    local complexity="$1"
    local prompts_file="$2"
    local model_name="$3"
    local max_prompts=100
    
    echo ""
    echo "processing $complexity complexity prompts with $model_name..."
    echo "reading from: $prompts_file"
    
    local count=0
    local success_count=0
    
    while IFS= read -r prompt && [[ $count -lt $max_prompts ]]; do
        if [[ -z "$prompt" ]]; then
            continue
        fi
        
        ((count++))
        ((total_prompts++))
        
        echo ""
        echo "progress: $count/$max_prompts (Total: $processed_prompts/$total_prompts)"
        
        if run_model_for_prompt "$prompt" "$complexity" "$model_name"; then
            ((success_count++))
            ((processed_prompts++))
        fi
        
        sleep 1
        
    done < "$prompts_file"
    
    echo ""
    echo "completed $complexity complexity: $success_count/$count prompts successful"
}

echo ""
echo "📊 Counting total prompts to process..."
low_count=$(head -100 "$LOW_PROMPTS" | wc -l)
mid_count=$(head -100 "$MID_PROMPTS" | wc -l)  
high_count=$(head -100 "$HIGH_PROMPTS" | wc -l)
total_prompts=$((low_count + mid_count + high_count))

echo "total prompts to process: $total_prompts"
echo "  - Low complexity: $low_count"
echo "  - Mid complexity: $mid_count"  
echo "  - High complexity: $high_count"

if [[ -f "$THRESHOLD_FILE" ]]; then
    cp "$THRESHOLD_FILE" "${THRESHOLD_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "💾 Backed up existing threshold file"
fi

echo ""
echo "starintg threshold calculation..."
start_time=$(date +%s)

process_complexity_prompts "Low" "$LOW_PROMPTS" "$Low_model"
process_complexity_prompts "Mid" "$MID_PROMPTS" "$Mid_model" 
process_complexity_prompts "High" "$HIGH_PROMPTS" "$High_model"

end_time=$(date +%s)
total_time=$((end_time - start_time))
minutes=$((total_time / 60))
seconds=$((total_time % 60))

echo ""
echo "threshold calculation completed!"
echo "total time taken : ${minutes}m ${seconds}s"
echo "successfully processed: $processed_prompts/$total_prompts prompts"

if [[ -f "$THRESHOLD_FILE" ]]; then
    echo ""
    echo "final thresholds:"
    cat "$THRESHOLD_FILE" | jq .
else
    echo "⚠️  Warning: Threshold file not found after processing"
fi

echo ""
echo "outputs saved to: $PROJECT_ROOT/data/output.txt"
echo "thresholds saved to: $PROJECT_ROOT/data/threshold.json, hopefully!!"