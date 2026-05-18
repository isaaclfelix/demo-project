"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { PostContent } from "@/components/web/blog/PostContent";
import { api } from "@/convex/_generated/api";

type PostCardProps = {
  post: Preloaded<typeof api.posts.getPost>;
};

export function PostCard({ post }: PostCardProps) {
  const postData = usePreloadedQuery(post);

  if (postData instanceof Error) {
    return null;
  }

  return (
    <div>
      <h1>{postData.title}</h1>
      <PostContent postContent={postData.content} />
    </div>
  );
}
