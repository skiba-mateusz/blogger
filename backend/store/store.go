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
	ErrDuplicateEmail = errors.New("user with that email already exists")
)

type Store struct {
	Blogs interface {
		GetById(ctx context.Context, id int64) (*Blog, error)
		ListBlogs(ctx context.Context, q PaginatedBlogsQuery) ([]Blog, Meta, error)
	}
	Users interface {
		GetById(ctx context.Context, id int64) (*User, error)
		GetByEmail(ctx context.Context, email string) (*User, error)
		Create(ctx context.Context, user *User) (error)
	}
}

func New(db *sql.DB) Store {
	return Store{
		Blogs: &BlogStore{
			db: db,
		},
		Users: &UserStore{
			db: db,
		},
	}
}