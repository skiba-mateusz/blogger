import { api } from "@/lib/api-client";
import { type Blog } from "@/types/api";
import { useEffect, useState } from "react";

async function getBlogs(): Promise<Blog[]> {
  const { data } = await api.get("/blogs");
  return data;
}

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { blogs, isLoading, isError };
}
