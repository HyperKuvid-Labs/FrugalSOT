#!/bin/bash

export THRESHOLD_FILE="threshold_a100.json"

total_ram_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
total_ram_gb=$(echo "scale=2; $total_ram_kb / 1024 / 1024" | bc)
echo "Total RAM: $total_ram_gb GB"

Models=$(cat ../../data/config_a100.json)

Low_model=$(echo "$Models" | jq -r '.Low')
Mid_model=$(echo "$Models" | jq -r '.Mid')
High_model=$(echo "$Models" | jq -r '.High')
Unknown_model=$(echo "$Models" | jq -r '.Unknown')

echo "Low Model: $Low_model"
echo "Mid Model: $Mid_model"
echo "High Model: $High_model"
echo "Unknown Model: $Unknown_model"

read -p "Enter the prompt: " PROMPT

start_time=$(date +%s.%3N)
echo "And the clock starts ticking! Start time: $start_time"

run_model(){
    ollama run "$Unknown_model" "$PROMPT" | tee ../../data/output.txt
}

check_relevance() {
    python ../../src/textSimilarity.py
    RELEVANT=$(grep -o '"relevant": *"[^"]*"' ../../data/test.txt | sed 's/"relevant": "//; s/"$//')
    echo $RELEVANT

}

run_model
check_relevance

end_time=$(date +%s.%3N)
echo "And that's a wrap! End time: $end_time."
time_diff_ms=$(awk "BEGIN {printf \"%.0f\", ($end_time - $start_time)}")
echo "Mission accomplished in a blazing $time_diff_ms s. 🚀"

echo "All done! Your output is ready. Time to take a bow. 🏆"

