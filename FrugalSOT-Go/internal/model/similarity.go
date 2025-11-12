package model

import (
	"context"
	"math"

	"github.com/ollama/ollama/api"
)

func GetSimilarity(ctx context.Context, client *api.Client, text1, text2 string, model string) float32 {

	emb1, err := getEmbedding(ctx, client, text1, model)
	if err != nil {
		return 0
	}
	emb2, err := getEmbedding(ctx, client, text2, model)
	if err != nil {
		return 0
	}
	similarity := cosineSimilarity(emb1, emb2)
	return similarity
}

func getEmbedding(ctx context.Context, client *api.Client, text string, model string) ([]float32, error) {

	req := &api.EmbedRequest{
		Model: model,
		Input: text,
	}

	resp, err := client.Embed(ctx, req)
	if err != nil {
		return nil, err
	}
	return resp.Embeddings[0], nil
}

func cosineSimilarity(a, b []float32) float32 {
	var dotProduct, normA, normB float32
	for i := range a {
		dotProduct += a[i] * b[i]
		normA += a[i] * a[i]
		normB += b[i] * b[i]
	}
	return dotProduct / (float32(math.Sqrt(float64(normA))) *
		float32(math.Sqrt(float64(normB))))
}

// func main() {
// 	client, _ := api.ClientFromEnvironment()
// 	ctx := context.Background()

// 	text1 := "AI"
// 	text2 := "Artificial Intelligence"

// 	emb1 := getEmbedding(ctx, client, text1)
// 	emb2 := getEmbedding(ctx, client, text2)

// 	similarity := cosineSimilarity(emb1, emb2)
// 	fmt.Printf("Similarity: %.4f (%.1f%%)\n", similarity, similarity*100)
// }
