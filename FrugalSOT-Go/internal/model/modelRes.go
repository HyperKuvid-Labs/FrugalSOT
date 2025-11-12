package model

import (
	"context"

	"github.com/ollama/ollama/api"
)

func GenerateResponse(ctx context.Context, client *api.Client, prompt string, model string) (string, error) {

	req := &api.GenerateRequest{
		Model:  model,
		Prompt: prompt,
	}

	stream := false
	req.Stream = &stream

	var fullResponse string
	err := client.Generate(ctx, req, func(resp api.GenerateResponse) error {
		fullResponse += resp.Response
		return nil
	})
	return fullResponse, err
}
