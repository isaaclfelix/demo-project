"use client";

import Image from "next/image";
import Link from "next/link";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseContentJson } from "@/lib/content";
import PostImage from "@/assets/hero_image.webp";
import { api } from "@/convex/_generated/api";

type PostsSectionProps = {
  preloadedPosts: Preloaded<typeof api.posts.getPosts>;
};

export function PostsSection({ preloadedPosts }: PostsSectionProps) {
  const posts = usePreloadedQuery(preloadedPosts);

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
            <CardDescription className="line-clamp-1">
              {post.excerpt || post.content}
            </CardDescription>
          </CardHeader>
          <CardContent>{parseContentJson(post.content)}</CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/blog/post-1">Read more</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
