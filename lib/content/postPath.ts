export function postCanonicalPath(post: {
  slug: string;
  pathKey: string;
}): string {
  return `/${post.pathKey}/${post.slug}`;
}

export function categoryArchivePath(pathKey: string): string {
  return `/category/${pathKey}`;
}

export function tagArchivePath(tagSlug: string): string {
  return `/tag/${tagSlug}`;
}

export function pathKeySegments(pathKey: string): string[] {
  return pathKey.split("/");
}
