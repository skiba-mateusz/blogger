package main

import "net/http"

func (s *server) internalServerError(w http.ResponseWriter, r *http.Request, err error) {
	s.logger.Errorw("internal server error", "method", r.Method, "path", r.URL.Path, "error", err.Error())
	sendError(w, http.StatusInternalServerError, "server encountered a prblem")
}

func (s *server) badRequestError(w http.ResponseWriter, r *http.Request, err error) {
	sendError(w, http.StatusBadRequest, err.Error())
}

func (s *server) notFoundError(w http.ResponseWriter, r *http.Request, err error) {
	sendError(w, http.StatusNotFound, "resource not found")
}

func (s *server) unauthorizedErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	sendError(w, http.StatusUnauthorized, err.Error())
}