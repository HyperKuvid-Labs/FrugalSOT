import json
import os
from pathlib import Path
from sentence_transformers import SentenceTransformer, util

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

    model = SentenceTransformer('BAAI/bge-large-en-v1.5')

    prompt_embedding = model.encode(prompt)
    response_embedding = model.encode(response)

    semantic_score = util.cos_sim(prompt_embedding, response_embedding)[0][0].item()

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
    print("Running enhanced similarity test with BAAI/bge-large-en-v1.5...")

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
