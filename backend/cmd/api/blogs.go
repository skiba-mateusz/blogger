package main

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/mateusz-skiba/blogger/store"
)

func (s *server) getBlogHandler(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		s.internalServerError(w)
		return
	}

	blog, err := s.store.Blogs.GetById(r.Context(), id)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			s.notFoundError(w)
		default:
			s.internalServerError(w)
		}
		return
	}

	if err := s.jsonResponse(w, http.StatusOK, blog); err != nil {
		s.internalServerError(w)
	}
}

func (s *server) listBlogsHandler(w http.ResponseWriter, r *http.Request) {
	blogs, err := s.store.Blogs.ListBlogs(r.Context())
	if err != nil {
		s.internalServerError(w)
		return
	}

	if err := s.jsonResponse(w, http.StatusOK, blogs); err != nil {
		s.internalServerError(w)
	}
}