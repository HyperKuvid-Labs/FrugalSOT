import json
import os
from pathlib import Path

# Get absolute paths
DATA_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) / "data"
THRESHOLD_FILE = DATA_DIR / "threshold.json"

DEFAULT_THRESHOLDS = {
    "low": 0.4441,
    "mid": 0.6537,
    "high": 0.6934,
    "alpha": 0.01
}

def load_thresholds():
    if THRESHOLD_FILE.exists():
        with open(THRESHOLD_FILE, "r") as f:
            return json.load(f)
    return DEFAULT_THRESHOLDS.copy()

def save_thresholds(thresholds):
    with open(THRESHOLD_FILE, "w") as f:
        json.dump(thresholds, f, indent=2)

def calculate_mock_relevance(prompt, response, complexity, thresholds):
    """Mock relevance calculation for testing without internet access"""
    # For testing, we'll simulate a relevance check
    # In a real implementation, this would use sentence transformers
    mock_relevance_score = 0.75  # Simulate a good relevance score
    
    threshold_key = complexity.lower()
    
    if threshold_key not in thresholds:
        return {
            "relevance_score": mock_relevance_score,
            "is_relevant": True 
        }
        
    old_value = thresholds[threshold_key]
    thresholds[threshold_key] = (thresholds["alpha"] * mock_relevance_score) + ((1 - thresholds["alpha"]) * old_value)
    
    return {
        "relevance_score": mock_relevance_score,
        "is_relevant": mock_relevance_score >= old_value,
        "updated_thresholds": thresholds
    }

def main():
    print("Running mock similarity test...")
    
    thresholds = load_thresholds()
    
    with open(DATA_DIR / "test.txt", "r") as file:
        data = json.load(file)
        prompt = data["prompt"]
        complexity = data["complexity"]

    try:
        with open(DATA_DIR / "output.txt", "r") as file:
            response = file.readlines()
    except FileNotFoundError:
        response = ["Mock response"]

    relevance_result = calculate_mock_relevance(prompt, response, complexity, thresholds)
    
    print(f"Relevance Score: {relevance_result['relevance_score']:.4f}")
    print(f"Is Relevant: {relevance_result['is_relevant']}")
    
    save_thresholds(relevance_result["updated_thresholds"])
    
    data["relevant"] = str(relevance_result['is_relevant'])
    with open(DATA_DIR / "test.txt", "w") as file:
        json.dump(data, file, indent=2)

if __name__ == "__main__":
    main()