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
import { BreadcrumbItem } from "@/components/web/blog/Breadcrumbs";
import { cachedGetCategoryBreadcrumbs } from "@/lib/content/cachedGetCategoryBreadcrumbs";
import { cachedGetCategoryByOriginalId } from "@/lib/content/cachedGetCategoryByOriginalId";
import type { PostProjection } from "@/convex/posts";

type PostsSectionProps = {
  posts: PostProjection[];
};

async function getBreadcrumbItems(
  post: PostProjection,
): Promise<BreadcrumbItem[]> {
  const category = await cachedGetCategoryByOriginalId(
    post.permalinkCategoryOriginalId,
  );

  if (!category) {
    return [];
  }

  const breadcrumbItems = await cachedGetCategoryBreadcrumbs(category.pathKey);

  return breadcrumbItems;
}

export async function PostsSection({ posts }: PostsSectionProps) {
  const postsWithBreadcrumbItems: (PostProjection & {
    breadcrumbItems: BreadcrumbItem[];
  })[] = await Promise.all(
    posts.map(async (post) => {
      return {
        ...post,
        breadcrumbItems: await getBreadcrumbItems(post),
      };
    }),
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {postsWithBreadcrumbItems.map((post) => (
        <Card key={post._id} className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              <div className="line-clamp-2">{post.excerpt}</div>
            </CardDescription>
            <CardAction>
              <Badge variant="outline">
                {new Date(post.updatedAt).toLocaleDateString("en-US")}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {post.breadcrumbItems.map((breadcrumbItem, index) => {
                return (
                  <Button
                    key={`${breadcrumbItem.href}-${index}`}
                    variant="outline"
                    asChild
                  >
                    <Link href={breadcrumbItem.href}>
                      {breadcrumbItem.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
            <Button asChild>
              <Link
                href={
                  post.canonicalPath ?? `/blog/${encodeURIComponent(post._id)}`
                }
              >
                Read more
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
