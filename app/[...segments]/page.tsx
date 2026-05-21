import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/web/blog/Breadcrumbs";
import { Section } from "@/components/web/Section";
import { cachedGetCategoryBreadcrumbs } from "@/lib/content/cachedGetCategoryBreadcrumbs";
import { cachedGetPostByCategoryPathAndSlug } from "@/lib/content/cachedGetPostByCategoryPathAndSlug";

import { PostCard } from "../blog/[postId]/_components/PostCard";

type Props = { params: Promise<{ segments: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;

  if (segments.length !== 3) {
    return {};
  }

  const pathKey = `${segments[0]}/${segments[1]}`;
  const slug = segments[2];
  const post = await cachedGetPostByCategoryPathAndSlug(pathKey, slug);

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

  const post = await cachedGetPostByCategoryPathAndSlug(pathKey, slug);

  if (!post) {
    notFound();
  }

  const breadcrumbItems = await cachedGetCategoryBreadcrumbs(pathKey);

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
