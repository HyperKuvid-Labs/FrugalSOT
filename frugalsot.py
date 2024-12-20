import sys
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag, ne_chunk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download necessary NLTK resources if not already done
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))

    # Tokenize and lemmatize
    tokens = word_tokenize(text)
    tokens = [
        lemmatizer.lemmatize(token.lower()) 
        for token in tokens 
        if token.isalpha() and token.lower() not in stop_words
    ]
    
    return tokens

def calculate_similarity(text1, text2):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([' '.join(text1), ' '.join(text2)])
    return cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

def extract_knowledge_triples(text):
    tokens = word_tokenize(text)
    tagged = pos_tag(tokens)

    subject = ""
    predicate = ""
    obj = ""

    for i, (word, tag) in enumerate(tagged):
        if 'NN' in tag:
            if not subject:
                subject = word
            else:
                obj = word
        if 'VB' in tag:
            predicate = word

    if subject and predicate and obj:
        return [(subject, predicate, obj)]
    
    return []

def check_consistency(triples1, triples2):
    for triple in triples1:
        if triple not in triples2:
            return False
    return True

def process(text1, text2):

    processed_generated = preprocess_text(text1)
    processed_reference = preprocess_text(text2)

    similarity_score = calculate_similarity(processed_generated, processed_reference)

    generated_triples = extract_knowledge_triples(text1)
    reference_triples = extract_knowledge_triples(text2)

    is_consistent = check_consistency(generated_triples, reference_triples)

    print(f"Similarity Score: {similarity_score:.4f}")
    print(f"Is Consistent: {is_consistent}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 textSimilarity.py <text1> <text2>")
        sys.exit(1)
    text1 = sys.argv[1]
    text2 = sys.argv[2]
    print(f"{process(text1, text2):.16f}")
