APP_NAME=frugalsot

.PHONY: build run test fmt lint

build:
	go build -o bin/$(APP_NAME) ./cmd/frugalsot

install:
	/usr/local/go/bin/go build -o /usr/local/bin/frugalsot ./cmd/frugalsot

run:
	go run ./cmd/frugalsot

test:
	go test ./... -v

fmt:
	go fmt ./...

lint:
	golangci-lint run
