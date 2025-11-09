import json
import os
import re
from pathlib import Path
from unsloth import FastLanguageModel
import torch

DATA_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) / "data"
THRESHOLD_FILE_NAME = os.environ.get("THRESHOLD_FILE", "threshold.json")
THRESHOLD_FILE = DATA_DIR / THRESHOLD_FILE_NAME
DEFAULT_THRESHOLDS = {
    "low": 0.4441,
    "mid": 0.6537,
    "high": 0.6934,
    "alpha": 0.01
}

def load_thresholds():
    if THRESHOLD_FILE.exists():
        print(f"Loading thresholds from {THRESHOLD_FILE}")
        with open(THRESHOLD_FILE, "r") as f:
            return json.load(f)
    return DEFAULT_THRESHOLDS.copy()

def save_thresholds(thresholds):
    with open(THRESHOLD_FILE, "w") as f:
        json.dump(thresholds, f, indent=2)

# Global model cache
_model_cache = None
_tokenizer_cache = None

def load_qwen_model():
    global _model_cache, _tokenizer_cache

    if _model_cache is not None and _tokenizer_cache is not None:
        return _model_cache, _tokenizer_cache

    print("Loading Qwen-2.5B model with unsloth...")

    max_seq_length = 2048
    dtype = None  # Auto detection
    load_in_4bit = True  # Use 4bit quantization for efficiency

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name="unsloth/Qwen2.5-1.5B-Instruct",  # Using smaller 1.5B version for efficiency
        max_seq_length=max_seq_length,
        dtype=dtype,
        load_in_4bit=load_in_4bit,
    )

    # Enable fast inference
    FastLanguageModel.for_inference(model)

    _model_cache = model
    _tokenizer_cache = tokenizer

    return model, tokenizer

def calculate_similarity_with_llm(string1, string2):
    prompt = f"""You are evaluating semantic similarity between two strings.

String 1: {string1}

String 2: {string2}

Analysis Steps:
1. Identify the main concepts in each string
2. Compare their semantic overlap
3. Consider context and intent, not just keywords

Provide your reasoning, then output ONLY a score between 0.0 and 1.0.

Reasoning:
[Your analysis here]

Final Score:"""

    model, tokenizer = load_qwen_model()

    # Format as chat message
    messages = [{"role": "user", "content": prompt}]
    input_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

    # Tokenize
    inputs = tokenizer(input_text, return_tensors="pt").to(model.device)

    # Generate response
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=256,
            temperature=0.3,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )

    # Decode response
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract the generated part (after the prompt)
    if input_text in response:
        response = response[len(input_text):].strip()

    # Extract score from response using regex
    score_match = re.search(r'Final Score:\s*([0-9]*\.?[0-9]+)', response)
    if not score_match:
        # Try alternative patterns
        score_match = re.search(r'\b([0-1]\.[0-9]+)\b|\b(0\.[0-9]+)\b|\b(1\.0)\b', response)

    if score_match:
        score = float(score_match.group(1) if score_match.group(1) else score_match.group(0))
        score = max(0.0, min(1.0, score))  # Clamp between 0 and 1
    else:
        print(f"Warning: Could not extract score from response. Using default 0.5")
        print(f"Response: {response}")
        score = 0.5

    return score

def calculate_contextual_relevance(prompt, response, complexity, thresholds):
    if not prompt or len(prompt.strip()) < 3:
        return {
            "relevance_score": 0.0,
            "is_relevant": False,
            "reason": "Empty or too short prompt",
            "updated_thresholds": thresholds
        }

    if not response or len(response.strip()) < 10:
        return {
            "relevance_score": 0.0,
            "is_relevant": False,
            "reason": "Empty or too short response",
            "updated_thresholds": thresholds
        }

    # Use LLM-based semantic similarity with Qwen-2.5b
    semantic_score = calculate_similarity_with_llm(prompt, response)

    prompt_words = len(prompt.split())
    response_words = len(response.split())

    complexity_multipliers = {"low": 2, "mid": 3, "high": 4, "inefficient": 5}
    expected_min_words = prompt_words * complexity_multipliers.get(complexity.lower(), 2)

    length_score = min(1.0, response_words / expected_min_words) if expected_min_words > 0 else 0.5

    prompt_keywords = set(word.lower() for word in prompt.split() if len(word) > 3)
    response_keywords = set(word.lower() for word in response.split() if len(word) > 3)

    if len(prompt_keywords) > 0:
        keyword_overlap = len(prompt_keywords & response_keywords) / len(prompt_keywords)
    else:
        keyword_overlap = 0.5

    combined_score = (
        semantic_score * 0.7 +
        length_score * 0.15 +
        keyword_overlap * 0.15
    )

    threshold_key = complexity.lower()

    if threshold_key not in thresholds:
        return {
            "relevance_score": combined_score,
            "semantic_score": semantic_score,
            "length_score": length_score,
            "keyword_overlap": keyword_overlap,
            "is_relevant": True,
            "reason": "Unknown complexity level",
            "updated_thresholds": thresholds
        }

    old_value = thresholds[threshold_key]
    thresholds[threshold_key] = (thresholds["alpha"] * combined_score) + ((1 - thresholds["alpha"]) * old_value)

    is_relevant = combined_score >= old_value

    return {
        "relevance_score": combined_score,
        "semantic_score": semantic_score,
        "length_score": length_score,
        "keyword_overlap": keyword_overlap,
        "is_relevant": is_relevant,
        "reason": f"Combined score {combined_score:.3f} vs threshold {old_value:.3f}",
        "updated_thresholds": thresholds
    }

def main():
    print("Running enhanced similarity test with Qwen-2.5B (via unsloth)...")

    thresholds = load_thresholds()

    try:
        with open(DATA_DIR / "test.txt", "r") as file:
            data = json.load(file)
            prompt = data.get("prompt", "")
            complexity = data.get("complexity", "low")
    except Exception as e:
        print(f"Error reading test.txt: {e}")
        return

    try:
        with open(DATA_DIR / "output.txt", "r") as file:
            response = file.read().strip()
    except Exception as e:
        print(f"Error reading output.txt: {e}")
        response = ""

    relevance_result = calculate_contextual_relevance(prompt, response, complexity, thresholds)

    print(f"\n{'='*60}")
    print(f"Semantic Score:    {relevance_result.get('semantic_score', 0):.4f}")
    print(f"Length Score:      {relevance_result.get('length_score', 0):.4f}")
    print(f"Keyword Overlap:   {relevance_result.get('keyword_overlap', 0):.4f}")
    print(f"Combined Score:    {relevance_result['relevance_score']:.4f}")
    print(f"Is Relevant:       {relevance_result['is_relevant']}")
    print(f"Reason:            {relevance_result.get('reason', 'N/A')}")
    print(f"{'='*60}\n")

    if "updated_thresholds" in relevance_result:
        save_thresholds(relevance_result["updated_thresholds"])

    data["relevant"] = str(relevance_result['is_relevant'])
    data["relevance_score"] = relevance_result['relevance_score']

    with open(DATA_DIR / "test.txt", "w") as file:
        json.dump(data, file, indent=2)

if __name__ == "__main__":
    main()
