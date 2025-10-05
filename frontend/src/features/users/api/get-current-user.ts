import { api } from "@/lib/api-client";
import type { User } from "@/types/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

async function getCurrentUser(): Promise<User> {
  const { data } = await api.get("/users/current");
  return data;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsError(false);
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, isError, isLoading };
}
