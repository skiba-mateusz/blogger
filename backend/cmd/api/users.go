package main

import (
	"net/http"

	"github.com/mateusz-skiba/blogger/store"
)

type userKey string

const userCtx userKey = "user"

func (s *server) getCurrentUserHandler(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)

	if user == nil {
		s.unauthorizedErrorResponse(w, r, errNotAuthenticated)
		return
	}

	if err := s.jsonResponse(w, http.StatusOK, user); err != nil {
		s.internalServerError(w, r, err)
	}
}

func getUserFromCtx(r *http.Request) *store.User {
	user, _ := r.Context().Value(userCtx).(*store.User)
	return user
}