import { httpRouter } from "convex/server";

import {
  createPostEndpoint,
  removePostEndpoint,
  updatePostEndpoint,
} from "./posts";

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

export default http;
