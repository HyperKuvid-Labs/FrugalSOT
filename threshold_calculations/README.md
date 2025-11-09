# GPU-Specific Threshold Calculation

This directory contains threshold calculation scripts for different GPU configurations.

## Overview

Each GPU configuration has its own threshold calculator that:
1. Reads GPU-specific model configurations
2. Runs prompts through the models
3. Calculates similarity scores between prompts and outputs
4. Generates optimized thresholds for that specific GPU setup

## Threshold Files

Located in `/data/`:
- `threshold_a100.json` - A100 (80GB) thresholds
- `threshold_h100.json` - H100 (80GB) thresholds
- `threshold_b200.json` - B200 (180GB) thresholds
- `threshold_rtx_pro_6000.json` - RTX Pro 6000 (96GB) thresholds
- `threshold_rtx_5090.json` - RTX 5090 (32GB) thresholds

## Initial Threshold Values

### A100 (80GB)
```json
{
  "low": 0.46,
  "mid": 0.65,
  "high": 0.72,
  "alpha": 0.01
}
```

### H100 (80GB)
```json
{
  "low": 0.45,
  "mid": 0.65,
  "high": 0.71,
  "alpha": 0.01
}
```

### B200 (180GB)
```json
{
  "low": 0.52,
  "mid": 0.68,
  "high": 0.78,
  "alpha": 0.01
}
```

### RTX Pro 6000 (96GB)
```json
{
  "low": 0.46,
  "mid": 0.67,
  "high": 0.73,
  "alpha": 0.01
}
```

### RTX 5090 (32GB)
```json
{
  "low": 0.45,
  "mid": 0.62,
  "high": 0.68,
  "alpha": 0.01
}
```

## Running Threshold Calculations

### Individual GPU:
```bash
cd threshold_calculations
./threshold_calculator_a100.sh
./threshold_calculator_h100.sh
./threshold_calculator_b200.sh
./threshold_calculator_rtx_pro_6000.sh
./threshold_calculator_rtx_5090.sh
```

### All GPUs (Sequential):
```bash
cd threshold_calculations
./run_all_threshold_calculators.sh
```

## How It Works

1. **Load Configuration**: Reads the GPU-specific config file (e.g., `config_a100.json`)
2. **Process Prompts**: For each complexity level (Low/Mid/High):
   - Reads up to 100 prompts from `{complexity}_prompts.txt`
   - Runs each prompt through the respective model
   - Calculates similarity between prompt and output
3. **Calculate Thresholds**: Averages the similarity scores for each complexity level
4. **Save Results**: Updates the GPU-specific threshold JSON file

## Prompt Files

Located in this directory:
- `low_complexity_prompts.txt` - 101 simple prompts
- `mid_complexity_prompts.txt` - 101 medium complexity prompts
- `high_complexity_prompts.txt` - 101 complex prompts

## Notes

- Initial thresholds are estimates based on model capabilities
- Run the threshold calculators to get optimized values for your system
- Thresholds are automatically updated as scripts run (adaptive learning with alpha = 0.01)
- Larger models (B200) have higher thresholds due to better quality outputs
- Smaller models (RTX 5090) have lower thresholds to account for capability limits

