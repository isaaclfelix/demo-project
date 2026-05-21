/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as categories from "../categories.js";
import type * as categories_createCategory from "../categories/createCategory.js";
import type * as categories_removeCategory from "../categories/removeCategory.js";
import type * as categories_updateCategory from "../categories/updateCategory.js";
import type * as http from "../http.js";
import type * as httpAuth from "../httpAuth.js";
import type * as lib_canonicalPathForPostDoc from "../lib/canonicalPathForPostDoc.js";
import type * as lib_mutationErrorResponse from "../lib/mutationErrorResponse.js";
import type * as lib_parsePostContent from "../lib/parsePostContent.js";
import type * as lib_syncTaxonomy from "../lib/syncTaxonomy.js";
import type * as posts from "../posts.js";
import type * as posts_createPost from "../posts/createPost.js";
import type * as posts_removePost from "../posts/removePost.js";
import type * as posts_updatePost from "../posts/updatePost.js";
import type * as tags from "../tags.js";
import type * as tags_createTag from "../tags/createTag.js";
import type * as tags_removeTag from "../tags/removeTag.js";
import type * as tags_updateTag from "../tags/updateTag.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  "categories/createCategory": typeof categories_createCategory;
  "categories/removeCategory": typeof categories_removeCategory;
  "categories/updateCategory": typeof categories_updateCategory;
  http: typeof http;
  httpAuth: typeof httpAuth;
  "lib/canonicalPathForPostDoc": typeof lib_canonicalPathForPostDoc;
  "lib/mutationErrorResponse": typeof lib_mutationErrorResponse;
  "lib/parsePostContent": typeof lib_parsePostContent;
  "lib/syncTaxonomy": typeof lib_syncTaxonomy;
  posts: typeof posts;
  "posts/createPost": typeof posts_createPost;
  "posts/removePost": typeof posts_removePost;
  "posts/updatePost": typeof posts_updatePost;
  tags: typeof tags;
  "tags/createTag": typeof tags_createTag;
  "tags/removeTag": typeof tags_removeTag;
  "tags/updateTag": typeof tags_updateTag;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
