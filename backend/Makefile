include .env
MIGRATIONS_DIR = ./cmd/migrate/migrations

run:
	@go run ./cmd/api/*

test:
	@go test -v ./...

migration:
	@migrate create -ext sql -dir $(MIGRATIONS_DIR) -seq $(filter-out $@, $(MAKECMDGOALS))

migrate-up:
	@migrate -database $(DB_ADDR) -path $(MIGRATIONS_DIR) up

migrate-down:
	@migrate -database $(DB_ADDR) -path $(MIGRATIONS_DIR) down