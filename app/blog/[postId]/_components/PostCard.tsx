import { Separator } from "@/components/ui/separator";
import { variants as headingVariants } from "@/components/web/blog/Heading";
import { PostContent } from "@/components/web/blog/PostContent";
import { cn } from "@/lib/utils";
import type { PostProjection } from "@/convex/posts";

type PostCardProps = {
  post: PostProjection;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <div>
      <h1 className={cn(headingVariants({ level: "level-1" }), "mt-0")}>
        {post.title}
      </h1>

      {post.excerpt && <p className="mb-4">{post.excerpt}</p>}

      <div className="mb-4 flex flex-col">
        <p className="w-full text-xs/relaxed text-muted-foreground">
          Published on {new Date(post.createdAt).toLocaleDateString("en-US")}.
          Updated on {new Date(post.updatedAt).toLocaleDateString("en-US")}.
        </p>
      </div>

      <Separator className="mb-4" />

      <PostContent postContent={post.content} />
    </div>
  );
}
