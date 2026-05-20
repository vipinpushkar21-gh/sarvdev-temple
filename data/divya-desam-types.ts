export type DivyaDesamReference = {
  key: string
  name: string
  aliases: string[]
  deityName: string
  thayarName: string
  city: string
  district: string
  state: string
  country: string
  region: string
  description: string
  descriptionHi: string
  speciality: string
  templeType: string
  sacredCategories: string[]
}

export type DivyaDesamTempleLike = {
  _id?: unknown
  id?: unknown
  slug?: unknown
  title?: unknown
  name?: unknown
  deity?: unknown
  city?: unknown
  state?: unknown
  country?: unknown
  categories?: unknown
  sacredCategories?: unknown
  templeType?: unknown
  templeTypes?: unknown
  canonicalDivyaDesam?: unknown
  canonicalDivyaDesamKey?: unknown
  canonicalDivyaDesamName?: unknown
  divyaDesamMeta?: unknown
}
