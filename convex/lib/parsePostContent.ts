import { Doc } from "../_generated/dataModel";
import { PostContent, postContentSchema } from "../../lib/schemas/blocks";

export type PostWithParsedContent = Omit<Doc<"posts">, "content"> & {
  content: PostContent;
};

export type PostWithParsedContentAndCanonicalPath = PostWithParsedContent & {
  canonicalPath: string;
};

export function parsePostContentDoc(
  post: Doc<"posts">,
): PostWithParsedContent | null {
  let parsedJson: PostContent = [];

  try {
    parsedJson = JSON.parse(post.content);
  } catch (error) {
    console.error(error);
    return null;
  }

  const parsedContent = postContentSchema.safeParse(parsedJson);

  if (!parsedContent.success) {
    console.error(
      `Invalid post content from Convex. Skipping post ${post._id}.`,
      parsedContent.error.issues,
    );
    return null;
  }

  return {
    ...post,
    content: parsedContent.data,
  };
}
