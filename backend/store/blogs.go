package store

import (
	"context"
	"database/sql"
)

type BlogStore struct {
	db *sql.DB
}

type Blog struct {
	Id int64 `json:"id"`
}

func (s *BlogStore) GetById(ctx context.Context, id int64) (*Blog, error) {
	return nil ,nil
}