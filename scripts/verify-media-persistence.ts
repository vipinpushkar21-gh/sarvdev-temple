import assert from 'node:assert/strict'
import Temple from '../models/Temple'
import Deity from '../models/Deity'
import Devotional from '../models/Devotional'
import Blog from '../models/Blog'
import Darshan from '../models/Darshan'
import Event from '../models/Event'
import SpiritualIcon from '../models/SpiritualIcon'
import { getDeityCardImage } from '../lib/temple-image'
import { isMediaAsset } from '../lib/media-asset'

const url = 'https://res.cloudinary.com/dc2qg7bwr/image/upload/v123/sarvdev/test/legacy.jpg'
const media = {
  url,
  publicId: 'sarvdev/test/structured',
  assetId: 'asset-structured-test',
  version: 123,
  width: 2048,
  height: 2048,
  format: 'webp',
  bytes: 123456,
  folder: 'sarvdev/test',
  kind: 'deity-artwork' as const,
}

const cases = [
  ['Temple', Temple, { title: 'Schema Test', primaryImage: url, primaryMedia: { ...media, kind: 'temple-photo' } }],
  ['Deity', Deity, { name: 'Schema Test', nameHi: 'Test', slug: 'schema-test', imageCard: url, cardMedia: media }],
  ['Devotional', Devotional, { title: 'Schema Test', image: url, primaryMedia: { ...media, kind: 'devotional-artwork' } }],
  ['Blog', Blog, { title: 'Schema Test', imageCard: url, cardMedia: { ...media, kind: 'blog-photo' } }],
  ['Darshan', Darshan, { title: 'Schema Test', imageCard: url, cardMedia: { ...media, kind: 'darshan' } }],
  ['Event', Event, { title: 'Schema Test', imageCard: url, cardMedia: { ...media, kind: 'other' } }],
  ['SpiritualIcon', SpiritualIcon, { name: 'Schema Test', slug: 'schema-test', imageCard: url, cardMedia: { ...media, kind: 'portrait' } }],
] as const

for (const [name, Model, input] of cases) {
  const document = new (Model as any)(input)
  const validationError = document.validateSync()
  assert.equal(validationError, undefined, `${name} schema validation failed: ${validationError?.message}`)
  const plain = document.toObject()
  const structured = plain.primaryMedia || plain.cardMedia
  const expected = (input as any).primaryMedia || (input as any).cardMedia
  assert.equal(plain.primaryImage || plain.imageCard || plain.image, url, `${name} lost its legacy URL`)
  assert.equal(structured.publicId, media.publicId, `${name} lost publicId`)
  assert.equal(structured.assetId, media.assetId, `${name} lost assetId`)
  for (const field of ['url', 'version', 'width', 'height', 'format', 'bytes', 'folder', 'kind'] as const) {
    assert.equal(structured[field], expected[field], `${name} lost ${field}`)
  }
  console.log(`${name}: legacy URL + publicId + assetId preserved`)
}

const structuredSource = getDeityCardImage({ imageCard: url, cardMedia: media })
assert.match(structuredSource.src, /sarvdev\/test\/structured\.webp/, 'structured publicId was not preferred')
const legacySource = getDeityCardImage({ imageCard: url })
assert.match(legacySource.src, /sarvdev\/test\/legacy\.jpg/, 'legacy URL fallback failed')
console.log('Renderer: structured publicId priority and legacy fallback verified')

assert.equal(isMediaAsset({ name: 'Record', imageCard: url, cardMedia: media }), false, 'generic content object was misclassified')
assert.equal(isMediaAsset({ publicId: media.publicId, assetId: media.assetId, url }), true, 'structured media was not recognized')
console.log('Type guard: generic content rejected and structured media accepted')
