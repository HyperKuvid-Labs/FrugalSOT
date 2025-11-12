package main

import (
	"context"
	"fmt"
	"os"

	"github.com/HyperKuvid-Labs/FrugalSOT/FrugalSOT-Go/internal/complexity"
	"github.com/HyperKuvid-Labs/FrugalSOT/FrugalSOT-Go/internal/model"
	"github.com/ollama/ollama/api"
)

func main() {
	if len(os.Args) < 3 || os.Args[1] != "run" {
		fmt.Println("Usage: frugalsot run \"<prompt>\"")
		os.Exit(1)
	}

	prompt := os.Args[2]
	hierarchy := []string{"Low", "Mid", "High", "Fallback"}

	client, err := api.ClientFromEnvironment()
	if err != nil {
		fmt.Println("Error creating API client:", err)
		return
	}
	ctx := context.Background()

	comp := complexity.ClassifyPromptComplexity(prompt)
	fmt.Printf("complexity: %s\n", comp)

	configPath := model.GetConfigPath("configs/config.yaml")
	modelConfig, err := model.LoadConfig(configPath)

	embeddingModel, ok := modelConfig["EmbeddingModel"]

	if !ok {
		fmt.Println("Embedding model not found in config")
		return
	}

	if err != nil {
		fmt.Println("Error loading config:", err)
		return
	}

	currentIdx := -1
	for i, level := range hierarchy {
		if level == comp {
			currentIdx = i
			break
		}
	}
	response, similarity, threshold := "", float32(0), float32(0)
	for i := currentIdx; i < len(hierarchy); i++ {
		comp = hierarchy[i]
		nextModel := modelConfig[comp]
		if nextModel == "" {
			fmt.Printf("No model found for %s complexity, stopping escalation.\n", comp)
			break
		}
		fmt.Printf(" %s complexity with model %s\n", comp, nextModel)
		response, err = model.GenerateResponse(ctx, client, prompt, nextModel)
		if err != nil {
			fmt.Println("Error generating response:", err)
			return
		}
		fmt.Println("Response:", response)
		if comp == "Fallback" {
			fmt.Println("Reached Fallback level, stopping escalation.")
			break
		}
		similarity = model.GetSimilarity(ctx, client, prompt, response, embeddingModel)
		fmt.Printf("Similarity between prompt and response: %.4f\n", similarity)

		threshold, err = model.GetThreshold(comp)
		fmt.Printf("Threshold for %s complexity: %f\n", comp, threshold)
		if err != nil {
			fmt.Println("Error getting threshold:", err)
			return
		}
		if similarity >= threshold {
			fmt.Printf("Response meets the quality threshold at %s complexity.\n", comp)
			break
		}
		err = model.UpdateThreshold(comp, similarity)
		if err != nil {
			fmt.Println("Error updating threshold:", err)
		}
	}
	fmt.Println("Final Complexity:", comp)
	fmt.Println("Final Similarity:", similarity)
	fmt.Println("Final Response:\n", response)

}
