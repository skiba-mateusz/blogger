package main

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (s *server) getBlogHandler(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		s.internalServerError(w)
		return
	}

	if err := s.jsonResponse(w, http.StatusOK, id); err != nil {
		s.internalServerError(w)
	}
}