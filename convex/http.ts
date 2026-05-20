import { httpRouter } from "convex/server";

import {
  createCategoryEndpoint,
  removeCategoryEndpoint,
  updateCategoryEndpoint,
} from "./categories";
import {
  createPostEndpoint,
  removePostEndpoint,
  updatePostEndpoint,
} from "./posts";
import {
  createTagEndpoint,
  removeTagEndpoint,
  updateTagEndpoint,
} from "./tags";

const http = httpRouter();

http.route({
  path: "/postToConvex/v1/posts",
  method: "PUT",
  handler: createPostEndpoint,
});

http.route({
  path: "/postToConvex/v1/posts",
  method: "PATCH",
  handler: updatePostEndpoint,
});

http.route({
  path: "/postToConvex/v1/posts",
  method: "DELETE",
  handler: removePostEndpoint,
});

http.route({
  path: "/postToConvex/v1/categories",
  method: "PUT",
  handler: createCategoryEndpoint,
});

http.route({
  path: "/postToConvex/v1/categories",
  method: "PATCH",
  handler: updateCategoryEndpoint,
});

http.route({
  path: "/postToConvex/v1/categories",
  method: "DELETE",
  handler: removeCategoryEndpoint,
});

http.route({
  path: "/postToConvex/v1/tags",
  method: "PUT",
  handler: createTagEndpoint,
});

http.route({
  path: "/postToConvex/v1/tags",
  method: "PATCH",
  handler: updateTagEndpoint,
});

http.route({
  path: "/postToConvex/v1/tags",
  method: "DELETE",
  handler: removeTagEndpoint,
});

export default http;
