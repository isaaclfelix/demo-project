import { preloadQuery } from "convex/nextjs";

import { Section } from "@/components/web/Section";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { PostCard } from "./_components/PostCard";

type PostPageParams = {
  params: Promise<{ postId: string }>;
};

export default async function PostPage({
  params,
}: PostPageParams): Promise<React.ReactNode> {
  const { postId } = await params;

  const preloadedPost = await preloadQuery(api.posts.getPost, {
    id: postId as Id<"posts">,
  });

  return (
    <Section>
      <PostCard post={preloadedPost} />
    </Section>
  );
}
