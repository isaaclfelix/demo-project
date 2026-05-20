import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchQuery } from "convex/nextjs";

import { Breadcrumbs } from "@/components/web/blog/Breadcrumbs";
import { variants as headingVariants } from "@/components/web/blog/Heading/variants";
import { Section } from "@/components/web/Section";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

import { PostsSection } from "../../blog/_components/PostsSection";

type Props = { params: Promise<{ segments: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;

  if (segments.length < 1) {
    return {};
  }

  const pathKey = segments.join("/");
  const category = await fetchQuery(api.categories.getCategoryByPathKey, {
    pathKey,
  });

  if (!category) {
    return {};
  }

  return {
    title: `bed.dev | ${category.name}`,
    description: `Posts in ${category.name}`,
  };
}

export default async function CategoryArchivePage({ params }: Props) {
  const { segments } = await params;

  if (segments.length < 1) {
    notFound();
  }

  const pathKey = segments.join("/");

  const category = await fetchQuery(api.categories.getCategoryByPathKey, {
    pathKey,
  });

  if (!category) {
    notFound();
  }

  const crumbs = await fetchQuery(api.categories.getCategoryBreadcrumbs, {
    pathKey,
  });

  const listing = await fetchQuery(api.categories.listPostsByCategory, {
    categoryOriginalId: category.originalId,
    paginationOpts: { numItems: 10, cursor: null },
  });

  return (
    <Section>
      <Breadcrumbs
        items={crumbs ?? []}
        currentIndex={Math.max(0, (crumbs?.length ?? 1) - 1)}
      />
      <h1
        className={cn(
          headingVariants({ level: "level-1" }),
          "mt-0 text-center font-bold",
        )}
      >
        {category.name}
      </h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Archive for this category.
      </p>
      <PostsSection posts={listing.page} />
    </Section>
  );
}
