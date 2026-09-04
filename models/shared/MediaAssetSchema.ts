import { Schema } from 'mongoose'
import { MEDIA_KINDS } from '../../lib/media-asset'

export const MediaAssetSchema = new Schema({
  url: String,
  publicId: { type: String, index: true },
  assetId: { type: String, index: true },
  version: Number,
  width: Number,
  height: Number,
  format: String,
  bytes: Number,
  folder: String,
  alt: String,
  kind: { type: String, enum: MEDIA_KINDS },
}, { _id: false })
