import sys
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download('punkt')
nltk.download('stopwords')

def extract_keywords(text):
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text)
    keywords = [word.lower() for word in tokens if word.isalpha() and word.lower() not in stop_words]
    return set(keywords)

def evaluate_relevance(expected_answer, generated_response):
    expected_keywords = extract_keywords(expected_answer)
    generated_keywords = extract_keywords(generated_response)
    matches = expected_keywords.intersection(generated_keywords)
    if not expected_keywords:
        return 0.0
    return len(matches) / len(expected_keywords)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 textSimilarity.py <expected_answer> <generated_response>")
        sys.exit(1)

    expected_answer = sys.argv[1]
    generated_response = sys.argv[2]

    print(f"{evaluate_relevance(expected_answer, generated_response):.16f}")
