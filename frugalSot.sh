#!/bin/bash
filename=data/output.txt
# read -p "Enter file name: " $filename
# data=$(<"$filename")
# echo "$data"
data1=$(<"$filename")
PROMPT=$(grep -o '"prompt": *"[^"]*"' data/test.txt | sed 's/"prompt": "//; s/"$//')

echo "Prompt: $PROMPT"
echo "Data: $data1"

similarity_score=$(python3 textSimilarity.py "$data1" "$PROMPT")

echo "Similarity score: $similarity_score"


