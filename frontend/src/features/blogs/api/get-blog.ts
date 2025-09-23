import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api-client";
import type { Blog } from "@/types/api";

async function getBlog(id: string): Promise<Blog> {
  const { data } = await api.get(`/blogs/${id}`);
  return data;
}

export function useBlog() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setIsError(false);
        const data = await getBlog(id);
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog: ", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return { blog, isLoading, isError };
}
