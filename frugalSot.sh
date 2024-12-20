#!/bin/bash
filename=data/output.txt
# read -p "Enter file name: " $filename
# data=$(<"$filename")
# echo "$data"
data1=$(<"$filename")
PROMPT=$(grep -o '"prompt": *"[^"]*"' data/test.txt | sed 's/"prompt": "//; s/"$//')

similarity_score=$(python3 frugalsot.py "$data1" "$PROMPT")

echo "Similarity score: $similarity_score"


