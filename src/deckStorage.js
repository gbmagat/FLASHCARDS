// Keeps the flashcard deck in localStorage so it survives a reload. Storage
// can be unavailable (private browsing, blocked site data) or hold data from
// somewhere else, so every read and write is defensive: if anything goes
// wrong, the app keeps working and simply does not remember the deck.
export const STORAGE_KEY = 'course-companion.deck.v1'

function isCard(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.question === 'string' &&
    typeof value.answer === 'string'
  )
}

export function loadDeck() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved.filter(isCard) : []
  } catch {
    return []
  }
}

export function saveDeck(cards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
  } catch {
    // Storage is full or unavailable: carry on without saving.
  }
}
