package model

import (
	"os"
	"strconv"

	"gopkg.in/yaml.v3"
)

type ModelConfig map[string]string

func LoadConfig(filename string) (ModelConfig, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var config ModelConfig
	err = yaml.Unmarshal(data, &config)
	return config, err
}

func GetThreshold(complexity string) (float32, error) {
	thresholdConfig, err := LoadConfig("configs/threshold.yaml")
	if err != nil {
		return 0, err
	}
	thresholdFloat, err := strconv.ParseFloat(thresholdConfig[complexity], 32)
	if err != nil {
		return 0, err
	}
	threshold := float32(thresholdFloat)
	return threshold, nil
}

func UpdateThreshold(complexity string, relevanceScore float32) error {
	// Tnew = α × R + (1-α) × Told
	thresholdConfig, err := LoadConfig("configs/threshold.yaml")
	if err != nil {
		return err
	}
	alpha, err := strconv.ParseFloat(thresholdConfig["Alpha"], 32)
	if err != nil {
		return err
	}
	oldThreshold, err := strconv.ParseFloat(thresholdConfig[complexity], 32)
	if err != nil {
		return err
	}
	updatedThreshold := float32(alpha)*relevanceScore + float32(1-alpha)*float32(oldThreshold)
	thresholdConfig[complexity] = strconv.FormatFloat(float64(updatedThreshold), 'f', -1, 32)

	data, err := yaml.Marshal(&thresholdConfig)
	if err != nil {
		return err
	}
	err = os.WriteFile("configs/threshold.yaml", data, 0644)
	return err
}
