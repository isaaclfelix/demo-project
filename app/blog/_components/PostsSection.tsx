import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PostImage from "@/assets/hero_image.webp";
import { PostWithParsedContent } from "@/convex/posts";

type PostsSectionProps = {
  posts: PostWithParsedContent[];
};

export function PostsSection({ posts }: PostsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post._id} className="mx-auto w-full max-w-sm pt-0">
          <div className="relative aspect-video bg-black/35">
            <Image
              src={PostImage}
              alt="Post image"
              className="h-auto w-full object-cover brightness-60 grayscale dark:brightness-40"
              fill
            />
          </div>
          <CardHeader>
            <CardAction>
              <Badge variant="secondary">Featured</Badge>
            </CardAction>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {post.excerpt}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href={`/blog/${post._id}`}>Read more</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
