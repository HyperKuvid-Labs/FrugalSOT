total_ram_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
total_ram_gb=$(echo "scale=2; $total_ram_kb / 1024 / 1024" | bc)
echo "Total RAM: $total_ram_gb GB"

python ../src/modelInitialization.py "$total_ram_gb"