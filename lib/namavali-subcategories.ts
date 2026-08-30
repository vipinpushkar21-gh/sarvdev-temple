/** Canonical Namavali subcategories. Keep these exact Hindi values in DB and CSV. */
export const NAMAVALI_SUBCATEGORIES = [
  'गणेश व शिव',
  'विष्णु',
  'राम व कृष्ण',
  'देवी व शक्ति',
  'अन्य प्रमुख देवता',
  'नवग्रह',
] as const

export type NamavaliSubcategory = (typeof NAMAVALI_SUBCATEGORIES)[number]

export const NAMAVALI_SUBCATEGORY_SET: ReadonlySet<string> = new Set(NAMAVALI_SUBCATEGORIES)

export function isValidNamavaliSubcategory(value: unknown): value is NamavaliSubcategory {
  return typeof value === 'string' && NAMAVALI_SUBCATEGORY_SET.has(value)
}
