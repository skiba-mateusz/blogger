package main

import "net/http"

func (s *server) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"status": "ok",
		"env": s.config.env,
	}

	if err := s.jsonResponse(w, http.StatusOK, data); err != nil {
		s.internalServerError(w)
	}
}