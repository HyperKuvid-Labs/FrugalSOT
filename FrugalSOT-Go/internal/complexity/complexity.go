package complexity

import (
	"fmt"
	"log"
	"strings"

	"github.com/jdkato/prose/v2"
)

func ClassifyPromptComplexity(prompt string) string {
	// creating document - .NewDocument does tokenization, POS tagging, and NER which can be used as needed
	doc, err := prose.NewDocument(prompt)
	if err != nil {
		log.Fatal(err)
	}

	// length Classification
	words := strings.Fields(prompt)
	length := len(words)
	var lengthComplexity string
	if length <= 5 {
		lengthComplexity = "Low"
	} else if length <= 10 {
		lengthComplexity = "Mid"
	} else {
		lengthComplexity = "High"
	}

	// NER Classification - counting named entities
	entities := doc.Entities()
	entityCount := len(entities)
	var nerComplexity string
	if entityCount == 0 {
		nerComplexity = "Low"
	} else if entityCount <= 3 {
		nerComplexity = "Mid"
	} else {
		nerComplexity = "High"
	}

	// syntactic complexity calculation
	tokens := doc.Tokens()
	conjCount := 0
	subClauseCount := 0

	for _, tok := range tokens {
		if tok.Tag == "CC" {
			conjCount++
		}
		if tok.Tag == "IN" || tok.Tag == "TO" {
			subClauseCount++
		}
	}

	sentences := doc.Sentences()
	numSentences := len(sentences)
	avgSentenceLength := 0.0
	if numSentences > 0 {
		avgSentenceLength = float64(len(tokens)) / float64(numSentences)
	}

	complexityScore := conjCount + subClauseCount
	if avgSentenceLength > 12 {
		complexityScore++
	}

	var syntaxComplexity string
	if complexityScore == 0 {
		syntaxComplexity = "Low"
	} else if complexityScore <= 2 {
		syntaxComplexity = "Mid"
	} else {
		syntaxComplexity = "High"
	}

	// weighted majority logic
	weights := map[string]int{
		"Low":  0,
		"Mid":  2,
		"High": 4,
	}

	// total score
	totalScore := weights[lengthComplexity]*1 +
		weights[nerComplexity]*2 +
		weights[syntaxComplexity]*3

	var majorityComplexity string
	if totalScore <= 12 {
		majorityComplexity = "Low"
	} else if totalScore <= 16 {
		majorityComplexity = "Mid"
	} else {
		majorityComplexity = "High"
	}

	fmt.Printf("Prompt: %s\n", prompt)
	fmt.Printf("Length: %s | NER: %s | Syntactic: %s\n",
		lengthComplexity, nerComplexity, syntaxComplexity)

	fmt.Println("\nNamed Entities:")
	for _, ent := range entities {
		fmt.Printf("  %s (%s)\n", ent.Text, ent.Label)
	}

	fmt.Println("\nPOS Tags:")
	for _, tok := range tokens {
		fmt.Printf("  %s: %s\n", tok.Text, tok.Tag)
	}

	fmt.Printf("\nMajority Complexity: %s\n\n", majorityComplexity)

	return majorityComplexity
}

// func main() {
// 	// result := classifyPromptComplexity("What is the capital of France?")
// 	result := ClassifyPromptComplexity("Explain the economic and political factors that led to the Weimar Republic's hyperinflation crisis of 1923")
// 	fmt.Printf("Result: %s\n", result)
// }
