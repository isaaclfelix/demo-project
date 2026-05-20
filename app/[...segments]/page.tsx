import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchQuery } from "convex/nextjs";

import { Breadcrumbs } from "@/components/web/blog/Breadcrumbs";
import { Section } from "@/components/web/Section";
import { api } from "@/convex/_generated/api";

import { PostCard } from "../blog/[postId]/_components/PostCard";

type Props = { params: Promise<{ segments: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;

  if (segments.length !== 3) {
    return {};
  }

  const pathKey = `${segments[0]}/${segments[1]}`;
  const slug = segments[2];
  const post = await fetchQuery(api.posts.getPostByCategoryPathAndSlug, {
    pathKey,
    slug,
  });

  if (!post) {
    return {};
  }

  return {
    title: `bed.dev | ${post.title}`,
    description: post.excerpt,
  };
}

export default async function RootPostPage({ params }: Props) {
  const { segments } = await params;

  if (segments.length !== 3) {
    notFound();
  }

  const pathKey = `${segments[0]}/${segments[1]}`;
  const slug = segments[2];

  const post = await fetchQuery(api.posts.getPostByCategoryPathAndSlug, {
    pathKey,
    slug,
  });

  if (!post) {
    notFound();
  }

  const crumbs = await fetchQuery(api.categories.getCategoryBreadcrumbs, {
    pathKey,
  });

  const breadcrumbItems = crumbs ?? [];

  return (
    <Section>
      <Breadcrumbs
        items={[
          ...breadcrumbItems,
          { label: post.title, href: post.canonicalPath ?? "#" },
        ]}
        currentIndex={breadcrumbItems.length}
      />
      <PostCard post={post} />
    </Section>
  );
}
