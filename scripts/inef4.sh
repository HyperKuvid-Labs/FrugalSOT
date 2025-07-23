# #!/bin/bash
# filename=data/output.txt
# # read -p "Enter file name: " $filename
# # data=$(<"$filename")
# # echo "$data"
# data1=$(<"$filename")
# PROMPT=$(grep -o '"prompt": *"[^"]*"' data/test.txt | sed 's/"prompt": "//; s/"$//')

# echo "Prompt: $PROMPT"
# echo "Data: $data1"

# similarity_score=$(python3 textSimilarity.py "$data1" "$PROMPT")

# echo "Similarity score: $similarity_score"

# this is where the final execution is gonna happen, so copying the file form main.sh and using it here and keeping that as a backup

#!/bin/bash

total_ram_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
total_ram_gb=$(echo "scale=2; $total_ram_kb / 1024 / 1024" | bc)
echo "Total RAM: $total_ram_gb GB"

Models=$(python ../src/modelInitialization.py "$total_ram_gb")

Low_model=$(echo "$Models" | jq -r '.Low')
Mid_model=$(echo "$Models" | jq -r '.Mid')
High_model=$(echo "$Models" | jq -r '.High')
Unknown_model=$(echo "$Models" | jq -r '.Unknown')

echo "Low Model: $Low_model"
echo "Mid Model: $Mid_model"
echo "High Model: $High_model"
echo "Unknown Model: $Unknown_model"

#ollama run "$Low_model" what is ai?
read -p "Enter the prompt: " PROMPT

start_time=$(date +%s.%3N)
echo "And the clock starts ticking! Start time: $start_time"

# python ../src/main.py "$PROMPT"

# COMPLEXITY=$(grep -o '"complexity": *"[^"]*"' ../data/test.txt | sed 's/"complexity": "//; s/"$//')

# echo "Analyzing the complexity... Turns out it's $COMPLEXITY. Let's unleash the right model!"
# echo "You said: '$PROMPT' — Let's dive in!"

run_model(){
    #local $PROMPT = "$1"
    #local COMPLEXITY = "${2:-Low}"

    ollama run "$Unknown_model" "$PROMPT" | tee ../data/output.txt         
}
# case "$COMPLEXITY" in
#     "Low")
#         echo "Running low complexity model..."
#         ollama run tinyllama "$PROMPT" | tee data/output.txt
#         ;;
#     "Mid")
#         echo "Running medium complexity model..."
#         ollama run tinydolphin "$PROMPT" | tee data/output.txt
#         ;;
#     "High")
#         echo "Running high complexity model..."
#         ollama run gemma2:2b "$PROMPT" | tee data/output.txt
#         ;;
#     *)
#         echo "Unknown complexity level: $COMPLEXITY"
#         echo "Running on highly inefficient model..."
#         ollama run phi "$PROMPT" | tee data/output.txt
#         ;;
# # esac
# update_complexity_in_test_file() {
#     local new_complexity="$1"
#     jq --arg new_complexity "$new_complexity" '.complexity = $new_complexity' ../data/test.txt > ../data/tmp_test.txt && mv ../data/tmp_test.txt ../data/test.txt
# }


check_relevance() {
    while true; do
        python ../src/textSimilarity.py
        RELEVANT=$(grep -o '"relevant": *"[^"]*"' ../data/test.txt | sed 's/"relevant": "//; s/"$//')
        echo $RELEVANT
    done
}

run_model 
check_relevance

end_time=$(date +%s.%3N)
echo "And that's a wrap! End time: $end_time."
time_diff_ms=$(awk "BEGIN {printf \"%.0f\", ($end_time - $start_time)}")
echo "Mission accomplished in a blazing $time_diff_ms s. 🚀"

# python textSimilarity.py

# RELEVANT=$(grep -o '"relevant": *"[^"]*"' data/test.txt | sed 's/"relevant": "//; s/"$//')

echo "All done! Your output is ready. Time to take a bow. 🏆"
