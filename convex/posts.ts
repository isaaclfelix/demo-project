import { v } from "convex/values";

import {
  createPostEndpointSchema,
  removePostEndpointSchema,
  updatePostEndpointSchema,
} from "../lib/schemas/api";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { httpAction, internalMutation } from "./_generated/server";

export const createPost = internalMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    type: v.string(),
    status: v.string(),
    commentStatus: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    originalId: v.number(),
    authorId: v.number(),
    categoryIds: v.array(v.number()),
    tagIds: v.array(v.number()),
  },
  handler: async (ctx, args): Promise<Id<"posts"> | Error> => {
    const existingPost = await ctx.db
      .query("posts")
      .withIndex("by_original_id", (q) => q.eq("originalId", args.originalId))
      .unique();

    if (existingPost) {
      return new Error(
        "Trying to insert a post with an originalId that already exists",
      );
    }

    let insertResponse;

    try {
      insertResponse = await ctx.db.insert("posts", args);
    } catch (error) {
      return error as Error;
    }

    return insertResponse;
  },
});

export const updatePost = internalMutation({
  args: {
    _id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    type: v.string(),
    status: v.string(),
    commentStatus: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    originalId: v.number(),
    authorId: v.number(),
    categoryIds: v.array(v.number()),
    tagIds: v.array(v.number()),
  },
  handler: async (ctx, args): Promise<Id<"posts"> | Error> => {
    const convexId = args._id;

    delete (args._id as { _id?: Id<"posts"> })._id;

    try {
      await ctx.db.patch(convexId, args);
    } catch (error) {
      return error as Error;
    }

    return convexId;
  },
});

export const removePost = internalMutation({
  args: {
    _id: v.id("posts"),
  },
  handler: async (ctx, args): Promise<Id<"posts"> | Error> => {
    try {
      await ctx.db.delete(args._id);
    } catch (error) {
      return error as Error;
    }

    return args._id;
  },
});

export const createPostEndpoint = httpAction(async (ctx, req) => {
  const unauthorizedResponse = new Response(
    JSON.stringify({ error: "Unauthorized" }),
    {
      status: 401,
    },
  );

  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader) {
    return unauthorizedResponse;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return unauthorizedResponse;
  }

  const expectedToken = process.env.POST_TO_CONVEX_SECRET;
  if (!expectedToken) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }

  if (token !== expectedToken) {
    return unauthorizedResponse;
  }

  const requestBody = await req.json();

  const parsedRequestBody = createPostEndpointSchema.safeParse(requestBody);

  if (!parsedRequestBody.success) {
    return new Response(
      JSON.stringify({ error: parsedRequestBody.error.issues }),
      {
        status: 400,
      },
    );
  }

  const mutationResponse = await ctx.runMutation(
    internal.posts.createPost,
    parsedRequestBody.data,
  );

  if (mutationResponse instanceof Error) {
    return new Response(JSON.stringify({ error: mutationResponse.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ id: mutationResponse }), {
    status: 200,
  });
});

export const updatePostEndpoint = httpAction(async (ctx, req) => {
  const unauthorizedResponse = new Response(
    JSON.stringify({ error: "Unauthorized" }),
    {
      status: 401,
    },
  );

  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader) {
    return unauthorizedResponse;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return unauthorizedResponse;
  }

  const expectedToken = process.env.POST_TO_CONVEX_SECRET;
  if (!expectedToken) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }

  if (token !== expectedToken) {
    return unauthorizedResponse;
  }

  const requestBody = await req.json();

  const parsedRequestBody = updatePostEndpointSchema.safeParse(requestBody);

  if (!parsedRequestBody.success) {
    return new Response(
      JSON.stringify({ error: parsedRequestBody.error.issues }),
      {
        status: 400,
      },
    );
  }

  const { _id: postId, ...postFields } = parsedRequestBody.data;

  const mutationResponse = await ctx.runMutation(internal.posts.updatePost, {
    ...postFields,
    _id: postId as Id<"posts">,
  });

  if (mutationResponse instanceof Error) {
    return new Response(JSON.stringify({ error: mutationResponse.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ id: mutationResponse }), {
    status: 200,
  });
});

export const removePostEndpoint = httpAction(async (ctx, req) => {
  const unauthorizedResponse = new Response(
    JSON.stringify({ error: "Unauthorized" }),
    {
      status: 401,
    },
  );

  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader) {
    return unauthorizedResponse;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return unauthorizedResponse;
  }

  const expectedToken = process.env.POST_TO_CONVEX_SECRET;
  if (!expectedToken) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }

  if (token !== expectedToken) {
    return unauthorizedResponse;
  }

  const requestBody = await req.json();

  const parsedRequestBody = removePostEndpointSchema.safeParse(requestBody);

  if (!parsedRequestBody.success) {
    return new Response(
      JSON.stringify({ error: parsedRequestBody.error.issues }),
      {
        status: 400,
      },
    );
  }

  const { _id: postId } = parsedRequestBody.data;

  const mutationResponse = await ctx.runMutation(internal.posts.removePost, {
    _id: postId as Id<"posts">,
  });

  if (mutationResponse instanceof Error) {
    return new Response(JSON.stringify({ error: mutationResponse.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ id: mutationResponse }), {
    status: 200,
  });
});
