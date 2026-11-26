import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Flashcards from '../src/Flashcards.jsx'

function renderDeck() {
  const user = userEvent.setup()
  render(<Flashcards />)
  return user
}

async function fillForm(user, question, answer) {
  const questionInput = screen.getByPlaceholderText('Question')
  const answerInput = screen.getByPlaceholderText('Answer')
  await user.clear(questionInput)
  await user.clear(answerInput)
  if (question) await user.type(questionInput, question)
  if (answer) await user.type(answerInput, answer)
}

async function addCard(user, question, answer) {
  await fillForm(user, question, answer)
  await user.click(screen.getByRole('button', { name: 'Add card' }))
}

const cards = () => screen.queryAllByTestId('flashcard')

// Each face shows the question, but only the face toward the reader is
// exposed, so a card has exactly one question heading at a time.
function cardWithQuestion(question) {
  return cards().find((card) => within(card).queryByRole('heading', { name: question }))
}

describe('flashcard deck', () => {
  it('starts empty', () => {
    renderDeck()
    expect(cards()).toHaveLength(0)
    expect(screen.getByText('Your saved cards will appear here.')).toBeInTheDocument()
  })

  it('adds a card, shows its question, and clears the form', async () => {
    const user = renderDeck()
    await addCard(user, 'What does JSX compile to?', 'React.createElement calls')

    expect(cards()).toHaveLength(1)
    expect(
      within(cards()[0]).getByRole('heading', { name: 'What does JSX compile to?' }),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Question')).toHaveValue('')
    expect(screen.getByPlaceholderText('Answer')).toHaveValue('')
  })

  it('adds a card when Enter is pressed in the form', async () => {
    const user = renderDeck()
    await fillForm(user, 'Keyboard question', 'Keyboard answer')
    await user.keyboard('{Enter}')
    expect(cards()).toHaveLength(1)
  })

  it('trims spaces around the question and answer', async () => {
    const user = renderDeck()
    await addCard(user, '   Padded question   ', '   Padded answer   ')

    await user.click(within(cards()[0]).getByRole('button', { name: 'Flip' }))
    expect(screen.getByText('Padded answer')).toBeInTheDocument()
    expect(within(cards()[0]).getAllByText('Padded question').length).toBeGreaterThan(0)
  })

  it.each([
    ['both fields are empty', '', ''],
    ['the answer is empty', 'Only a question', ''],
    ['the question is empty', '', 'Only an answer'],
    ['both fields hold only spaces', '   ', '   '],
  ])('adds nothing when %s', async (_case, question, answer) => {
    const user = renderDeck()
    await addCard(user, question, answer)
    expect(cards()).toHaveLength(0)
  })

  it('says which field is missing and moves the cursor there', async () => {
    const user = renderDeck()
    await addCard(user, 'A question with no answer', '')

    expect(screen.getByRole('alert')).toHaveTextContent('Add an answer for this card.')
    const answerInput = screen.getByPlaceholderText('Answer')
    expect(answerInput).toHaveFocus()
    expect(answerInput).toHaveAttribute('aria-invalid', 'true')
    expect(answerInput).toHaveAccessibleDescription('Add an answer for this card.')
    expect(screen.getByPlaceholderText('Question')).not.toHaveAttribute('aria-invalid')
    expect(cards()).toHaveLength(0)
  })

  it('asks for both fields when the form is empty', async () => {
    const user = renderDeck()
    await user.click(screen.getByRole('button', { name: 'Add card' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Add a question and an answer.')
    expect(screen.getByPlaceholderText('Question')).toHaveFocus()
  })

  it('clears the message once the user starts fixing it', async () => {
    const user = renderDeck()
    await addCard(user, 'Half done', '')
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Answer'), 'Now complete')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('Answer')).not.toHaveAttribute('aria-invalid')

    await user.click(screen.getByRole('button', { name: 'Add card' }))
    expect(cards()).toHaveLength(1)
  })

  it('offers sample cards on an empty deck, then focuses the first one', async () => {
    const user = renderDeck()
    await user.click(screen.getByRole('button', { name: 'Load sample cards' }))

    expect(cards()).toHaveLength(4)
    expect(screen.getByRole('status')).toHaveTextContent('4 sample cards added.')
    expect(within(cards()[0]).getByRole('button', { name: 'Flip' })).toHaveFocus()
    // The offer belongs to the empty deck only.
    expect(screen.queryByRole('button', { name: 'Load sample cards' })).not.toBeInTheDocument()

    await user.click(within(cards()[0]).getByRole('button', { name: 'Flip' }))
    expect(within(cards()[0]).getByText(/the page when the data changes/)).toBeInTheDocument()
  })

  it('keeps the deck after the page is reloaded, but not the flipped state', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Flashcards />)
    await addCard(user, 'Survives a reload?', 'Yes, from localStorage')
    await user.click(within(cards()[0]).getByRole('button', { name: 'Flip' }))
    unmount()

    render(<Flashcards />)
    expect(cards()).toHaveLength(1)
    expect(within(cards()[0]).getByRole('heading', { name: 'Survives a reload?' })).toBeInTheDocument()
    expect(screen.queryByText('Yes, from localStorage')).not.toBeInTheDocument()
  })

  it('puts the newest card first', async () => {
    const user = renderDeck()
    await addCard(user, 'First question', 'First answer')
    await addCard(user, 'Second question', 'Second answer')

    expect(cards()).toHaveLength(2)
    expect(cards()[0]).toHaveTextContent('Second question')
    expect(cards()[1]).toHaveTextContent('First question')
  })

  it('keeps the answer out of the page until the card is flipped', async () => {
    const user = renderDeck()
    await addCard(user, 'Hidden?', 'Revealed answer')
    expect(screen.queryByText('Revealed answer')).not.toBeInTheDocument()

    await user.click(within(cards()[0]).getByRole('button', { name: 'Flip' }))
    expect(screen.getByText('Revealed answer')).toBeInTheDocument()
  })

  it('hides the answer again when the card is flipped back', async () => {
    const user = renderDeck()
    await addCard(user, 'Flip twice', 'Now you see me')

    await user.click(within(cards()[0]).getByRole('button', { name: 'Flip' }))
    await user.click(within(cards()[0]).getByRole('button', { name: 'Flip' }))
    expect(screen.queryByText('Now you see me')).not.toBeInTheDocument()
  })

  it('announces added and deleted cards to screen readers', async () => {
    const user = renderDeck()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()

    await addCard(user, 'Announced', 'Out loud')
    expect(screen.getByRole('status')).toHaveTextContent('Card added. 1 card in deck.')

    await addCard(user, 'Announced again', 'Twice')
    expect(screen.getByRole('status')).toHaveTextContent('Card added. 2 cards in deck.')

    await user.click(within(cardWithQuestion('Announced')).getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('status')).toHaveTextContent('Card deleted. 1 card in deck.')
  })

  it('keeps identical cards separate, even when added in the same millisecond', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const user = renderDeck()
      await addCard(user, 'Same question', 'Same answer')
      await addCard(user, 'Same question', 'Same answer')
      expect(cards()).toHaveLength(2)

      await user.click(within(cards()[0]).getByRole('button', { name: 'Delete' }))

      // The other card must still be a working card, not a leftover node.
      expect(cards()).toHaveLength(1)
      await user.click(within(cards()[0]).getByRole('button', { name: 'Flip' }))
      expect(screen.getByText('Same answer')).toBeInTheDocument()
      expect(consoleError.mock.calls.flat().join(' ')).not.toContain('same key')
    } finally {
      vi.restoreAllMocks()
    }
  })

  it('returns focus to the Question field after adding a card', async () => {
    const user = renderDeck()
    await addCard(user, 'Next one', 'Ready')
    expect(screen.getByPlaceholderText('Question')).toHaveFocus()
  })

  it('moves focus to a neighbouring card after a delete, then to the form when the deck is empty', async () => {
    const user = renderDeck()
    await addCard(user, 'Card A', 'Answer A')
    await addCard(user, 'Card B', 'Answer B')
    await addCard(user, 'Card C', 'Answer C')
    // Newest first: C, B, A.
    const flipOf = (question) => within(cardWithQuestion(question)).getByRole('button', { name: 'Flip' })
    const deleteOf = (question) => within(cardWithQuestion(question)).getByRole('button', { name: 'Delete' })

    await user.click(deleteOf('Card B'))
    expect(flipOf('Card A')).toHaveFocus() // the card that took its place

    await user.click(deleteOf('Card A'))
    expect(flipOf('Card C')).toHaveFocus() // no card after it, so the one before

    await user.click(deleteOf('Card C'))
    expect(screen.getByPlaceholderText('Question')).toHaveFocus()
  })

  it('keeps both faces in place so a card never turns to a blank side', async () => {
    const user = renderDeck()
    await addCard(user, 'Two sides', 'Back side answer')
    const card = cards()[0]
    const flip = within(card).getByRole('button', { name: 'Flip' })

    await user.click(flip)
    await user.click(flip)

    // While the card turns back, both faces still show the question, only
    // the face toward the reader is exposed, and the answer has left.
    expect(card.querySelectorAll('h3')).toHaveLength(2)
    expect(within(card).getAllByRole('heading')).toHaveLength(1)
    expect(screen.queryByText('Back side answer')).not.toBeInTheDocument()
  })

  it('keeps one Flip and one Delete per card, with focus on a visible button after flipping', async () => {
    const user = renderDeck()
    await addCard(user, 'Keyboard flip', 'Still focused')
    const card = cards()[0]
    const flip = within(card).getByRole('button', { name: 'Flip' })
    expect(flip).toHaveAttribute('aria-pressed', 'false')

    flip.focus()
    await user.keyboard('{Enter}')

    expect(flip).toHaveAttribute('aria-pressed', 'true')
    expect(flip).toHaveFocus()
    expect(card.querySelectorAll('button')).toHaveLength(2)
    expect(card.querySelectorAll('[aria-hidden="true"] button')).toHaveLength(0)
  })

  it('flips each card on its own', async () => {
    const user = renderDeck()
    await addCard(user, 'Card A', 'Answer A')
    await addCard(user, 'Card B', 'Answer B')

    await user.click(within(cardWithQuestion('Card A')).getByRole('button', { name: 'Flip' }))
    expect(screen.getByText('Answer A')).toBeInTheDocument()
    expect(screen.queryByText('Answer B')).not.toBeInTheDocument()
  })

  it('deletes only the card you choose', async () => {
    const user = renderDeck()
    await addCard(user, 'Keep me', 'Kept')
    await addCard(user, 'Delete me', 'Deleted')

    await user.click(within(cardWithQuestion('Delete me')).getByRole('button', { name: 'Delete' }))

    expect(cards()).toHaveLength(1)
    expect(cards()[0]).toHaveTextContent('Keep me')
  })
})
