import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostWithParsedContent } from "@/convex/posts";

type PostsSectionProps = {
  posts: PostWithParsedContent[];
};

export function PostsSection({ posts }: PostsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post._id} className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {post.excerpt}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link
                href={
                  post.canonicalPath ?? `/blog/${encodeURIComponent(post._id)}`
                }
              >
                Read more
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
