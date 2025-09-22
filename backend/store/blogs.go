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

func (s *BlogStore) ListBlogs(ctx context.Context, q PaginatedBlogsQuery) ([]Blog, Meta, error) {
	query := `
		SELECT 
			b.id, b.user_id, b.title, left(b.content, 300) as content, b.created_at, b.updated_at,
			COUNT(*) OVER() AS total
		FROM
			blogs b
		WHERE 
			(b.title ILIKE '%' || $1 || '%' OR b.content ILIKE '%' || $1 || '%')
		LIMIT
			$2
		OFFSET
			$3
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	blogs := []Blog{}
	meta := Meta{}
	rows, err := s.db.QueryContext(ctx, query, q.SearchQuery, q.Limit, q.Offset)
	if err != nil {
		return nil, meta, err
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
			&meta.TotalCount,
		)
		if err != nil {
			return nil, meta, err
		}
		blogs = append(blogs, blog)
	}

	if err = rows.Err(); err != nil {
		return nil, meta, err
	}

	meta.TotalPages = (meta.TotalCount + q.Limit - 1) / q.Limit
	meta.CurrentPage = (q.Offset / q.Limit) + 1
	meta.Offset = q.Offset
	meta.Limit = q.Limit

	return blogs, meta, nil
}