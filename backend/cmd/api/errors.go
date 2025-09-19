package main

import "net/http"

func (s *server) internalServerError(w http.ResponseWriter) {
	sendError(w, http.StatusInternalServerError, "server encountered a prblem")
}