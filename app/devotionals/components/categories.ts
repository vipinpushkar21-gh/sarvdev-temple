export type CategoryDef = {
  id: string;
  label: string;
  hindi?: string;
  icon?: string;
  emoji?: string;
};

// Unified category config drawn from schema + commonly used types in data/scripts
export const FULL_CATEGORIES: CategoryDef[] = [
  { id: 'Aarti', label: 'Aarti', hindi: 'आरती', emoji: '🪔' },
  { id: 'Bhajan', label: 'Bhajan', hindi: 'भजन', emoji: '🎵' },
  { id: 'Chalisa', label: 'Chalisa', hindi: 'चालीसा', emoji: '📿' },
  { id: 'Mantra', label: 'Mantra', hindi: 'मंत्र', emoji: '🕉️' },
  { id: 'Stotra', label: 'Stotra', hindi: 'स्तोत्र', emoji: '📜' },
  { id: 'Stuti', label: 'Stuti', hindi: 'स्तुति', emoji: '🙏' },
  { id: 'Shloka', label: 'Shloka', hindi: 'श्लोक', emoji: '✨' },
  { id: 'Ek Shloki', label: 'Ek Shloki', hindi: 'एक श्लोकी', emoji: '🔱' },
  { id: 'Ashtaka', label: 'Ashtaka', hindi: 'अष्टकम्', emoji: '🪷' },
  { id: 'Path', label: 'Path', hindi: 'पाठ', emoji: '📕' },
  { id: 'Namavali', label: 'Namavali', hindi: 'नामावली', emoji: '📝' },
  { id: 'Kavacham', label: 'Kavacham', hindi: 'कवचम्', emoji: '🛡️' },
  { id: 'Prarthana', label: 'Prarthana', hindi: 'प्रार्थना', emoji: '🙏🏽' },
  { id: 'Vrat Katha', label: 'Vrat Katha', hindi: 'व्रत कथा', emoji: '📖' },
  // Removed 'Stotra/Suktam' category
];

// Categories to hide from Browse list
export const EXCLUDED_CATEGORY_IDS = new Set<string>([
  'Rashi', 'Vastu', 'Durga', 'Kuber', 'Other'
]);
