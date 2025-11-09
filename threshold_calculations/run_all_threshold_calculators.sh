#!/bin/bash

echo "============================================"
echo "Running threshold calculators for all GPUs"
echo "============================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GPUS=("a100" "h100" "b200" "rtx_pro_6000" "rtx_5090")

for gpu in "${GPUS[@]}"; do
    echo ""
    echo "============================================"
    echo "Processing GPU: ${gpu^^}"
    echo "============================================"

    calculator_script="$SCRIPT_DIR/threshold_calculator_${gpu}.sh"

    if [[ -f "$calculator_script" ]]; then
        bash "$calculator_script"

        echo ""
        echo "Completed threshold calculation for ${gpu^^}"
        echo "--------------------------------------------"
    else
        echo "Error: Calculator script not found: $calculator_script"
    fi

    echo ""
    read -p "Press Enter to continue to next GPU (or Ctrl+C to stop)..."
done

echo ""
echo "============================================"
echo "All threshold calculations complete!"
echo "============================================"
echo ""
echo "Threshold files created:"
ls -lh "$SCRIPT_DIR/../data/threshold_*.json"

