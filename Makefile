.PHONY: run build tidy

run:
	cd backend && go run cmd/server/main.go

build:
	cd backend && go build -o server cmd/server/main.go

tidy:
	cd backend && go mod tidy
