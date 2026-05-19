import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchQuery } from "convex/nextjs";

import { Section } from "@/components/web/Section";
import { api } from "@/convex/_generated/api";

import { PostsSection } from "./_components/PostsSection";

export const metadata: Metadata = {
  title: "bed.dev | Blog",
  description: "A demo application using Next.js and Convex",
};

export default async function BlogPage() {
  const posts = await fetchQuery(api.posts.getPosts, {
    offset: 0,
    limit: 10,
  });

  if (posts instanceof Error) {
    notFound();
  }

  return (
    <Section>
      <h1 className="mb-4 text-center text-2xl font-bold">Blog</h1>
      <p className="mb-8 text-center text-sm text-gray-500">
        A collection of posts regarding the Convex + Next.js setup.
      </p>
      <PostsSection posts={posts} />
    </Section>
  );
}
