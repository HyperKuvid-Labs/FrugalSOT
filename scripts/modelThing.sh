total_ram_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
total_ram_gb=$(echo "scale=2; $total_ram_kb / 1024 / 1024" | bc)
echo "Total RAM: $total_ram_gb GB"

Models=$(python ../src/modelInitialization.py "$total_ram_gb")

Low_model=$(echo "Low Model" | jq -r '.Low')
Mid_model=$(echo "Mid Model" | jq -r '.Mid')
High_model=$(echo "High Model" | jq -r '.High')
Unknown_model=$(echo "Unknown Model" | jq -r '.Unknown')

echo "Low Model: $Low_model"
echo "Mid Model: $Mid_model"
echo "High Model: $High_model"
echo "Unknown Model: $Unknown_model"

