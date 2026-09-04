/** Canonical Mantra subcategories. Keep these exact Hindi values in DB and CSV. */
export const MANTRA_SUBCATEGORIES = [
  'गणेश',
  'शिव व रुद्र',
  'विष्णु, राम व कृष्ण',
  'दुर्गा व शक्ति',
  'लक्ष्मी',
  'सरस्वती',
  'हनुमान',
  'सूर्य व नवग्रह',
  'कुबेर',
  'वास्तु व गृह शांति',
  'राशि व ज्योतिष मंत्र',
  'वैदिक व शांति मंत्र',
  'अन्य देवता',
] as const

export type MantraSubcategory = (typeof MANTRA_SUBCATEGORIES)[number]

export const MANTRA_SUBCATEGORY_SET: ReadonlySet<string> = new Set(MANTRA_SUBCATEGORIES)

export function isValidMantraSubcategory(value: unknown): value is MantraSubcategory {
  return typeof value === 'string' && MANTRA_SUBCATEGORY_SET.has(value)
}

