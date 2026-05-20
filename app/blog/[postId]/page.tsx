import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Section } from "@/components/web/Section";
import { cachedGetPost } from "@/lib/content/cachedGetPost";

import { PostCard } from "./_components/PostCard";

type GenerateMetadataProps = {
  params: Promise<{ postId: string }>;
};

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { postId } = await params;

  const post = await cachedGetPost(postId);

  if (post instanceof Error) {
    return {};
  }

  return {
    title: `bed.dev | ${post.title}`,
    description: post.excerpt,
  };
}

type PostPageParams = {
  params: Promise<{ postId: string }>;
};

export default async function PostPage({
  params,
}: PostPageParams): Promise<React.ReactNode> {
  const { postId } = await params;

  const post = await cachedGetPost(postId);

  if (post instanceof Error) {
    notFound();
  }

  if (post.canonicalPath) {
    redirect(post.canonicalPath);
  }

  return (
    <Section>
      <PostCard post={post} />
    </Section>
  );
}
