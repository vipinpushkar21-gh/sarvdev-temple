/**
 * Centralized Deity Categories
 * 
 * This is the SINGLE SOURCE OF TRUTH for all deity categories.
 * Used by:
 * - Admin create/edit forms
 * - Public deity filters
 * - Validation logic
 * - Any filtering/grouping of deities
 * 
 * DO NOT hardcode category lists in multiple files.
 * Always import from here.
 */

export type DeityCategory = {
  id: string              // Machine-readable slug for DB/URLs
  titleEn: string         // Display name (English)
  titleHi: string         // Display name (Hindi)
}

/**
 * All deity categories
 * Includes both canonical categories and legacy variations
 */
export const DEITY_CATEGORIES: DeityCategory[] = [
  // Main Trinity & Supreme Forms
  {
    id: 'tridev',
    titleEn: 'Tridev',
    titleHi: 'त्रिदेव'
  },
  {
    id: 'tridevi',
    titleEn: 'Tridevi',
    titleHi: 'त्रिदेवी'
  },

  // Major Deities
  {
    id: 'pramukh-devta',
    titleEn: 'Pramukh Devta',
    titleHi: 'प्रमुख देवता'
  },

  // Vishnu Avatars
  {
    id: 'dashavatar',
    titleEn: 'Bhagwan Vishnu ke Dashavatar',
    titleHi: 'भगवान विष्णु के दशावतार'
  },

  // Durga Forms
  {
    id: 'navadurga',
    titleEn: 'Maa Durga ke Navadurga Roop',
    titleHi: 'माँ दुर्गा के नवदुर्गा रूप'
  },

  // Tantric Goddess Forms
  {
    id: 'das-mahavidya',
    titleEn: 'Das Mahavidya',
    titleHi: 'दस महाविद्या'
  },

  // Shiva Forms
  {
    id: 'shiva-roop',
    titleEn: 'Bhagwan Shiva ke Pramukh Roop',
    titleHi: 'भगवान शिव के प्रमुख रूप'
  },

  // Vedic & Other Deities
  {
    id: 'vedic-devta',
    titleEn: 'Vedic aur Anya Devta',
    titleHi: 'वैदिक एवं अन्य देवता'
  },

  // Planetary Deities
  {
    id: 'navagraha',
    titleEn: 'Navagraha',
    titleHi: 'नवग्रह'
  },

  // Lakshmi Forms
  {
    id: 'ashta-lakshmi',
    titleEn: 'Ashta Lakshmi',
    titleHi: 'अष्ट लक्ष्मी'
  },

  // The Seven Immortals
  {
    id: 'sapta-chiranjeevi',
    titleEn: 'Sapta Chiranjeevi',
    titleHi: 'सप्त चिरंजीवी'
  },

  // Krishna Forms
  {
    id: 'krishna-roop',
    titleEn: 'Bhagwan Krishna ke Pramukh Roop',
    titleHi: 'भगवान कृष्ण के प्रमुख रूप'
  },

  // Ram Family
  {
    id: 'ram-parivar',
    titleEn: 'Ram Parivar',
    titleHi: 'राम परिवार'
  },

  // The Seven Sages
  {
    id: 'saptarishi',
    titleEn: 'Saptarishi',
    titleHi: 'सप्तऋषि'
  },

  // Directional Guardians
  {
    id: 'ashta-dikpal',
    titleEn: 'Ashta Dikpal',
    titleHi: 'अष्ट दिक्पाल'
  },

  // Sacred Rivers as Goddesses
  {
    id: 'pavitra-nadi',
    titleEn: 'Pavitra Nadi Deviyan',
    titleHi: 'पवित्र नदी देवियाँ'
  },

  // Legacy/Alternative Names (for backward compatibility)
  {
    id: 'ashta-vasu',
    titleEn: 'Ashta Vasu',
    titleHi: 'अष्ट वसु'
  },
  {
    id: 'ekadash-rudra',
    titleEn: 'Ekadash Rudra',
    titleHi: 'एकादश रुद्र'
  },
  {
    id: 'dwadash-aditya',
    titleEn: 'Dwadash Aditya',
    titleHi: 'द्वादश आदित्य'
  },
]

/**
 * Helper function: Get category by ID
 */
export function getCategoryById(id: string): DeityCategory | undefined {
  return DEITY_CATEGORIES.find(cat => cat.id === id)
}

/**
 * Helper function: Get category by English title (case-insensitive)
 */
export function getCategoryByTitleEn(titleEn: string): DeityCategory | undefined {
  return DEITY_CATEGORIES.find(cat => cat.titleEn.toLowerCase() === titleEn.toLowerCase())
}

/**
 * Helper function: Get display name (prefer English)
 */
export function getCategoryDisplayName(idOrTitle: string, hindi: boolean = false): string {
  const category = getCategoryById(idOrTitle) || getCategoryByTitleEn(idOrTitle)
  if (!category) return idOrTitle // fallback to original if not found
  return hindi ? category.titleHi : category.titleEn
}

/**
 * Helper function: Get all category IDs as sorted array
 */
export function getAllCategoryIds(): string[] {
  return DEITY_CATEGORIES.map(cat => cat.id).sort()
}

/**
 * Helper function: Get all display names (for dropdown options)
 * Returns array of {id, label} for use in select dropdowns
 */
export function getCategoryOptions(hindi: boolean = false) {
  return DEITY_CATEGORIES
    .map(cat => ({
      id: cat.id,
      label: hindi ? cat.titleHi : cat.titleEn,
      value: cat.id
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * Normalize category value for storage/lookup
 * Handles variations like "Shiva Forms", "Forms of Shiva", etc.
 */
export function normalizeCategory(raw: string): string {
  if (!raw) return 'other'
  
  const trimmed = raw.trim()
  
  // Try exact match first
  const exact = getCategoryById(trimmed) || getCategoryByTitleEn(trimmed)
  if (exact) return exact.id
  
  // Try case-insensitive ID match
  const byId = DEITY_CATEGORIES.find(cat => cat.id.toLowerCase() === trimmed.toLowerCase())
  if (byId) return byId.id
  
  // Try case-insensitive title match
  const byTitle = DEITY_CATEGORIES.find(cat => 
    cat.titleEn.toLowerCase() === trimmed.toLowerCase() ||
    cat.titleHi.toLowerCase() === trimmed.toLowerCase()
  )
  if (byTitle) return byTitle.id
  
  // Fallback: return the raw value (will appear dynamically in dropdown)
  // This supports legacy categories not in the predefined list
  return trimmed.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Verify category exists (for validation)
 * Returns true if category is known, false otherwise
 */
export function isCategoryValid(id: string): boolean {
  if (!id) return false
  return !!getCategoryById(id) || !!getCategoryByTitleEn(id)
}

/**
 * Get alternatives/aliases for a category (for migration purposes)
 * Maps old names to canonical names
 */
export const CATEGORY_ALIASES: Record<string, string> = {
  'Shiva Forms': 'shiva-roop',
  'Forms of Shiva': 'shiva-roop',
  'Krishna Forms': 'krishna-roop',
  'Forms of Krishna': 'krishna-roop',
  'Vishnu Avatars': 'dashavatar',
  'Vishnu Forms': 'dashavatar',
  'Durga Forms': 'navadurga',
  'Durga Roop': 'navadurga',
  'Goddess Forms': 'das-mahavidya',
  'Divine Vehicles': 'vedic-devta',
  'Divya Vahan': 'vedic-devta',
  'Regional Deities': 'vedic-devta',
  'Saints': 'saptarishi',
  'Gurus': 'saptarishi',
  'Hanuman Forms': 'pramukh-devta',
  'Ganesha Forms': 'pramukh-devta',
  'Devi Forms': 'das-mahavidya',
}

/**
 * Normalize with aliases
 */
export function normalizeCategoryWithAliases(raw: string): string {
  if (!raw) return 'other'
  
  // Check if it's an alias
  const aliasTarget = CATEGORY_ALIASES[raw]
  if (aliasTarget) return aliasTarget
  
  // Otherwise use normal normalization
  return normalizeCategory(raw)
}

export function resolveCanonicalCategoryId(raw?: string | null): string | null {
  if (!raw) return null
  const normalized = normalizeCategoryWithAliases(raw)
  if (getCategoryById(normalized)) return normalized

  const trimmed = raw.trim().toLowerCase()
  const prefixMatch = [...DEITY_CATEGORIES]
    .sort((a, b) => b.id.length - a.id.length)
    .find((category) => trimmed === category.id || trimmed.startsWith(`${category.id}-`))

  return prefixMatch?.id || null
}

export function resolveCategoryForDeity(category?: string | null, categoryId?: string | null): string | null {
  return resolveCanonicalCategoryId(category) || resolveCanonicalCategoryId(categoryId)
}
