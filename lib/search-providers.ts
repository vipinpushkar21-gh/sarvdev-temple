/**
 * lib/search-providers.ts — Search Provider Abstraction Layer
 *
 * Plug-and-play provider interface so the search backend can be switched
 * without any UI rewrite.
 *
 * Current production:  MongoSearchProvider  (regex + $text index)
 * Future providers:    AtlasSearchProvider  | TypesenseSearchProvider | MeiliSearchProvider
 *
 * To switch provider when ready (future):
 *   Set SEARCH_PROVIDER=atlas in .env.local
 *   The API routes read getSearchProvider() — zero UI changes needed.
 *
 * Atlas readiness checklist (when cluster is M10+):
 *   1. Create Atlas Search indexes for: temples, deities, devotionals, blogs
 *   2. Set SEARCH_PROVIDER=atlas in .env.local / Vercel env
 *   3. Implement AtlasSearchProvider.search() using $search aggregation
 *   4. No other changes needed — UI, types, routes all stay identical
 */

import type { SearchParams, SearchResponse, Suggestion } from '@/lib/search'

// ── Provider name registry ────────────────────────────────────────────────────

export type SearchProviderName = 'mongo' | 'atlas' | 'typesense' | 'meilisearch'

export const SUPPORTED_PROVIDERS: SearchProviderName[] = [
  'mongo',
  'atlas',
  'typesense',
  'meilisearch',
]

// ── Provider interface ────────────────────────────────────────────────────────

export interface ISearchProvider {
  readonly name: SearchProviderName
  search(params: SearchParams): Promise<SearchResponse>
  suggest(q: string, limit?: number): Promise<Suggestion[]>
  isAvailable(): Promise<boolean>
}

// ── Provider metadata (for dashboard display) ─────────────────────────────────

export type ProviderMeta = {
  name: SearchProviderName
  label: string
  description: string
  requiresEnv: string[]
  supportsFullText: boolean
  supportsFuzzy: boolean
  supportsVector: boolean
  productionReady: boolean
}

export const PROVIDER_META: Record<SearchProviderName, ProviderMeta> = {
  mongo: {
    name: 'mongo',
    label: 'MongoDB (Regex + Text Index)',
    description: 'Native MongoDB $text search with regex fallback. Current production provider.',
    requiresEnv: ['MONGODB_URI'],
    supportsFullText: true,
    supportsFuzzy: false,
    supportsVector: false,
    productionReady: true,
  },
  atlas: {
    name: 'atlas',
    label: 'MongoDB Atlas Search',
    description: 'Atlas $search with autocomplete, fuzzy, phrase compound queries. Requires M10+ cluster.',
    requiresEnv: ['MONGODB_URI'],
    supportsFullText: true,
    supportsFuzzy: true,
    supportsVector: true,
    productionReady: false,
  },
  typesense: {
    name: 'typesense',
    label: 'Typesense',
    description: 'Open-source typo-tolerant search engine with instant results.',
    requiresEnv: ['TYPESENSE_API_KEY', 'TYPESENSE_HOST'],
    supportsFullText: true,
    supportsFuzzy: true,
    supportsVector: false,
    productionReady: false,
  },
  meilisearch: {
    name: 'meilisearch',
    label: 'Meilisearch',
    description: 'Open-source search engine with typo tolerance and filters.',
    requiresEnv: ['MEILISEARCH_HOST', 'MEILISEARCH_API_KEY'],
    supportsFullText: true,
    supportsFuzzy: true,
    supportsVector: false,
    productionReady: false,
  },
}

// ── MongoSearchProvider (current production) ──────────────────────────────────

export class MongoSearchProvider implements ISearchProvider {
  readonly name: SearchProviderName = 'mongo'

  async search(_params: SearchParams): Promise<SearchResponse> {
    throw new Error(
      'MongoSearchProvider.search() is implemented directly in /api/search/route.ts ' +
      'for performance. This class exists as a registry entry.'
    )
  }

  async suggest(_q: string, _limit = 10): Promise<Suggestion[]> {
    throw new Error(
      'MongoSearchProvider.suggest() is implemented in /api/search/suggest/route.ts.'
    )
  }

  async isAvailable(): Promise<boolean> {
    try {
      const { connectDB } = await import('@/lib/db')
      await connectDB()
      return true
    } catch {
      return false
    }
  }
}

// ── AtlasSearchProvider (stub — not yet enabled) ──────────────────────────────

export class AtlasSearchProvider implements ISearchProvider {
  readonly name: SearchProviderName = 'atlas'

  async search(_params: SearchParams): Promise<SearchResponse> {
    // Implementation guide (when M10+ cluster is available):
    //
    // const pipeline = [
    //   {
    //     $search: {
    //       index: 'temple_search',
    //       compound: {
    //         should: [
    //           { text: { query: params.q, path: 'title', fuzzy: { maxEdits: 1 }, score: { boost: { value: 10 } } } },
    //           { text: { query: params.q, path: 'deity', score: { boost: { value: 5 } } } },
    //           { text: { query: params.q, path: 'city', score: { boost: { value: 3 } } } },
    //         ],
    //       },
    //     },
    //   },
    //   { $addFields: { score: { $meta: 'searchScore' } } },
    //   { $match: { status: { $ne: 'rejected' } } },
    //   { $limit: params.limit ?? 6 },
    // ]
    // const docs = await Temple.aggregate(pipeline)
    // ...
    throw new Error('AtlasSearchProvider: set SEARCH_PROVIDER=atlas after creating Atlas Search indexes.')
  }

  async suggest(_q: string, _limit = 10): Promise<Suggestion[]> {
    // Atlas autocomplete: uses $search with "autocomplete" operator
    throw new Error('AtlasSearchProvider.suggest() not yet implemented.')
  }

  async isAvailable(): Promise<boolean> {
    // M10+ cluster required; Atlas Search index must exist
    return false
  }
}

// ── TypesenseSearchProvider (stub) ────────────────────────────────────────────

export class TypesenseSearchProvider implements ISearchProvider {
  readonly name: SearchProviderName = 'typesense'

  async search(_params: SearchParams): Promise<SearchResponse> {
    // npm install typesense
    // const client = new Typesense.Client({ nodes: [...], apiKey: process.env.TYPESENSE_API_KEY })
    // const results = await client.collections('temples').documents().search({ q: params.q, query_by: 'title,deity', per_page: params.limit })
    throw new Error('TypesenseSearchProvider: set TYPESENSE_API_KEY and TYPESENSE_HOST.')
  }

  async suggest(_q: string, _limit = 10): Promise<Suggestion[]> {
    throw new Error('TypesenseSearchProvider.suggest() not yet implemented.')
  }

  async isAvailable(): Promise<boolean> {
    return !!(process.env.TYPESENSE_API_KEY && process.env.TYPESENSE_HOST)
  }
}

// ── MeiliSearchProvider (stub) ────────────────────────────────────────────────

export class MeiliSearchProvider implements ISearchProvider {
  readonly name: SearchProviderName = 'meilisearch'

  async search(_params: SearchParams): Promise<SearchResponse> {
    // npm install meilisearch
    // const client = new MeiliSearch({ host: process.env.MEILISEARCH_HOST, apiKey: process.env.MEILISEARCH_API_KEY })
    // const results = await client.index('temples').search(params.q, { limit: params.limit })
    throw new Error('MeiliSearchProvider: set MEILISEARCH_HOST and MEILISEARCH_API_KEY.')
  }

  async suggest(_q: string, _limit = 10): Promise<Suggestion[]> {
    throw new Error('MeiliSearchProvider.suggest() not yet implemented.')
  }

  async isAvailable(): Promise<boolean> {
    return !!(process.env.MEILISEARCH_HOST && process.env.MEILISEARCH_API_KEY)
  }
}

// ── Provider registry & factory ───────────────────────────────────────────────

type ProviderFactory = () => ISearchProvider

const PROVIDER_MAP: Record<SearchProviderName, ProviderFactory> = {
  mongo:       () => new MongoSearchProvider(),
  atlas:       () => new AtlasSearchProvider(),
  typesense:   () => new TypesenseSearchProvider(),
  meilisearch: () => new MeiliSearchProvider(),
}

/**
 * Returns the configured search provider.
 *
 * Reads SEARCH_PROVIDER env var (default: 'mongo').
 *
 * @example
 * // To switch to Atlas Search in future:
 * // SEARCH_PROVIDER=atlas in .env.local
 * const provider = getSearchProvider()  // returns MongoSearchProvider in production
 */
export function getSearchProvider(override?: SearchProviderName): ISearchProvider {
  const providerName: SearchProviderName =
    override ??
    ((process.env.SEARCH_PROVIDER as SearchProviderName | undefined) || 'mongo')

  const factory = PROVIDER_MAP[providerName]
  if (!factory) {
    console.warn(`[search-providers] Unknown provider "${providerName}", falling back to mongo`)
    return new MongoSearchProvider()
  }
  return factory()
}

/**
 * The currently active provider name (read from env at module load time).
 * Used for logging, dashboards, and response headers.
 */
export const ACTIVE_PROVIDER_NAME: SearchProviderName =
  ((process.env.SEARCH_PROVIDER as SearchProviderName | undefined) || 'mongo')
