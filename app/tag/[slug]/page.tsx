import { notFound } from "next/navigation";

/**
 * Tag archives (`/tag/{slug}`) are reserved for a future rollout.
 * See the taxonomy plan: listPostsByTag + pagination UI TBD.
 */
export default function TagArchivePlaceholder() {
  notFound();
}
