import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Blog } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function BlogPreview({ blog }: { blog: Blog }) {
  return (
    <Card className="blog relative hover:translate-y-2 duration-300">
      <Link to={`/app/blogs/${blog.id}`} className="absolute inset-0 z-10" />
      <CardHeader>
        <Link to={`/app/users/${blog.userId}`} className="w-fit relative z-30">
          <Avatar className="hover:scale-105 duration-200">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{blog.user.username}</AvatarFallback>
          </Avatar>
        </Link>
        <CardTitle className="text-3xl">{blog.title}</CardTitle>
        <CardAction>
          <Button asChild className="relative z-20">
            <Link to={`/app/blogs/${blog.id}`}>Read</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div
          className="space-y-[1em] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary-foreground/50 before:to-primary-foreground"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog.content),
          }}
        ></div>
      </CardContent>
    </Card>
  );
}
