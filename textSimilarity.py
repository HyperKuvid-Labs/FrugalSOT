import sys
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('wordnet')
nltk.download('punkt')
nltk.download('stopwords')

def textSimilarity(text1, text2):
    token1 = word_tokenize(text1)
    token2 = word_tokenize(text2)

    lemmatizer = WordNetLemmatizer()

    token1 = [lemmatizer.lemmatize(token) for token in token1]
    token2 = [lemmatizer.lemmatize(token) for token in token2]

    stop_words = set(stopwords.words('english'))
    token1 = [token for token in token1 if token.lower() not in stop_words]
    token2 = [token for token in token2 if token.lower() not in stop_words]

    vectorizer = TfidfVectorizer()
    vector1 = vectorizer.fit_transform([' '.join(token1)])
    vector2 = vectorizer.transform([' '.join(token2)])

    similarity = cosine_similarity(vector1, vector2)
    return similarity[0][0] 

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 textSimilarity.py <text1> <text2>")
        sys.exit(1)

    text1 = sys.argv[1]
    text2 = sys.argv[2]

    similarity_score = textSimilarity(text1, text2)
    print(similarity_score) 
