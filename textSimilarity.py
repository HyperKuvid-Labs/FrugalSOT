import sys
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt')
nltk.download('stopwords')

import nltk
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def evaluate_relevance(expected_answer, generated_response):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([expected_answer, generated_response]).toarray()
    
    similarity = cosine_similarity(vectors)
    return similarity[0][1]

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 textSimilarity.py <text1> <text2>")
        sys.exit(1)
    text1 = sys.argv[1]
    text2 = sys.argv[2]
    print(f"{evaluate_relevance(text1, text2):.16f}")
