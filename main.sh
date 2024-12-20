# will update within tmrw morning
# also tried onnx, will explore later
# for tomorrow's demo, just gonna use ollama,
# dont chnage any code for now, if you want to please do it as a pull request, dont commit directly

#!/bin/bash

read -p "Enter the prompt: " PROMPT

start_time=$(date +%s.%3N)
echo "Start time: $start_time"

python3 main.py "$PROMPT"

COMPLEXITY=$(grep -o '"complexity": *"[^"]*"' data/test.txt | sed 's/"complexity": "//; s/"$//')

echo "Complexity: $COMPLEXITY"
echo "Prompt: $PROMPT"

case "$COMPLEXITY" in
    "Low")
        echo "Running low complexity model..."
        ollama run tinyllama "$PROMPT" | tee data/output.txt
        ;;
    "Mid")
        echo "Running medium complexity model..."
        ollama run tinydolphin "$PROMPT" | tee data/output.txt
        ;;
    "High")
        echo "Running high complexity model..."
        ollama run gemma2:2b "$PROMPT" | tee data/output.txt
        ;;
    *)
        echo "Unknown complexity level: $COMPLEXITY"
        echo "Running on highly inefficient model..."
        ollama run phi "$PROMPT" | tee data/output.txt
        ;;
esac

end_time=$(date +%s.%3N)
echo "End time: $end_time"
time_diff_ms=$(awk "BEGIN {printf \"%.0f\", ($end_time - $start_time) * 1000}")
echo "Time taken: $time_diff_ms ms"
echo "Done!!"

# now the remaining process is to capture and store it in the vector db or direct storage

