package main

import (
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/mateusz-skiba/blogger/store"
)

var (
	errInvalidCredentials = errors.New("invalid email or password")
	errNotAuthenticated = errors.New("authentication required")
)

type RegisterUserRequest struct {
	Username string `json:"username" validate:"required,min=3,max=100"`
	Email string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,min=6,max=72"`
}

func (s *server) registerUserHandler(w http.ResponseWriter, r *http.Request) {
	var request RegisterUserRequest
	if err := readJSON(r, &request); err != nil {
		s.badRequestError(w, r, err)
		return
	}

	if err := Validate.Struct(request); err != nil {
		s.badRequestError(w, r, err)
		return
	}

	user := &store.User{
		Username: request.Username,
		Email: request.Email,
	}

	if err := user.Password.Set(request.Password); err != nil {
		s.internalServerError(w, r, err)
		return
	}

	if err := s.store.Users.Create(r.Context(), user); err != nil {
		s.internalServerError(w, r, err)
		return
	}

	if err := s.jsonResponse(w, http.StatusCreated, user); err != nil {
		s.internalServerError(w, r, err)
	}
}

type LoginUserRequest struct {
	Email string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,min=6,max=72"`
}

func (s *server) loginUserHandler(w http.ResponseWriter, r * http.Request) {
	var request LoginUserRequest
	if err := readJSON(r, &request); err != nil {
		s.badRequestError(w, r, err)
		return
	}

	if err := Validate.Struct(request); err != nil {
		s.badRequestError(w, r, err)
		return
	}

	user, err := s.store.Users.GetByEmail(r.Context(), request.Email)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			s.unauthorizedErrorResponse(w, r, errInvalidCredentials)
		default:
			s.internalServerError(w, r, err)
		}
		return
	}

	if err := user.Password.Compare(request.Password); err != nil {
		s.unauthorizedErrorResponse(w, r, errInvalidCredentials)
		return
	}

	claims := jwt.MapClaims{
		"sub": user.Id,
		"exp": time.Now().Add(s.config.auth.exp).Unix(),
		"iat": time.Now().Unix(),
		"nbf": time.Now().Unix(),
		"iss": s.config.auth.iss,
		"aud": s.config.auth.iss,
	}

	token, err := s.authenticator.GenerateToken(claims)
	if err != nil {
		s.internalServerError(w, r, err)
		return
	}

	cookie := &http.Cookie{
		Name: "token",
		Value: token,
		HttpOnly: true,
		Secure: true,
		SameSite: http.SameSiteLaxMode,
		Path: "/",
		Expires: time.Now().Add(s.config.auth.exp),
		MaxAge: int(s.config.auth.exp.Seconds()),
	}

	http.SetCookie(w, cookie)

	if err := s.jsonResponse(w, http.StatusOK, nil); err != nil {
		s.internalServerError(w, r, err)
	}
}

func (s *server) logoutUserHandler(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name: "token",
		Value: "",
		HttpOnly: true,
		Secure: true,
		SameSite: http.SameSiteLaxMode,
		Path: "/",
		Expires: time.Now(),
		MaxAge: -1,
	}

	http.SetCookie(w, cookie)

	if err := s.jsonResponse(w, http.StatusOK, nil); err != nil {
		s.internalServerError(w, r, err)
	}
}