import OpenAI from 'openai'

export type TempleAIPreviewInput = {
  title?: unknown
  deity?: unknown
  templeType?: unknown
  templeTypes?: unknown
  categories?: unknown
  sacredCategories?: unknown
  city?: unknown
  state?: unknown
  establishedYear?: unknown
  speciality?: unknown
  existingDescription?: unknown
  existingDescriptionHi?: unknown
}

export type TempleDescriptionPreview = {
  description: string
  descriptionHi: string
  speciality: string
  specialityHi: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
}

export const TEMPLE_AI_MODEL = 'gpt-5-mini'

const TEMPLE_DESCRIPTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    description: { type: 'string' },
    descriptionHi: { type: 'string' },
    speciality: { type: 'string' },
    specialityHi: { type: 'string' },
    metaTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    metaKeywords: {
      type: 'array',
      minItems: 5,
      maxItems: 12,
      items: { type: 'string' },
    },
  },
  required: [
    'description',
    'descriptionHi',
    'speciality',
    'specialityHi',
    'metaTitle',
    'metaDescription',
    'metaKeywords',
  ],
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(item => stringValue(item)).filter(Boolean)
}

function templeContext(temple: TempleAIPreviewInput) {
  const categories = [
    ...stringList(temple.sacredCategories),
    ...stringList(temple.categories),
  ]

  return {
    title: stringValue(temple.title),
    deity: stringValue(temple.deity),
    templeType: stringValue(temple.templeType),
    templeTypes: stringList(temple.templeTypes),
    categories: Array.from(new Set(categories)),
    city: stringValue(temple.city),
    state: stringValue(temple.state),
    establishedYear: stringValue(temple.establishedYear),
    speciality: stringValue(temple.speciality),
    existingDescription: stringValue(temple.existingDescription),
    existingDescriptionHi: stringValue(temple.existingDescriptionHi),
  }
}

function parsePreview(value: unknown): TempleDescriptionPreview {
  if (!value || typeof value !== 'object') {
    throw new Error('OpenAI response did not contain a JSON object.')
  }

  const data = value as Partial<TempleDescriptionPreview>
  const metaKeywords = Array.isArray(data.metaKeywords)
    ? data.metaKeywords.map(item => stringValue(item)).filter(Boolean)
    : []

  const preview = {
    description: stringValue(data.description),
    descriptionHi: stringValue(data.descriptionHi),
    speciality: stringValue(data.speciality),
    specialityHi: stringValue(data.specialityHi),
    metaTitle: stringValue(data.metaTitle),
    metaDescription: stringValue(data.metaDescription),
    metaKeywords,
  }

  const missing = Object.entries(preview)
    .filter(([, fieldValue]) => Array.isArray(fieldValue) ? fieldValue.length === 0 : !fieldValue)
    .map(([field]) => field)

  if (missing.length > 0) {
    throw new Error(`OpenAI response missed required fields: ${missing.join(', ')}`)
  }

  return preview
}

export async function generateTempleDescriptionPreview(
  temple: TempleAIPreviewInput
): Promise<TempleDescriptionPreview> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.')
  }

  const openai = new OpenAI({ apiKey })
  const context = templeContext(temple)

  const systemPrompt = [
    'You write careful, spiritually authentic Hindu temple directory content for Sarvdev.',
    'Return only structured JSON matching the provided schema.',
    'Do not mention AI.',
    'Do not invent dates, miracles, founder names, historical events, or claims that are not present in the input.',
    'If historical details are uncertain, speak generally about devotion, tradition, darshan, pilgrimage, worship, and local spiritual importance.',
    'Respect the deity and tradition context. Keep the tone devotional, readable, factual, and inclusive of Hindu sampradayas.',
    'English description should be about 300 words or more.',
    'Hindi description should use Devanagari Hindi and include 250 or more meaningful Hindi word-like tokens.',
    'SEO metadata should be natural and useful, not keyword stuffed.',
  ].join('\n')

  const userPrompt = [
    'Generate a preview only. This content will be manually reviewed by an admin before any saving.',
    'Use the temple data below. Existing descriptions are context only; do not claim to be replacing or modifying them.',
    '',
    JSON.stringify(context, null, 2),
  ].join('\n')

  const response = await openai.responses.create({
    model: TEMPLE_AI_MODEL,
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.4,
    max_output_tokens: 4200,
    reasoning: { effort: 'low' },
    store: false,
    text: {
      verbosity: 'medium',
      format: {
        type: 'json_schema',
        name: 'temple_description_preview',
        strict: true,
        schema: TEMPLE_DESCRIPTION_SCHEMA,
      },
    },
  }, { timeout: 60_000 })

  if (response.error) {
    throw new Error(response.error.message || 'OpenAI response failed.')
  }

  if (response.status === 'incomplete') {
    throw new Error(`OpenAI response incomplete: ${response.incomplete_details?.reason || 'unknown reason'}`)
  }

  const outputText = response.output_text
  if (!outputText) {
    throw new Error('OpenAI response was empty.')
  }

  return parsePreview(JSON.parse(outputText))
}
