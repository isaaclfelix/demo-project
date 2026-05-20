import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchQuery } from "convex/nextjs";

import { variants as headingVariants } from "@/components/web/blog/Heading/variants";
import { Section } from "@/components/web/Section";
import { cn } from "@/lib/utils";
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
      <h1
        className={cn(
          headingVariants({ level: "level-1" }),
          "mt-0 text-center font-bold",
        )}
      >
        Blog
      </h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        A collection of posts regarding the Convex + Next.js setup.
      </p>
      <PostsSection posts={posts} />
    </Section>
  );
}
