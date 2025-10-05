import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { useBlog } from "@/features/blogs/api/get-blog";

import "highlight.js/styles/github-dark.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function BlogRoute() {
  const { blog, isLoading, isError } = useBlog();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    contentRef.current
      .querySelectorAll("pre code")
      .forEach((block) => hljs.highlightElement(block as HTMLElement));
  }, [blog]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="animate-spin" size={64} />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <Alert variant="destructive">
        There was an error trying to fetch blog. Try again later
      </Alert>
    );
  }

  return (
    <section>
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ChevronLeft />
        Back
      </Button>
      <div className="max-w-[40rem] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <div>
            <Link
              className="flex items-center gap-2 group font-medium"
              to={`/app/users/${blog.id}`}
            >
              <div className="group-hover:scale-105 duration-200">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{blog.user.username}</AvatarFallback>
                </Avatar>
              </div>
              <span className="group-hover:underline">
                {blog.user.username}
              </span>
            </Link>
          </div>
        </div>
        <div
          ref={contentRef}
          className="space-y-[1em]"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        ></div>
      </div>
    </section>
  );
}
