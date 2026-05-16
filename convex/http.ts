import { httpRouter } from "convex/server";

import { createOrUpdatePostEndpoint, removePostEndpoint } from "./posts";

const http = httpRouter();

http.route({
  path: "/postToConvex/v1/posts",
  method: "POST",
  handler: createOrUpdatePostEndpoint,
});

http.route({
  path: "/postToConvex/v1/posts",
  method: "DELETE",
  handler: removePostEndpoint,
});

export default http;
