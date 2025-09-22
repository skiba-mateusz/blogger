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
	query := store.PaginatedBlogsQuery{
		SearchQuery: "",
		Limit: 5,
		Offset: 0,
	}

	query, err := query.Parse(r)
	if err != nil {
		s.badRequestError(w, err)
		return
	}

	if err := Validate.Struct(query); err != nil {
		s.badRequestError(w, err)
		return
	}


	blogs, meta, err := s.store.Blogs.ListBlogs(r.Context(), query)
	if err != nil {
		s.internalServerError(w)
		return
	}

	paginatedResponse  := struct{
		Items []store.Blog `json:"items"`
		Meta  store.Meta `json:"meta"`
	} {
		Items: blogs,
		Meta:  meta,
	}

	if err := s.jsonResponse(w, http.StatusOK, paginatedResponse); err != nil {
		s.internalServerError(w)
	}
}