#!/bin/bash

# Build and package FrugalSOT CLI Docker container
# This script prepares the container for release

set -e

VERSION=${1:-"latest"}
IMAGE_NAME="frugalsot-cli"
REGISTRY=${2:-""}

echo "🚀 Building FrugalSOT CLI v$VERSION"

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t "$IMAGE_NAME:$VERSION" .

# Tag as latest if not already latest
if [ "$VERSION" != "latest" ]; then
    docker tag "$IMAGE_NAME:$VERSION" "$IMAGE_NAME:latest"
fi

# If registry specified, tag for registry
if [ -n "$REGISTRY" ]; then
    echo "🏷️ Tagging for registry: $REGISTRY"
    docker tag "$IMAGE_NAME:$VERSION" "$REGISTRY/$IMAGE_NAME:$VERSION"
    docker tag "$IMAGE_NAME:$VERSION" "$REGISTRY/$IMAGE_NAME:latest"
    
    echo "📤 Pushing to registry..."
    docker push "$REGISTRY/$IMAGE_NAME:$VERSION"
    docker push "$REGISTRY/$IMAGE_NAME:latest"
fi

echo "✅ Build completed successfully!"
echo "📋 Available images:"
docker images | grep frugalsot-cli

echo ""
echo "🔧 Usage:"
echo "  docker run --rm $IMAGE_NAME:$VERSION \"What is AI?\""
echo ""
echo "💡 For more usage examples, see DOCKER.md"