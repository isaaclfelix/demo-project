import { httpRouter } from "convex/server";

import { createPostEndpoint } from "./posts";

const http = httpRouter();

http.route({
  path: "/postToConvex/v1/posts",
  method: "POST",
  handler: createPostEndpoint,
});

export default http;
