package store

import (
	"net/http"
	"strconv"
)

type PaginatedBlogsQuery struct {
	SearchQuery string `json:"search_query" validate:"max=100"`
	Limit int `json:"limit" validate:"gte=1,lte=20"`
	Offset int `json:"offset" validate:"gte=0"`
}

type Meta struct {
	TotalCount int `json:"total_count"`
	TotalPages int `json:"total_pages"`
	CurrentPage int `json:"current_page"`
	Offset int `json:"offset"`
	Limit int `json:"limit"`
}

func (q PaginatedBlogsQuery) Parse(r *http.Request) (PaginatedBlogsQuery, error) {
	qs := r.URL.Query()

	searchQuery := qs.Get("search_query")
	if searchQuery != "" {
		q.SearchQuery = searchQuery
	}

	offset := qs.Get("offset")
	if offset != "" {
		offsetInt, err := strconv.Atoi(offset)
		if err != nil {
			return q, nil
		}
		q.Offset = offsetInt
	}

	limit := qs.Get("limit")
	if limit != "" {
		limitInt, err := strconv.Atoi(limit)
		if err != nil {
			return q, nil
		}
		q.Limit = limitInt
	}

	return q, nil
}