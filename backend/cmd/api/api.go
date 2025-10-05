package main

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/mateusz-skiba/blogger/auth"
	"github.com/mateusz-skiba/blogger/env"
	"github.com/mateusz-skiba/blogger/store"
	"go.uber.org/zap"
)

type server struct {
	config config
	store store.Store
	authenticator auth.Authenticator
	logger *zap.SugaredLogger
}

type config struct {
	addr string
	env string
	db dbConfig
	auth authConfig
}

type dbConfig struct {
	addr string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime string
}

type authConfig struct {
	secret string
	exp time.Duration
	iss string
}


func (s *server) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
		r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{env.GetString("FRONTEND_URL", "http://localhost:5173")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	r.Use(middleware.Timeout(60 * time.Second))

	r.Route("/v1", func(r chi.Router) {
		r.Get("/health", s.healthCheckHandler)

		r.Route("/blogs", func(r chi.Router) {
			r.Get("/", s.listBlogsHandler)


			r.Route("/{id}", func(r chi.Router) {
				r.Get("/", s.getBlogHandler)
			})
		})

		r.Route("/users", func(r chi.Router) {
			r.Use(s.authMiddleware)

			r.Get("/current", s.getCurrentUserHandler)
		})

		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", s.loginUserHandler)
			r.Post("/register", s.registerUserHandler)
			r.Post("/logout", s.logoutUserHandler)
		})
	})

	return r
}

func (s *server) run(mux http.Handler) error {
	srv := &http.Server{
		Addr: s.config.addr,
		Handler: mux,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	s.logger.Infow("server is listening", "addr", s.config.addr, "env", s.config.env)

	return srv.ListenAndServe()
}