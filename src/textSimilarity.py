import json
from sentence_transformers import SentenceTransformer, util

def calculate_contextual_relevance(prompt, response, complexity):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    prompt_embedding = model.encode(prompt)
    response_embedding = model.encode(response)
    
    relevance_score = util.cos_sim(prompt_embedding, response_embedding)[0][0]
    
    threshold = 0.5
    
    if complexity == "Low":
        threshold = 0.4441
    elif complexity == "Mid":
        threshold = 0.6537
    elif complexity == "High":
        threshold = 0.6934
    
    #print(threshold)
    
    return {
        "relevance_score": float(relevance_score),
        "is_relevant": float(relevance_score) > threshold  
    }

def main():
    print("Running similarity test....")
    
    with open("../data/test.txt", "r") as file:
        data = json.load(file)
        prompt = data["prompt"]
        complexity = data["complexity"]

    with open("../data/output.txt", "r") as file:
        response = file.readlines()

    relevance_result = calculate_contextual_relevance(prompt, response, complexity)
    
    #print("Prompt:", prompt)
    #print("Response:", response)
    print("Relevance Score:", relevance_result['relevance_score'])
    print("Is Relevant:", relevance_result['is_relevant'])
    
    data["relevant"] = str(relevance_result['is_relevant'])
    
    with open("../data/test.txt", "w") as file:
        json.dump(data, file, indent=2)

if __name__ == "__main__":
    main()
