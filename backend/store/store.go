package store

import (
	"context"
	"database/sql"
)

type Store struct {
	Blogs interface {
		GetById(ctx context.Context, id int64) (*Blog, error)
	}
}

func New(db *sql.DB) Store {
	return Store{
		Blogs: &BlogStore{
			db: db,
		},
	}
}