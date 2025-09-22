import { api } from "@/lib/api-client";
import { type Blog, type PaginatedResponse } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface GetBlogsParams {
  searchQuery: string;
  limit: number;
  offset: number;
}

async function getBlogs({
  searchQuery,
  limit,
  offset,
}: GetBlogsParams): Promise<PaginatedResponse<Blog>> {
  const { data } = await api.get(
    `/blogs?search_query=${searchQuery}&limit=${limit}&offset=${offset}`
  );
  return data;
}

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Blog>["meta"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search_query") || "";
  const limit = Number(searchParams.get("limit")) || 5;

  const hasMore = meta ? meta.currentPage < meta.totalPages : false;

  useEffect(() => {
    setBlogs([]);
    setMeta(null);
    setIsError(false);
  }, [searchQuery]);

  const fetchBlogs = useCallback(
    async (offset: number, isFirstLoad = false) => {
      try {
        if (isFirstLoad) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setIsError(false);

        const res = await getBlogs({ searchQuery, limit, offset });
        setMeta(res.meta);
        setBlogs((prevBlogs) =>
          isFirstLoad ? res.items : [...prevBlogs, ...res.items]
        );
      } catch (err) {
        console.error("Failed to fetch blogs: ", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery, limit]
  );

  useEffect(() => {
    fetchBlogs(0, true);
  }, [fetchBlogs]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isError && meta) {
      const nextOffset = meta.offset + limit;
      fetchBlogs(nextOffset);
    }
  }, [meta, isLoading, hasMore, isError, limit, fetchBlogs]);

  return { blogs, meta, isLoading, isLoadingMore, isError, hasMore, loadMore };
}
