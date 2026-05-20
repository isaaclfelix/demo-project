# WordPress → Convex sync contract

This document describes the HTTP payloads the Convex endpoints expect after the taxonomy schema rollout.

## Posts — `PUT/PATCH /api/postToConvex/v1/posts`

JSON body must match `createPostEndpointSchema` / `updatePostEndpointSchema`:

- **Post fields:** `title`, `slug`, `content`, `excerpt`, `type`, `status`, `commentStatus`, `createdAt`, `updatedAt`, `originalId`, `authorId`.
- **Categories:** `categories` — array of `{ originalId, name, slug, parentOriginalId? }` for every category term assigned to the post (embed full objects, not only IDs).
- **Tags:** `tags` — array of `{ originalId, name, slug }`.
- **Permalink (required):** `permalinkCategoryOriginalId` — number; WordPress term id of the **leaf** category used in the canonical URL. It **must** appear in `categories`, and that term **must** include `parentOriginalId` (two-level path, e.g. `parent/child`). Omitting the field is invalid; every post sync must send a real term id.

PATCH requires `_id` (Convex `posts` document id).

## Categories — `PUT/PATCH/DELETE /api/postToConvex/v1/categories`

- **PUT / PATCH body:** `{ originalId, name, slug, parentOriginalId? }` (same as each category term in post payloads).
- **DELETE body:** `{ originalId }`.

Use these when terms change without a full post sync.

## Tags — `PUT/PATCH/DELETE /api/postToConvex/v1/tags`

- **PUT / PATCH body:** `{ originalId, name, slug }`.
- **DELETE body:** `{ originalId }`.

## URLs in the Next.js app

- Post (canonical): `/{parentSlug}/{childSlug}/{postSlug}` (root).
- Category archive: `/category/{pathKey}` (e.g. `/category/programming/javascript`).
- Tag archive route exists at `/tag/{slug}` but returns 404 until implemented.

## After schema deploy

Clear dev Convex data and re-sync from WordPress (owner-operated step). Every synced post must include `permalinkCategoryOriginalId` (required) plus embedded category rows for all assigned terms.
