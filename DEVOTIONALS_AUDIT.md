# Sarvdev Devotionals End-to-End Audit

Audit date: 2026-08-02  
Scope: Devotionals system only: model, admin forms, admin APIs, public APIs, listing, category pages, detail page, image flow, SEO/schema, search, pagination, and data-quality risks.  
Rule followed: audit-only. No application code or database records were intentionally changed for this audit. One report file was created: `DEVOTIONALS_AUDIT.md`.

## 1. Executive summary

The Devotionals system is functional and the current build passes, but it has several production-readiness issues:

- Public detail APIs can expose non-approved devotional records when accessed by ObjectId.
- Category pages load only the first 60 matching records, so large categories such as Mantra, Stotra, Shloka, and Vrat Katha can be incomplete.
- Devotional-specific images are intentionally ignored in current public/admin rendering. The fallback-image behavior is not mainly a Cloudinary or Next/Image bug; it is caused by API stripping image fields plus admin/public UI choosing the optimized fallback-image policy.
- Slug usage is inconsistent across public links, metadata, and sitemap.
- Admin edit form maps `content` into the `lyrics` textarea but saves back to `lyrics`; this can make edits appear unsaved when `content` still exists.
- The model, TypeScript type, export route, category config, and route rewrites are not fully aligned.
- Search and export are usable at current size, but several paths would not scale cleanly to thousands of devotionals.

Finding count:

- Critical: 2
- High: 7
- Medium: 8
- Low: 4
- Total: 21

## 2. Architecture and data flow

Current intended flow:

1. Admin creates/edits devotionals from:
   - `app/admin/devotionals/new/page.tsx`
   - `app/admin/devotionals/[id]/edit/page.tsx`
2. Writes go through:
   - `app/api/devotionals/route.ts` (`POST`, `PUT`, `DELETE`)
3. Data is stored in:
   - `models/Devotional.ts`
4. Public list/search uses:
   - `app/devotionals/ClientPage.tsx`
   - `app/api/devotionals/route.ts`
   - `app/api/devotionals/category-counts/route.ts`
5. Public category pages use:
   - `app/devotionals/category/[slug]/page.tsx`
   - `app/api/devotionals/route.ts`
6. Public detail pages use:
   - `app/devotionals/[id]/page.tsx`
   - `app/devotionals/[id]/layout.tsx`
   - `app/api/devotionals/[id]/route.ts`
7. Images resolve through:
   - `lib/devotional-image.ts`
   - `lib/media.ts`
   - `app/api/devotionals/route.ts` image field stripping
8. Admin integrity/maintenance routes:
   - `app/api/admin/devotionals/audit/route.ts`
   - `app/api/admin/devotionals/migrate/route.ts`
   - `app/api/admin/devotionals/clear-images/route.ts`
   - `app/api/admin/devotionals/export/route.ts`

## 3. Route and file inventory

Model and types:

- `models/Devotional.ts`
- `app/devotionals/types.ts`

Public routes:

- `app/devotionals/page.tsx`
- `app/devotionals/ClientPage.tsx`
- `app/devotionals/category/[slug]/page.tsx`
- `app/devotionals/category/[slug]/layout.tsx`
- `app/devotionals/[id]/page.tsx`
- `app/devotionals/[id]/layout.tsx`
- `app/devotionals/deity/[slug]/page.tsx`
- `app/devotionals/loading.tsx`
- `app/devotionals/head.tsx`
- `app/devotionals/layout.tsx`

Public APIs:

- `app/api/devotionals/route.ts`
- `app/api/devotionals/[id]/route.ts`
- `app/api/devotionals/category-counts/route.ts`
- `app/api/devotionals/deity/[slug]/route.ts`

Admin pages:

- `app/admin/devotionals/page.tsx`
- `app/admin/devotionals/new/page.tsx`
- `app/admin/devotionals/[id]/edit/page.tsx`
- `app/admin/devotionals/data-integrity/page.tsx`

Admin APIs:

- `app/api/admin/devotionals/audit/route.ts`
- `app/api/admin/devotionals/migrate/route.ts`
- `app/api/admin/devotionals/clear-images/route.ts`
- `app/api/admin/devotionals/export/route.ts`

Shared helpers/components:

- `lib/devotional-categories.ts`
- `lib/devotional-image.ts`
- `lib/media.ts`
- `lib/seo.ts`
- `app/devotionals/components/categories.ts`
- `app/devotionals/components/devotional-utils.ts`
- `app/devotionals/components/DevotionalCardPremium.tsx`
- `app/devotionals/components/DevotionalHero.tsx`
- `app/devotionals/components/DevotionalAudioPlayer.tsx`
- `app/devotionals/components/DevotionalLyricsReader.tsx`
- `app/devotionals/components/DevotionalRelatedContent.tsx`
- `components/DevotionalTeaser.tsx`

## 4. Critical findings

### DEV-001 - Public devotional detail API exposes non-approved records by ObjectId

Severity: Critical  
Evidence:

- `app/api/devotionals/[id]/route.ts:19` uses `Devotional.findById(id, { __v: 0 })` without a status filter.
- `app/api/devotionals/[id]/route.ts:25` slug lookup uses `{ status: { $ne: 'rejected' } }`, which still allows `pending`.
- `app/api/devotionals/[id]/route.ts:34` returns the full devotional object.
- `app/api/devotionals/route.ts:187` also returns `findById(singleId)` from the public API without status filtering.
- `app/api/devotionals/route.ts:203` and `app/api/devotionals/route.ts:212` use `$ne: 'rejected'`, allowing pending content.

Impact:

- A pending or draft-equivalent devotional can be publicly retrievable if a user knows or guesses the ObjectId.
- Public slug/detail behavior is stricter in metadata layout than in API, creating inconsistent page/API exposure.

Recommended fix:

- Public detail GET must require `status: 'approved'` unless an authorized admin preview mode is explicitly requested.
- ObjectId and slug branches should use the same visibility rules.

### DEV-002 - Category pages truncate large categories to 60 records

Severity: Critical  
Evidence:

- `app/devotionals/category/[slug]/page.tsx:41` fetches `page=1&limit=60`.
- `app/devotionals/category/[slug]/page.tsx:48` reads only that first API response.
- `app/devotionals/category/[slug]/page.tsx:58` has an empty dependency array, so the fetch is not tied to route/category changes.
- `app/devotionals/category/[slug]/page.tsx:61` filters only the already-loaded first 60 records.

Impact:

- Large categories are incomplete. The public category counts currently indicate categories above 60, such as Mantra, Stotra, Shloka, and Vrat Katha.
- Category-local search also searches only the first 60 loaded records.

Recommended fix:

- Convert category pages to server-side paginated fetching or client-side paginated API fetching with Load More.
- Include `categorySlug` and `categoryInfo?.id` in effect dependencies if the route remains client-side.

## 5. High-priority findings

### DEV-003 - Fallback image behavior is deliberate, not a broken Cloudinary resolver

Severity: High  
Evidence:

- `app/api/devotionals/route.ts:20` defines stripped fields: `image`, `imageCard`, `imageHero`, `ogImage`, `thumbnail`, `coverImage`.
- `app/api/devotionals/route.ts:136` deletes those image fields from response/write payloads.
- `app/api/devotionals/route.ts:339` and `app/api/devotionals/route.ts:390` remove image fields from list responses.
- `app/admin/devotionals/page.tsx:501` calls `getDevotionalCardImage()` with no devotional input.
- `app/admin/devotionals/page.tsx:509` labels the preview `Fallback image`.
- `app/admin/devotionals/page.tsx:510` says public pages ignore devotional/deity images.
- `app/admin/devotionals/new/page.tsx:155` and `app/admin/devotionals/[id]/edit/page.tsx:296` explicitly tell admins that public pages use one optimized fallback image.
- `lib/media.ts:276` and `lib/media.ts:286` can use item image fields, but those fields are stripped before public UI receives them.

Impact:

- Admins may think images are missing or broken, but current behavior is a product/code policy.
- The model still has legacy image fields (`models/Devotional.ts:34-37`), so the system's data capability and UI behavior disagree.

Recommended fix:

- Either document this as the current production policy everywhere and remove misleading export/image-management affordances, or re-enable images with a single low-cost deterministic image strategy.

### DEV-004 - Slug and URL handling is inconsistent across detail, metadata, cards, and sitemap

Severity: High  
Evidence:

- `models/Devotional.ts:8` has a slug field, but it is only indexed, not unique.
- `app/devotionals/[id]/layout.tsx:23` loads all approved title stubs.
- `app/devotionals/[id]/layout.tsx:24` matches by `createDevotionalSlug(title)` instead of stored `slug`.
- `app/devotionals/[id]/layout.tsx:43` canonical URL uses the incoming `id`.
- `app/sitemap.ts:162` fetches `_id slug updatedAt createdAt`.
- `app/sitemap.ts:165` emits `/devotionals/${d._id.toString()}`, ignoring the slug.

Impact:

- Same devotional can be accessible or referenced by multiple URL shapes.
- Sitemap, public cards, and metadata may not agree on canonical URLs.
- Search engines can see duplicate or unstable URLs.

Recommended fix:

- Use stored `slug` as the canonical public URL.
- Keep ObjectId only as an admin/internal fallback or redirect.
- Update sitemap to emit `slug ?? _id`.

### DEV-005 - Admin edit form can make lyrics edits appear unsaved when `content` exists

Severity: High  
Evidence:

- `app/admin/devotionals/[id]/edit/page.tsx:69` loads the editable lyrics field from `found.content || found.lyrics || ''`.
- `app/admin/devotionals/[id]/edit/page.tsx:149` does the same after save refresh.
- `app/admin/devotionals/[id]/edit/page.tsx:318` saves a single textarea named `lyrics`.
- `app/devotionals/[id]/page.tsx:105` public detail reads `content || lyrics || description || title`.

Impact:

- If an existing record has `content`, editing the `lyrics` field may not affect what public pages display.
- Admin may save a change successfully but still see/display old content because `content` takes priority.

Recommended fix:

- Decide whether `content` or `lyrics` is the canonical devotional body.
- The form should edit the same field that public display prioritizes, or update both intentionally during migration.

### DEV-006 - Duplicate protection is incomplete

Severity: High  
Evidence:

- `models/Devotional.ts:8` indexes `slug` but does not mark it unique.
- `app/api/devotionals/route.ts:418` creates records but no duplicate slug/title check is visible before create.
- `app/api/devotionals/route.ts:451` updates records without duplicate slug guard.
- `app/api/admin/devotionals/audit/route.ts:45-46` can report duplicate slugs/titles, but it is reactive and sample-limited.

Impact:

- Duplicate slugs can create unstable detail routing and SEO duplication.
- Imports or repeated admin create actions can silently produce conflicting public records.

Recommended fix:

- Add server-side duplicate detection on create/update.
- Add a non-unique duplicate report first, then consider a unique partial index after existing duplicates are resolved.

### DEV-007 - Admin delete is hard delete

Severity: High  
Evidence:

- `app/api/devotionals/route.ts:489` defines `DELETE`.
- `app/api/devotionals/route.ts:495` calls `Devotional.findByIdAndDelete(id)`.
- `app/admin/devotionals/page.tsx:451-453` exposes bulk approve/reject/delete actions.

Impact:

- Devotional records can be permanently deleted from admin UI.
- This conflicts with safer content-management patterns used elsewhere in Sarvdev, where status-based archiving is preferred.

Recommended fix:

- Convert delete to soft delete/status `rejected` or `archived`.
- Keep a separate privileged hard-delete route only if truly needed.

### DEV-008 - Category source of truth is duplicated

Severity: High  
Evidence:

- `lib/devotional-categories.ts:13` defines `DEVOTIONAL_CATEGORIES`.
- `app/devotionals/components/categories.ts:14-27` defines a second full category list.
- `next.config.js:26-50` hardcodes known category rewrites separately.
- `lib/devotional-categories.ts:31` recognizes legacy values `108 Namavali` and `Other`.

Impact:

- Category names, slugs, Hindi labels, descriptions, and rewrites can drift.
- Admin, public list, category pages, and migration may disagree about valid categories.

Recommended fix:

- Use `lib/devotional-categories.ts` as the single source of truth.
- Generate UI categories and known rewrite slugs from the same config where possible.

### DEV-009 - Regex search is broad and not index-friendly

Severity: High  
Evidence:

- `app/api/devotionals/route.ts:35` expands query synonyms/transliteration terms.
- `app/api/devotionals/route.ts:40-54` builds `$or` regex conditions across title, Hindi title, slug, deity, category, tags, and aliases.
- `app/api/admin/devotionals/export/route.ts:98` also searches `aliases`, although `aliases` is not defined in `models/Devotional.ts`.

Impact:

- At thousands of devotionals, regex scans can become slow.
- Broad synonym expansion can reduce relevance if not scored.

Recommended fix:

- Add normalized search fields or text/search indexes.
- Apply scoring rules for exact, starts-with, contains, and synonym matches.
- Keep hard limits and avoid unbounded exports/searches.

## 6. Medium-priority findings

### DEV-010 - Public detail route and layout use different approval rules

Severity: Medium  
Evidence:

- `app/devotionals/[id]/layout.tsx:20` fetches ObjectId only with `status: 'approved'`.
- `app/api/devotionals/[id]/route.ts:19` fetches ObjectId without status filter.
- `app/api/devotionals/[id]/route.ts:25` slug fetch only excludes rejected.

Impact:

- Metadata can show fallback title while client detail API still returns the document.
- Users and crawlers can receive inconsistent page/API states.

Recommended fix:

- Centralize public devotional lookup in one helper that enforces the same visibility rules for page, metadata, and API.

### DEV-011 - Related devotionals on detail page are limited to a shallow first page

Severity: Medium  
Evidence:

- `app/devotionals/[id]/page.tsx:40-44` fetches the detail and a related list in parallel.
- The related list is fetched from `/api/devotionals?page=1&limit=24` and then filtered client-side.

Impact:

- Related content can miss highly relevant records that are not in the first 24.
- The same-category/deity experience is weak for larger datasets.

Recommended fix:

- Add a dedicated related API query using current deity/category/slug exclusion.

### DEV-012 - Sitemap emits ObjectId devotional URLs instead of slug URLs

Severity: Medium  
Evidence:

- `app/sitemap.ts:162` includes `slug` in the query.
- `app/sitemap.ts:165` ignores `slug` and uses `_id`.

Impact:

- SEO signals go to less readable, less stable URLs.
- If public UI links use slugs, sitemap and canonical behavior diverge.

Recommended fix:

- Use `d.slug || d._id.toString()` in sitemap URLs after slug integrity is checked.

### DEV-013 - Metadata layout scans all approved title stubs for slug lookup

Severity: Medium  
Evidence:

- `app/devotionals/[id]/layout.tsx:23` loads all approved `_id title` stubs.
- `app/devotionals/[id]/layout.tsx:24` searches the array in memory.

Impact:

- This does not scale to thousands of devotionals.
- It bypasses the indexed `slug` field.

Recommended fix:

- Query by `{ slug: id, status: 'approved' }` directly.
- Only fall back to title-derived slug during one-time migration or redirect.

### DEV-014 - Admin audit report undercounts unmatched deity slugs

Severity: Medium  
Evidence:

- `app/api/admin/devotionals/audit/route.ts:109-111` slices unmatched deity slug sample to `SAMPLE`.
- `app/api/admin/devotionals/audit/route.ts:125` reports `count: unmatchedDeitySlugSample.length`.

Impact:

- If more than five records are unmatched, the reported count still shows the sample size, not the true count.

Recommended fix:

- Calculate full count and separate it from sample.

### DEV-015 - Admin export loads all matching devotionals into memory

Severity: Medium  
Evidence:

- `app/api/admin/devotionals/export/route.ts:170` calls `Devotional.find(filter, { __v: 0 })`.
- `app/api/admin/devotionals/export/route.ts:172` materializes all docs with `.lean()`.
- `app/api/admin/devotionals/export/route.ts:175` builds one full CSV string in memory.

Impact:

- Current scale is likely okay, but large exports can become memory-heavy.

Recommended fix:

- Add streaming or chunked export for large datasets.
- Keep filtered exports and add max/export-job controls later.

### DEV-016 - Public APIs can return internal/admin fields

Severity: Medium  
Evidence:

- `app/api/devotionals/[id]/route.ts:34` returns the entire document excluding only `__v`.
- `models/Devotional.ts:43-44` includes `source` and `isCustomized`.
- `models/Devotional.ts:47` includes workflow `status`.

Impact:

- Internal provenance/status fields can leak to public consumers.

Recommended fix:

- Add explicit public projections/serializers.
- Keep admin projections separate.

### DEV-017 - Model/type/export field consistency is incomplete

Severity: Medium  
Evidence:

- `models/Devotional.ts:34-37` defines `image`, `imageCard`, `imageHero`, `ogImage`.
- `app/api/devotionals/route.ts:20` also strips `thumbnail` and `coverImage`, which are not schema fields.
- `app/api/admin/devotionals/export/route.ts:143` exports `aliases`, not defined in model/type.
- `app/devotionals/types.ts:64` includes legacy `names`, not defined in model.

Impact:

- Admin export may include columns that cannot be saved through the current schema.
- Future imports/tools may believe fields are supported when Mongoose drops them.

Recommended fix:

- Create a single Devotional field contract shared by schema, serializer, admin forms, and export/import.

### DEV-018 - Category counts and list filters use different active-status semantics

Severity: Medium  
Evidence:

- `app/api/devotionals/category-counts/route.ts:10` excludes `rejected`, `draft`, and `pending`.
- `app/api/devotionals/route.ts:280-283` public list includes `approved`, missing, null, and blank statuses.
- `models/Devotional.ts:47` enum only allows `pending`, `approved`, `rejected`.

Impact:

- Counts and list totals can disagree when records have missing/blank status.

Recommended fix:

- Define one public visibility rule and use it in counts, list, detail, sitemap, and metadata.

## 7. Low-priority findings

### DEV-019 - Lint script is incompatible with current Next version

Severity: Low  
Evidence:

- `package.json` uses `next lint`.
- Running `npm run lint` failed with: `Invalid project directory provided, no such directory: C:\Users\Lenovo\Desktop\sarvdev-temple\lint`.

Impact:

- Lint cannot currently be used as a validation gate.

Recommended fix:

- Replace with a supported ESLint invocation for Next 16 or remove the stale script.

### DEV-020 - Admin list has limited user-facing error display

Severity: Low  
Evidence:

- `app/admin/devotionals/page.tsx:91` fetches the API.
- Most admin action failure paths rely on exceptions/alerts rather than a consistent inline error state.

Impact:

- Admin may see stale data or generic failures.

Recommended fix:

- Add consistent inline error banners for fetch/export/bulk actions.

### DEV-021 - Build has non-blocking warnings outside devotionals

Severity: Low  
Evidence:

- `npm run build` completed successfully, but emitted warnings for stale browser data, deprecated middleware convention, duplicate email indexes, and MongoDB DNS timeout during some static page data fetches.

Impact:

- Not a devotional blocker, but can make production build logs noisy.

Recommended fix:

- Address globally in a separate maintenance phase.

### DEV-022 - Some sitemap/source comments display mojibake in terminal output

Severity: Low  
Evidence:

- `app/sitemap.ts` terminal output showed mojibake around separator comments.

Impact:

- Cosmetic/source-encoding readability issue only, unless copied into UI.

Recommended fix:

- Normalize comments during a low-risk cleanup if desired.

## 8. Field consistency matrix

| Field | Model | Type | Admin new/edit | Public API | Public UI | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `title` | Yes | Yes | Yes | Yes | Yes | Required in model. |
| `titleHi` | Yes | Yes | Yes | Yes | Yes | Present across system. |
| `slug` | Yes, indexed | Yes | Yes | Yes | Mixed | Stored slug not consistently used by layout/sitemap. |
| `category` | Yes | Yes | Yes | Yes | Yes | Category config duplicated. |
| `categorySlug` | Yes, indexed | Yes | API derives | Yes | Yes | Not directly editable in admin forms. |
| `categoryHi` | Yes | Yes | API derives | Yes | Yes | Based on category helper. |
| `deity` | Yes | Yes | Yes | Yes | Yes | Free text in admin form. |
| `deityHi` | Yes | Yes | No | Yes | Partial | Not in admin create/edit fields. |
| `deitySlug` | Yes, indexed | Yes | API derives/accepts | Yes | Yes | Missing/invalid values audited. |
| `description` | Yes | Yes | Yes | Yes | Yes | Used in listing/detail. |
| `descriptionHi` | Yes | Yes | Yes | Yes | Yes | Used where language-aware components support it. |
| `content` | Yes | Yes | Loaded into lyrics field | Yes | Yes | Public detail prioritizes over lyrics. |
| `contentHi` | Yes | Yes | No | Yes | Partial | Model supports it; form does not. |
| `lyrics` | Yes | Yes | Yes | Yes | Yes | Form saves this field. |
| `audio` | Yes | Yes | Yes | Yes | Yes | Admin form uses `audio`; detail also checks `audioUrl`. |
| `audioUrl` | Yes | Yes | No direct field | Yes | Yes | Edit form loads it into `audio`. |
| `duration` | Yes | Yes | Yes | Yes | Yes | Present. |
| `artist` | Yes | Yes | Yes | Yes | Yes | Present. |
| `image` | Yes | Yes | Disabled/ignored | Stripped | Fallback | Legacy only under current policy. |
| `imageCard` | Yes | Yes | Disabled/ignored | Stripped | Fallback | Legacy only under current policy. |
| `imageHero` | Yes | Yes | Disabled/ignored | Stripped | Fallback | Legacy only under current policy. |
| `ogImage` | Yes | Yes | Disabled/ignored | Stripped | Fallback | Layout projection does not include `ogImage`. |
| `thumbnail` | No | No | No | Stripped/exported | No | Export/cleanup reference collection-level field. |
| `coverImage` | No | No | No | Stripped/exported | No | Export/cleanup reference collection-level field. |
| `tags` | Yes array | String or array | No direct field | Yes | Partial | Search uses tags. |
| `aliases` | No | No | No | Search/export reference | No | Schema mismatch. |
| `featured` | Yes | Yes | Yes | Yes | Yes | Present. |
| `status` | enum pending/approved/rejected | String | Yes | Yes | Yes | Public visibility inconsistent. |
| `source` | Yes | Yes | No | Leaks possible | Admin | Should be admin-only. |
| `isCustomized` | Yes | Yes | No | Leaks possible | Admin | Should be admin-only. |
| `metaTitle` | Yes | Yes | Yes | Yes | Metadata | Present. |
| `metaDescription` | Yes | Yes | Yes | Yes | Metadata | Present. |
| `metaKeywords` | Yes string | String | Yes | Yes | Metadata | Present as comma string. |

## 9. Image-resolution flow and exact fallback root cause

Observed flow:

1. Model can store legacy image fields:
   - `models/Devotional.ts:34-37`
2. Public API deliberately strips them:
   - `app/api/devotionals/route.ts:20`
   - `app/api/devotionals/route.ts:136-140`
3. Admin create/edit forms tell admins images are ignored:
   - `app/admin/devotionals/new/page.tsx:155`
   - `app/admin/devotionals/[id]/edit/page.tsx:296`
4. Admin listing deliberately renders fallback preview:
   - `app/admin/devotionals/page.tsx:501`
   - `app/admin/devotionals/page.tsx:509-510`
5. Image helper would use images if supplied:
   - `lib/media.ts:276-284`
   - `lib/media.ts:286-294`

Root cause:

- Fallback images appear because the system currently enforces an optimized fallback-image policy for devotionals. Image fields are removed from API responses and stripped from mutation payloads. Public cards/details therefore do not receive devotional-specific or matched deity images.

Not root cause:

- Not primarily a Cloudinary remote pattern failure.
- Not primarily a Next/Image rendering bug.
- Not primarily a missing fallback in `lib/media.ts`.

Risk:

- Because model/export/cleanup still include image fields, the system can confuse admins. It looks like image data exists but public UI cannot use it.

## 10. Duplicate and data-quality findings

Live DB duplicate inspection:

- Attempted read-only duplicate/count checks against MongoDB.
- The live DB connection timed out with `querySrv ETIMEOUT _mongodb._tcp.sarvdev.meedqkf.mongodb.net`.
- No database writes were attempted.
- Because DB access timed out, this audit cannot honestly report exact live duplicate groups.

Code-level duplicate risks:

- `models/Devotional.ts:8` slug is indexed but not unique.
- `app/api/devotionals/route.ts:418` create route has no visible duplicate slug/title guard.
- `app/api/devotionals/route.ts:451` update route has no visible duplicate slug/title guard.
- `app/api/admin/devotionals/audit/route.ts:45-46` can report duplicate slug/title groups, but only as a reactive admin report.

Confirmed duplicate groups from live DB:

- Not available due DB DNS timeout.

Recommended duplicate strategy:

- Add a normalized slug/title duplicate check before create/update.
- Keep a duplicate report endpoint.
- Add a unique partial index only after resolving any existing duplicates.

## 11. Category-system findings

Canonical category config currently exists in:

- `lib/devotional-categories.ts:13-27`

Duplicate UI config exists in:

- `app/devotionals/components/categories.ts:14-27`

Rewrites hardcode category slugs in:

- `next.config.js:26-50`

Problems:

- Category labels, Hindi names, descriptions, and route handling can drift.
- Legacy categories (`108 Namavali`, `Other`) are handled in `lib/devotional-categories.ts:31`, but not consistently represented in all UI layers.
- Category count API excludes pending/draft/rejected, while public list allows missing/blank status.

Recommended direction:

- Move all category display and routing metadata to one shared config.
- Use aliases/legacy category values only in normalization, not as separate UI truth.

## 12. Security findings

Positive:

- Devotional mutation routes are admin protected:
  - `app/api/devotionals/route.ts:419`
  - `app/api/devotionals/route.ts:452`
  - `app/api/devotionals/route.ts:490`
- Admin maintenance routes check admin auth:
  - `app/api/admin/devotionals/clear-images/route.ts`
  - `app/api/admin/devotionals/export/route.ts`
  - `app/api/admin/devotionals/migrate/route.ts`
  - `app/api/admin/devotionals/audit/route.ts`

Issues:

- DEV-001: public detail API status filtering is unsafe.
- DEV-016: public detail response can expose internal fields.
- DEV-007: hard delete is too destructive for normal admin workflows.

Recommended security priorities:

1. Fix public detail visibility to `approved` only.
2. Add public serializers/projections.
3. Replace hard delete with soft delete/archive.

## 13. SEO findings

Positive:

- Detail layout generates metadata:
  - `app/devotionals/[id]/layout.tsx:29`
- OpenGraph/Twitter metadata exists:
  - `app/devotionals/[id]/layout.tsx:69-75`
- Structured data is generated:
  - `app/devotionals/[id]/layout.tsx:93`
  - `app/devotionals/[id]/page.tsx:111-132`

Issues:

- Slug/canonical mismatch: `app/devotionals/[id]/layout.tsx:43`.
- Sitemap uses ObjectId URLs: `app/sitemap.ts:165`.
- Metadata lookup scans titles instead of stored slugs: `app/devotionals/[id]/layout.tsx:23-24`.
- Detail page and layout can both emit JSON-LD, creating duplicate schema risk:
  - `app/devotionals/[id]/layout.tsx:93`
  - `app/devotionals/[id]/page.tsx:111-132`
- OG image projection excludes `imageHero` and `ogImage`:
  - `app/devotionals/[id]/layout.tsx:14`

Recommended SEO priorities:

1. Canonicalize all public devotional URLs to stored slug.
2. Use direct slug lookup for metadata.
3. Emit JSON-LD from one place only.
4. Make sitemap use slug URLs.

## 14. Performance and accessibility findings

Positive:

- `/devotionals` main page now uses server-side paginated API search:
  - `app/devotionals/ClientPage.tsx:196`
  - `app/devotionals/ClientPage.tsx:203`
  - `app/devotionals/ClientPage.tsx:338-392`
- API list path supports pagination and capped limits.
- Devotional images are currently lightweight due fallback policy.

Performance issues:

- Category pages only fetch first 60 and then filter client-side:
  - `app/devotionals/category/[slug]/page.tsx:41`
  - `app/devotionals/category/[slug]/page.tsx:61`
- Detail metadata does all-approved stub scan:
  - `app/devotionals/[id]/layout.tsx:23`
- Export loads all matching docs into memory:
  - `app/api/admin/devotionals/export/route.ts:170-175`
- Migration uses skip-based batching:
  - `app/api/admin/devotionals/migrate/route.ts:216-217`

Accessibility/UI issues:

- Admin action buttons should be reviewed for consistent labels/aria labels.
- Admin fetch/export failures need clearer inline messages.

## 15. Commands run and results

Commands run:

1. `npx tsc --noEmit`
   - Result: Passed.

2. `npm run lint`
   - Result: Failed before linting application code.
   - Error: `Invalid project directory provided, no such directory: C:\Users\Lenovo\Desktop\sarvdev-temple\lint`.
   - Cause appears to be obsolete `next lint` script with current Next version.

3. `npm run build`
   - Result: Passed.
   - Non-blocking warnings observed:
     - stale baseline/browser data
     - deprecated middleware convention warning
     - duplicate Mongoose email index warnings outside devotionals
     - MongoDB DNS timeout during some static data fetches, but build still completed successfully

4. Read-only MongoDB duplicate/count inspection
   - Result: Could not complete due `querySrv ETIMEOUT _mongodb._tcp.sarvdev.meedqkf.mongodb.net`.
   - No database writes attempted.

## 16. Missing evidence and audit limitations

- Live DB duplicate groups and exact data-quality counts could not be verified because the MongoDB SRV lookup timed out.
- No browser/UI interaction test was performed in this audit because the prompt requested a repository/system audit and no code changes.
- No devotional records were modified.
- No migration, cleanup, seed, or destructive command was run.
- The repository already had many modified/untracked files before this audit began. This audit did not intentionally modify those application files.

## 17. Prioritized fix plan

1. Fix public devotional detail API visibility to approved-only for ObjectId and slug routes.  
   Impact: closes content exposure risk. Risk: low.

2. Centralize public devotional lookup/serializer for API, page, layout, sitemap.  
   Impact: consistent status filtering and field exposure. Risk: medium.

3. Fix category pages to use paginated server-side category queries.  
   Impact: restores complete large category pages. Risk: medium.

4. Standardize canonical devotional slug URLs.  
   Impact: improves routing and SEO. Risk: medium.

5. Resolve `content` vs `lyrics` canonical field behavior.  
   Impact: prevents admin edits from appearing lost. Risk: medium.

6. Add duplicate slug/title checks in create/update APIs.  
   Impact: prevents future URL conflicts. Risk: medium.

7. Replace hard delete with soft delete/archive.  
   Impact: protects content data. Risk: medium.

8. Merge category config into one source of truth.  
   Impact: prevents category drift. Risk: low to medium.

9. Decide and document final devotional image policy.  
   Impact: removes fallback-image confusion. Risk: low if keeping fallback policy.

10. Update sitemap to use stored slugs.  
    Impact: SEO cleanup. Risk: low after slug audit.

11. Remove all-approved stub scan from metadata layout.  
    Impact: better performance. Risk: low.

12. Add public projections to remove internal fields.  
    Impact: security/data hygiene. Risk: low.

13. Improve search indexes/scoring after field normalization.  
    Impact: scale and relevance. Risk: medium.

14. Convert export to streaming/chunked output later.  
    Impact: scale readiness. Risk: medium.

15. Fix admin audit true unmatched-deity counts.  
    Impact: data integrity visibility. Risk: low.

16. Repair lint script for Next 16.  
    Impact: validation reliability. Risk: low.

17. Review admin action accessibility labels and error states.  
    Impact: UX/accessibility. Risk: low.

18. Clean obsolete field references (`aliases`, `thumbnail`, `coverImage`) or add them to the official schema/type.  
    Impact: field-contract clarity. Risk: medium.

19. Review schema duplication for JSON-LD on detail pages.  
    Impact: SEO cleanup. Risk: low.

20. Re-run DB duplicate/data-quality audit when Mongo DNS/network is available.  
    Impact: replaces code-only risk assessment with verified data counts. Risk: none.

