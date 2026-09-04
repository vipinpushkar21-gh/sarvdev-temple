/** Public content safety rules shared by discovery, search, and detail routes. */
export const PUBLIC_TEST_SLUG = /^(?:smoke-test|demo-test|test-demo)-/i

export function isPublicContentSlug(slug: unknown): boolean {
  return typeof slug === 'string' && Boolean(slug) && !PUBLIC_TEST_SLUG.test(slug)
}

/** Merge this into an existing Mongo filter without changing admin visibility. */
export const publicContentSlugFilter = { slug: { $not: PUBLIC_TEST_SLUG } }
