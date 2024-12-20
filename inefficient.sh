#!/bin/bash

read -p "Enter the prompt: " PROMPT

echo start="$(date +%s)"

ollama run phi "$PROMPT"

echo end="$(date +%s)"
echo "Time taken: $((end-start))"
echo "Done!!"