import sys
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt')
nltk.download('stopwords')

def preprocess_text(text):
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text.lower())
    return ' '.join([word for word in tokens if word.isalnum() and word not in stop_words])

def compute_text_relevancy(prompt, answer):
    prompt_clean = preprocess_text(prompt)
    answer_clean = preprocess_text(answer)
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([prompt_clean, answer_clean])
    tfidf_score = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
    prompt_keywords = set(word_tokenize(prompt_clean))
    answer_keywords = set(word_tokenize(answer_clean))
    keyword_coverage = len(prompt_keywords & answer_keywords) / len(prompt_keywords)
    return 0.6 * tfidf_score + 0.4 * keyword_coverage

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 textSimilarity.py <text1> <text2>")
        sys.exit(1)
    text1 = sys.argv[1]
    text2 = sys.argv[2]
    print(compute_text_relevancy(text1, text2))
