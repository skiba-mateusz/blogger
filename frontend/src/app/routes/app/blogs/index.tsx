import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader, SearchIcon, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useBlogs } from "@/features/blogs/api/get-blog";
import { BlogPreview } from "@/features/blogs/components/blog-preview";
import { Button } from "@/components/ui/button";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export function BlogRoute() {
  const { blogs, isLoading, isLoadingMore, isError, hasMore, loadMore } =
    useBlogs();
  const { sentinelRef } = useInfiniteScroll({
    fetchMore: loadMore,
    hasMore,
    isLoading: isLoadingMore,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInputVal, setSearchInputVal] = useState(
    searchParams.get("search_query") || ""
  );

  function handleSearchBlogs(e: FormEvent) {
    e.preventDefault();
    searchParams.set("search_query", searchInputVal);
    setSearchParams(searchParams);
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertDescription>
          Failed to load blogs. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-4xl">Explore</h2>
        <div className="flex items-center gap-2">
          <form
            className="flex items-center gap-1"
            onSubmit={handleSearchBlogs}
          >
            <Input
              type="text"
              placeholder="Search"
              className="max-w-52"
              value={searchInputVal}
              onChange={(e) => setSearchInputVal(e.target.value)}
            />
            <Button variant="ghost">
              <SearchIcon />
            </Button>
          </form>
        </div>
      </div>
      <ul className="space-y-8">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader className="animate-spin" size={64} />
          </div>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <li key={blog.id}>
              <BlogPreview blog={blog} />
            </li>
          ))
        ) : (
          <Alert>
            <TriangleAlert />
            <AlertDescription>No blogs to display</AlertDescription>
          </Alert>
        )}
        {isLoadingMore && (
          <div className="w-full h-full flex items-center justify-center">
            <Loader className="animate-spin" size={64} />
          </div>
        )}
        {hasMore && !isLoadingMore && (
          <div
            ref={sentinelRef}
            className="sentinel"
            style={{ height: "1px" }}
          />
        )}
      </ul>
    </section>
  );
}
