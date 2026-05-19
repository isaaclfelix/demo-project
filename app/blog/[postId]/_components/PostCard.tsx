import { variants as headingVariants } from "@/components/web/blog/Heading";
import { PostContent } from "@/components/web/blog/PostContent";
import { cn } from "@/lib/utils";
import { PostWithParsedContent } from "@/convex/posts";

type PostCardProps = {
  post: PostWithParsedContent;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <div>
      <h1 className={cn(headingVariants({ level: "level-1" }), "mt-0")}>
        {post.title}
      </h1>

      {post.excerpt && <p className="mb-4">{post.excerpt}</p>}

      <hr className="mb-4" />

      <PostContent postContent={post.content} />
    </div>
  );
}
