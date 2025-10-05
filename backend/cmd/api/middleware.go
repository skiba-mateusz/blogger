package main

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
)

func (s * server) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			switch err {
			case http.ErrNoCookie:
				s.unauthorizedErrorResponse(w, r, fmt.Errorf("authentication cookie not found"))
			default: 
				s.badRequestError(w, r, err)
			}
			return
		}

		tokenString := cookie.Value
		token, err := s.authenticator.ParseToken(tokenString)
		if err != nil {
			s.unauthorizedErrorResponse(w, r, err)
			return
		}

		claims, _ := token.Claims.(jwt.MapClaims)

		userId, err := strconv.ParseInt(fmt.Sprintf("%.f", claims["sub"]), 10, 64)
		if err != nil {
			s.unauthorizedErrorResponse(w, r, err)
			return
		}

		ctx := r.Context()

		user, err := s.store.Users.GetById(ctx, userId)
		if err != nil {
			s.unauthorizedErrorResponse(w, r, err)
			return
		}

		ctx = context.WithValue(ctx, userCtx, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}