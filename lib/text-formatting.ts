export function normalizeTextNewlines(text: unknown) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()
}

export function splitTextParagraphs(text: unknown) {
  const normalized = normalizeTextNewlines(text)
  if (!normalized) return []

  return normalized
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.split('\n').map((line) => line.trim()).filter(Boolean))
    .filter((paragraph) => paragraph.length > 0)
}

export function compactText(text: unknown) {
  return normalizeTextNewlines(text).replace(/\s+/g, ' ')
}
