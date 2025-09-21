package main

import "net/http"

func (s *server) internalServerError(w http.ResponseWriter) {
	sendError(w, http.StatusInternalServerError, "server encountered a prblem")
}

func (s *server) notFoundError(w http.ResponseWriter) {
	sendError(w, http.StatusNotFound, "resource not found")
}