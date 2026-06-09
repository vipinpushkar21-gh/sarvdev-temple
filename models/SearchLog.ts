/**
 * models/SearchLog.ts — Search Analytics Collection
 *
 * Stores every search query and click event.
 * TTL: 90-day auto-expiry via timestamp index.
 *
 * Written by: search route (server-side, fire-and-forget)
 * Written by: /api/search/log (client-side click events)
 * Read by:    /api/admin/search (health dashboard)
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISearchLog extends Document {
  query: string
  normalizedQuery: string
  provider: string
  resultCount: number
  clickedResult: string | null
  clickedType: string | null
  type: string
  durationMs: number | null
  timestamp: Date
}

const SearchLogSchema = new Schema<ISearchLog>(
  {
    query:           { type: String, required: true, maxlength: 300 },
    normalizedQuery: { type: String, required: true, maxlength: 300 },
    provider:        { type: String, default: 'mongo', maxlength: 50 },
    resultCount:     { type: Number, default: 0 },
    clickedResult:   { type: String, default: null, maxlength: 500 },
    clickedType:     { type: String, default: null, maxlength: 50 },
    type:            { type: String, default: 'all', maxlength: 50 },
    durationMs:      { type: Number, default: null },
    timestamp:       { type: Date, default: Date.now },
  },
  { timestamps: false, versionKey: false }
)

// TTL: auto-delete after 90 days
SearchLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7_776_000, name: 'ttl_90d' })

// Analytics compound indexes
SearchLogSchema.index({ normalizedQuery: 1, timestamp: -1 }, { name: 'query_time' })
SearchLogSchema.index({ resultCount: 1, timestamp: -1 },     { name: 'zeroResults_time' })
SearchLogSchema.index({ provider: 1, timestamp: -1 },        { name: 'provider_time' })

const SearchLog: Model<ISearchLog> =
  (mongoose.models.SearchLog as Model<ISearchLog>) ||
  mongoose.model<ISearchLog>('SearchLog', SearchLogSchema)

export default SearchLog
