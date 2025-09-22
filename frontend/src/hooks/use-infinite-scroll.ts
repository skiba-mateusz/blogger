import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  fetchMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
}

export function useInfiniteScroll({
  fetchMore,
  hasMore,
  isLoading = false,
}: UseInfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasMore && !isLoading) {
        fetchMore();
      }
    },
    [fetchMore, hasMore, isLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, [handleIntersection]);

  return { sentinelRef };
}
