export function verifyBearerToken(req: Request): Response | null {
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

  return null;
}
