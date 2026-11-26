// Adds DOM matchers such as toBeInTheDocument() and toHaveValue() to
// Vitest's expect.
import '@testing-library/jest-dom/vitest'

// The deck is saved in localStorage, so start every test with none saved.
beforeEach(() => {
  localStorage.clear()
})
