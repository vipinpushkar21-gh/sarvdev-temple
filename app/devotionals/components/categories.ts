export type CategoryDef = {
  id: string;
  label: string;
  hindi?: string;
  icon?: string;
};

// Unified category config drawn from schema + commonly used types in data/scripts
export const FULL_CATEGORIES: CategoryDef[] = [
  { id: 'Aarti', label: 'Aarti', hindi: 'आरती', icon: '🪔' },
  { id: 'Bhajan', label: 'Bhajan', hindi: 'भजन', icon: '🎵' },
  { id: 'Chalisa', label: 'Chalisa', hindi: 'चालीसा', icon: '🙏' },
  { id: 'Mantra', label: 'Mantra', hindi: 'मंत्र', icon: '🔮' },
  { id: 'Stotra', label: 'Stotra', hindi: 'स्तोत्र', icon: '📿' },
  { id: 'Stuti', label: 'Stuti', hindi: 'स्तुति', icon: '🌟' },
  { id: 'Shloka', label: 'Shloka', hindi: 'श्लोक', icon: '📖' },
  { id: 'Ek Shloki', label: 'Ek Shloki', hindi: 'एक श्लोकी', icon: '1️⃣' },
  { id: 'Ashtaka', label: 'Ashtaka', hindi: 'अष्टकम्', icon: '🔸' },
  { id: 'Sahasranama', label: 'Sahasranama', hindi: 'सहस्रनाम', icon: '🔢' },
  { id: 'Path', label: 'Path', hindi: 'पाठ', icon: '📚' },
  { id: 'Namavali', label: 'Namavali', hindi: 'नामावली', icon: '🔢' },
  { id: '108 Namavali', label: '108 Namavali', hindi: '१०८ नामावली', icon: '🔢' },
  { id: 'Kavacham', label: 'Kavacham', hindi: 'कवचम्', icon: '🛡️' },
  { id: 'Prarthana', label: 'Prarthana', hindi: 'प्रार्थना', icon: '🙏' },
  { id: 'Vrat Katha', label: 'Vrat Katha', hindi: 'व्रत कथा', icon: '📜' },
  { id: 'Rashi', label: 'Rashi', hindi: 'राशि', icon: '♈' },
  { id: 'Vastu', label: 'Vastu', hindi: 'वास्तु', icon: '🏠' },
  { id: 'Durga', label: 'Durga', hindi: 'दुर्गा', icon: '🔱' },
  { id: 'Kuber', label: 'Kuber', hindi: 'कुबेर', icon: '💰' },
  { id: 'Other', label: 'Other', hindi: 'अन्य', icon: '📄' },
];
