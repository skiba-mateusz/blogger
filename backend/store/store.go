package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

var (
	QueryTimeoutDuration = time.Second * 5
	ErrNotFound = errors.New("resource not found")
)

type Store struct {
	Blogs interface {
		GetById(ctx context.Context, id int64) (*Blog, error)
		ListBlogs(ctx context.Context) ([]Blog, error)
	}
}

func New(db *sql.DB) Store {
	return Store{
		Blogs: &BlogStore{
			db: db,
		},
	}
}