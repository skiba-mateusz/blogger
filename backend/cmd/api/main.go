package main

import (
	_ "github.com/joho/godotenv/autoload"
	"github.com/mateusz-skiba/blogger/db"
	"github.com/mateusz-skiba/blogger/env"
	"github.com/mateusz-skiba/blogger/store"
	"go.uber.org/zap"
)

func main() {
	cfg := config{
		addr: env.GetString("ADDR", ":8080"),
		env: env.GetString("ENV", "development"),
		db: dbConfig{
			addr: env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost:5432/blogger?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 15),
			maxIdleTime: env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
	}

	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	db, err := db.Init(
		cfg.db.addr,
		cfg.db.maxOpenConns,
		cfg.db.maxIdleConns,
		cfg.db.maxIdleTime,
	)
	if err != nil {
		logger.Fatal(err)
	}
	defer db.Close()
	logger.Info("database connection pool established")

	store := store.New(db)

	srv := &server{
		config: cfg,
		store: store,
		logger: logger,
	}

	mux := srv.mount()
	logger.Fatal(srv.run(mux))
}