FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PATH="/app:$PATH"

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    wget \
    jq \
    bc \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip3 install --upgrade pip setuptools wheel && \
    pip3 install --no-cache-dir -r requirements.txt


RUN curl -fsSL https://ollama.com/install.sh | sh


COPY . .


RUN python3 -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger'); nltk.download('maxent_ne_chunker'); nltk.download('words'); nltk.download('punkt_tab'); nltk.download('averaged_perceptron_tagger_eng'); nltk.download('maxent_ne_chunker_tab')"

RUN cat > /app/data/config.json <<'JSON'
{
    "Low": "tinyllama",
    "Mid": "tinydolphin",
    "High": "gemma2:2b",
    "Unknown": "phi"
}
JSON

EXPOSE 11434

RUN apt-get update && apt-get install -y sudo



ENTRYPOINT ["/bin/bash"]