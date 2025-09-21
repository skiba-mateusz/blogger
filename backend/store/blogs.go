package store

import (
	"context"
	"database/sql"
	"errors"
)

type BlogStore struct {
	db *sql.DB
}

type Blog struct {
	Id int64 `json:"id"`
	UserId int64 `json:"user_id"`
	Title string `json:"title"`
	Content string `json:"content"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

func (s *BlogStore) GetById(ctx context.Context, id int64) (*Blog, error) {
	query := `
		SELECT 
			id, user_id, title, content, created_at, updated_at
		FROM
			blogs
		WHERE
			id = $1
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var blog Blog
	err := s.db.QueryRowContext(ctx, query, id).Scan(
		&blog.Id,
		&blog.UserId,
		&blog.Title,
		&blog.Content,
		&blog.CreatedAt,
		&blog.UpdatedAt,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}
	
	return &blog ,nil
}

func (s *BlogStore) ListBlogs(ctx context.Context) ([]Blog, error) {
	query := `
		SELECT 
			id, user_id, title, left(content, 300) as content, created_at, updated_at
		FROM
			blogs
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	blogs := []Blog{}
	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var blog Blog
		err := rows.Scan(
			&blog.Id,
			&blog.UserId,
			&blog.Title,
			&blog.Content,
			&blog.CreatedAt,
			&blog.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		blogs = append(blogs, blog)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return blogs ,nil
}