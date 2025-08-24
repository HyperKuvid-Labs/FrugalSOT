# FrugalSOT CLI Makefile

.PHONY: build test run clean help

VERSION ?= latest
IMAGE_NAME = frugalsot-cli

help:
	@echo "FrugalSOT CLI - Docker Build Commands"
	@echo ""
	@echo "Commands:"
	@echo "  build      Build the Docker image"
	@echo "  test       Run tests with mock data"
	@echo "  run        Run the CLI with example prompt"
	@echo "  clean      Clean up Docker images"
	@echo "  release    Build and prepare for release"
	@echo ""
	@echo "Variables:"
	@echo "  VERSION    Docker image version (default: latest)"
	@echo ""
	@echo "Examples:"
	@echo "  make build"
	@echo "  make test"
	@echo "  make run PROMPT='What is AI?'"
	@echo "  make release VERSION=v1.0.0"

build:
	@echo "🚀 Building FrugalSOT CLI Docker image..."
	docker build -t $(IMAGE_NAME):$(VERSION) .
	@echo "✅ Build completed!"

test:
	@echo "🧪 Running FrugalSOT CLI tests..."
	./frugalsot-cli-test "What is artificial intelligence?"
	./frugalsot-cli-test "Explain machine learning algorithms"
	@echo "✅ All tests passed!"

run:
	@echo "🎯 Running FrugalSOT CLI..."
ifdef PROMPT
	./frugalsot-cli-test "$(PROMPT)"
else
	./frugalsot-cli-test "What is artificial intelligence?"
endif

clean:
	@echo "🧹 Cleaning up Docker images..."
	-docker rmi $(IMAGE_NAME):$(VERSION) 2>/dev/null || true
	-docker rmi $(IMAGE_NAME):latest 2>/dev/null || true
	@echo "✅ Cleanup completed!"

release: build
	@echo "📦 Preparing release..."
	./build-release.sh $(VERSION)
	@echo "🎉 Release ready!"

# Docker-specific targets
docker-build: build

docker-run:
	@echo "🐳 Running with Docker..."
ifdef PROMPT
	docker run --rm $(IMAGE_NAME):$(VERSION) "$(PROMPT)"
else
	docker run --rm $(IMAGE_NAME):$(VERSION) "What is artificial intelligence?"
endif

docker-test:
	@echo "🐳 Testing with Docker..."
	docker run --rm $(IMAGE_NAME):$(VERSION) "What is AI?"
	docker run --rm $(IMAGE_NAME):$(VERSION) "Explain complex machine learning concepts"