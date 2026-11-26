import { loadDeck, saveDeck, STORAGE_KEY } from '../src/deckStorage.js'

const card = { id: 'a1', question: 'What is state?', answer: 'Data that can change.' }

describe('deck storage', () => {
  it('returns an empty deck when nothing is saved', () => {
    expect(loadDeck()).toEqual([])
  })

  it('loads the deck it saved', () => {
    saveDeck([card])
    expect(loadDeck()).toEqual([card])
  })

  it('returns an empty deck when the saved data is not valid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadDeck()).toEqual([])
  })

  it('returns an empty deck when the saved data is not a list', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cards: [card] }))
    expect(loadDeck()).toEqual([])
  })

  it('skips saved entries that are not complete cards', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([card, { id: 2, question: 'No answer' }, null, 'text']),
    )
    expect(loadDeck()).toEqual([card])
  })

  it('keeps working when the browser refuses to store anything', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    try {
      expect(() => saveDeck([card])).not.toThrow()
      expect(loadDeck()).toEqual([])
    } finally {
      setItem.mockRestore()
      getItem.mockRestore()
    }
  })
})
