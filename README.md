# FrugalSOT

**Frugal Search Over Models** — A local, resource-aware inference framework that dynamically routes prompts to the most appropriate language model based on prompt complexity and available system memory.

---

## Overview

FrugalSOT analyzes each incoming prompt and selects the most computationally appropriate local model to handle it. If the selected model produces an insufficiently relevant response, the system automatically escalates to a more capable model and retries. This cascading approach avoids over-provisioning compute resources on simple queries while ensuring complex queries receive adequate model capacity.

All inference runs locally via [Ollama](https://ollama.com). No data leaves the machine.

---

## How It Works

The inference pipeline executes the following steps on every request:

1. **RAM Detection** — The system reads available memory from `/proc/meminfo` and selects the appropriate model tier configuration (under 8 GB or 8 GB and above).

2. **Complexity Classification** (`src/prompt.py`) — The prompt is analyzed across three dimensions using NLTK:
   - **Length**: token count bucketed into Low, Mid, or High
   - **Named Entity Recognition (NER)**: counts recognized named entities via `ne_chunk`
   - **Syntactic Complexity**: counts conjunctions, subordinating clauses, and average sentence length

   A weighted score is computed from these three signals:

   | Signal     | Weight |
   |------------|--------|
   | Length     | 1x     |
   | NER        | 2x     |
   | Syntax     | 3x     |

   The total score maps to a final tier: `Low` (score <= 4), `Mid` (5-8), or `High` (> 8).

3. **Model Dispatch** (`scripts/frugalSot.sh`) — The selected Ollama model is invoked with the prompt. Output is written to `data/output.txt`.

4. **Relevance Evaluation** (`src/textSimilarity.py`) — The response is evaluated for semantic relevance using the Qwen2.5-1.5B-Instruct model loaded via `unsloth` with 4-bit quantization. The model scores semantic similarity between the prompt and the response on a 0.0-1.0 scale.

   Thresholds are maintained per complexity tier and updated adaptively using an exponential moving average:

   ```
   threshold = alpha * score + (1 - alpha) * threshold
   ```

   Default thresholds: `low=0.4441`, `mid=0.6537`, `high=0.6934`, `alpha=0.01`

5. **Escalation Loop** — If the response does not meet the relevance threshold, the complexity tier is upgraded and the request is re-run with the next model. The escalation order is: `Low -> Mid -> High -> fallback`. The loop exits on the first relevant response or after exhausting all tiers.

---

## Model Configuration

Model assignments are defined in `data/config.json` and resolved at runtime based on available RAM.

**Under 8 GB RAM:**

| Complexity | Model        |
|------------|--------------|
| Low        | tinyllama    |
| Mid        | tinydolphin  |
| High       | gemma2:2b    |
| Fallback   | phi          |

**8 GB RAM and above:**

| Complexity | Model        |
|------------|--------------|
| Low        | llama2:7b    |
| Mid        | mistral      |
| High       | llama3.2:3b  |
| Fallback   | llama2:13b   |

---

## Source Files

| File | Description |
|------|-------------|
| `src/main.py` | Entry point. Accepts a prompt via CLI argument, runs complexity classification, and writes results to `data/test.txt`. |
| `src/prompt.py` | Implements `classify_prompt_complexity()` using NLTK for length, NER, and syntactic analysis. |
| `src/modelInitialization.py` | Reads `data/config.json` and returns the model set for the detected RAM tier. |
| `src/textSimilarity.py` | Loads Qwen2.5-1.5B via unsloth, scores semantic similarity, and updates adaptive thresholds in `data/threshold.json`. |
| `src/textSimilarity-mock.py` | Drop-in mock for `textSimilarity.py` used in offline or testing environments. Returns a fixed score of 0.75. |
| `src/gui.py` | Tkinter-based GUI that wraps `scripts/frugalSot.sh`. Displays execution status on the left panel and the final model output on the right panel. |

---

## Setup

### Prerequisites

- Linux (Ubuntu 22.04 or equivalent)
- Python 3.8+
- [Ollama](https://ollama.com) installed and running
- `jq` and `bc` available in the shell environment

### Installation

```bash
git clone https://github.com/HyperKuvid-Labs/FrugalSOT.git
cd FrugalSOT

python -m venv fenv
source fenv/bin/activate

pip install -r requirements.txt
```

### Running

**Shell (interactive):**
```bash
cd scripts
bash frugalSot.sh
```

**GUI:**
```bash
cd src
python gui.py
```

**Classify a prompt only:**
```bash
python src/main.py "Explain the implications of quantum entanglement on cryptography"
```

**Model initialization check:**
```bash
python src/modelInitialization.py 16
```

### Docker

```bash
# Build
docker build -t frugalsot-cli .

# Run
docker run --rm frugalsot-cli "What is machine learning?"

# Docker Compose
docker-compose run --rm frugalsot "What is machine learning?"
```

See [DOCKER.md](DOCKER.md) for full Docker usage details.

---

## Data Files

| File | Description |
|------|-------------|
| `data/config.json` | Model assignments per RAM tier and complexity level. |
| `data/threshold.json` | Current adaptive thresholds per complexity tier. Updated after each inference. |
| `data/test.txt` | Temporary store for prompt, complexity, relevance score, and result of the current request. |
| `data/output.txt` | Raw model response from the most recent Ollama invocation. |

Per-GPU threshold files (e.g., `data/threshold_a100.json`) are available for hardware-specific calibration. The active threshold file is controlled by the `THRESHOLD_FILE` environment variable.

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `nltk` | Tokenization, POS tagging, NER for complexity classification |
| `unsloth` | Efficient 4-bit loading of Qwen2.5-1.5B for relevance scoring |
| `torch` | Model inference backend |
| `transformers` | Tokenizer and model loading |
| `accelerate` | Device dispatch and mixed-precision support |
| `bitsandbytes` | 4-bit quantization |
| `python-dotenv` | Optional environment variable loading |

---

## System Requirements

- OS: Ubuntu 22.04 or equivalent Linux environment
- Python: 3.8 or higher
- Ollama: Required for all model execution
- Minimum RAM: 4 GB (limited model set); 8 GB or above for full model tier access

---

## Contributing

Issues and pull requests are welcome. Please ensure changes to the complexity classifier or threshold logic are accompanied by test prompts demonstrating the expected classification behavior.

---

## Contact

Email: mantissa6789@gmail.com
Repository: [GitHub - HyperKuvid-Labs/FrugalSOT](https://github.com/HyperKuvid-Labs/FrugalSOT)
CLI Tool: [GitHub - HyperKuvid-Labs/FrugalSOT-CLI](https://github.com/HyperKuvid-Labs/FrugalSOT-CLI)
