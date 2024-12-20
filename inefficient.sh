#!/bin/bash

read -p "Enter the prompt: " PROMPT

start_time=$(date +%s.%3N)
echo "Start time: $start_time"

ollama run phi "$PROMPT" > output.txt|| { echo "Error occurred during execution"; exit 1; }

end_time=$(date +%s.%3N)
echo "End time: $end_time"
time_diff_ms=$(bc -l <<< "scale=0; ($end_time - $start_time) * 1000")
echo "Time taken: $time_diff_ms ms"
echo "Done!!"