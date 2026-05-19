import { cache } from "react";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { PostWithParsedContent } from "../schemas/convex";

export const cachedGetPost = cache(
  async (postId: string): Promise<PostWithParsedContent | Error> => {
    return await fetchQuery(api.posts.getPost, {
      id: postId as Id<"posts">,
    });
  },
);
