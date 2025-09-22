package main

import "net/http"

func (s *server) internalServerError(w http.ResponseWriter) {
	sendError(w, http.StatusInternalServerError, "server encountered a prblem")
}

func (s *server) badRequestError(w http.ResponseWriter, err error) {
	sendError(w, http.StatusBadRequest, err.Error())
}

func (s *server) notFoundError(w http.ResponseWriter) {
	sendError(w, http.StatusNotFound, "resource not found")
}