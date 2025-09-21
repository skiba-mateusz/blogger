import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBlogs } from "@/features/blogs/api/get-blog";
import { BlogPreview } from "@/features/blogs/components/blog-preview";
import { Loader, TriangleAlert } from "lucide-react";

export function BlogRoute() {
  const { blogs, isLoading } = useBlogs();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="animate-spin" size={64} />
      </div>
    );
  }

  if (blogs.length <= 0) {
    return (
      <Alert>
        <TriangleAlert />
        <AlertDescription>No blogs to display</AlertDescription>
      </Alert>
    );
  }

  return (
    <section>
      <h2 className="text-4xl mb-6">Explore</h2>
      <ul className="space-y-8">
        {blogs.map((blog) => (
          <li key={blog.id}>
            <BlogPreview blog={blog} />
          </li>
        ))}
      </ul>
    </section>
  );
}
