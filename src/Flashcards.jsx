import { useEffect, useId, useRef, useState } from 'react'
import { loadDeck, saveDeck } from './deckStorage.js'
import FlashcardCard from './FlashcardCard.jsx'
import { sampleCards } from './sampleCards.js'
import styles from './Flashcards.module.css'

function countLabel(count) {
  return `${count} ${count === 1 ? 'card' : 'cards'}`
}

// A unique id per card, even for identical cards added in the same
// millisecond. randomUUID needs a secure context (HTTPS or localhost), so
// fall back to a random string when the page is served over plain HTTP.
function createCardId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function Flashcards() {
  // Starts from the deck saved in this browser, if any.
  const [cards, setCards] = useState(loadDeck)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [flippedCards, setFlippedCards] = useState({})
  // Read out by screen readers after each add or delete (role="status").
  const [announcement, setAnnouncement] = useState('')
  // Which field is missing ('question' or 'answer') and what to tell the user.
  const [formError, setFormError] = useState(null)
  const errorId = useId()

  const questionInput = useRef(null)
  const answerInput = useRef(null)
  const flipButtons = useRef(new Map())
  // Where focus goes once the deck has re-rendered, after a delete or after
  // loading the samples: a card id, or 'question' for the form.
  const pendingFocus = useRef(null)

  useEffect(() => {
    saveDeck(cards)
  }, [cards])

  useEffect(() => {
    const target = pendingFocus.current
    if (!target) return
    pendingFocus.current = null
    const element = target === 'question' ? questionInput.current : flipButtons.current.get(target)
    element?.focus()
  }, [cards])

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedQuestion = question.trim()
    const trimmedAnswer = answer.trim()

    if (!trimmedQuestion || !trimmedAnswer) {
      // Say what is missing and put the cursor there, rather than ignoring
      // the click. Nothing is added.
      const field = trimmedQuestion ? 'answer' : 'question'
      const message = !trimmedQuestion && !trimmedAnswer
        ? 'Add a question and an answer.'
        : `Add ${field === 'question' ? 'a question' : 'an answer'} for this card.`
      setFormError({ field, message })
      ;(field === 'question' ? questionInput : answerInput).current?.focus()
      return
    }

    setFormError(null)
    const newCard = {
      id: createCardId(),
      question: trimmedQuestion,
      answer: trimmedAnswer,
    }

    setCards((currentCards) => [newCard, ...currentCards])
    setQuestion('')
    setAnswer('')
    setAnnouncement(`Card added. ${countLabel(cards.length + 1)} in deck.`)
    // Ready for the next card straight away.
    questionInput.current?.focus()
  }

  function toggleCard(cardId) {
    setFlippedCards((currentCards) => ({
      ...currentCards,
      [cardId]: !currentCards[cardId],
    }))
  }

  function deleteCard(cardId) {
    // The focused Delete button is about to disappear, so pick the card that
    // takes its place (or the one before it) to receive focus instead.
    const index = cards.findIndex((card) => card.id === cardId)
    const neighbour = cards[index + 1] ?? cards[index - 1]
    pendingFocus.current = neighbour ? neighbour.id : 'question'

    setCards((currentCards) => currentCards.filter((card) => card.id !== cardId))
    setFlippedCards((currentCards) => {
      const nextCards = { ...currentCards }
      delete nextCards[cardId]
      return nextCards
    })
    setAnnouncement(`Card deleted. ${countLabel(cards.length - 1)} in deck.`)
  }

  // Offered on an empty deck, so a first visit can go straight to flipping.
  function loadSampleCards() {
    const samples = sampleCards.map((card) => ({ ...card, id: createCardId() }))
    pendingFocus.current = samples[0].id
    setCards(samples)
    setAnnouncement(`${samples.length} sample cards added.`)
  }

  return (
    <section className={styles.flashcards} aria-labelledby="flashcards-heading">
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.overline}>Practice deck</p>
          <h2 id="flashcards-heading">Flashcards</h2>
          <p>
            Add a question and answer, then flip a card to study your recall. Your deck is
            saved in this browser.
          </p>
        </div>

        <div className={styles.deckCount}>
          <strong>{cards.length}</strong>
          <span>{cards.length === 1 ? 'card' : 'cards'}</span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Question</span>
          <input
            ref={questionInput}
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value)
              setFormError(null)
            }}
            placeholder="Question"
            aria-invalid={formError?.field === 'question' || undefined}
            aria-describedby={formError?.field === 'question' ? errorId : undefined}
          />
        </label>

        <label className={styles.field}>
          <span>Answer</span>
          <input
            ref={answerInput}
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value)
              setFormError(null)
            }}
            placeholder="Answer"
            aria-invalid={formError?.field === 'answer' || undefined}
            aria-describedby={formError?.field === 'answer' ? errorId : undefined}
          />
        </label>

        {formError && (
          <p id={errorId} className={styles.formError} role="alert">
            {formError.message}
          </p>
        )}

        <button className={styles.primaryButton} type="submit">
          Add card
        </button>
      </form>

      {/* Always rendered, so screen readers announce each change to it. */}
      <p className={styles.srOnly} role="status">
        {announcement}
      </p>

      {cards.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            Q/A
          </span>
          <p>Your saved cards will appear here.</p>
          <button
            className={`${styles.secondaryButton} ${styles.sampleButton}`}
            type="button"
            onClick={loadSampleCards}
          >
            Load sample cards
          </button>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {cards.map((card) => (
            <FlashcardCard
              key={card.id}
              card={card}
              isFlipped={Boolean(flippedCards[card.id])}
              onFlip={() => toggleCard(card.id)}
              onDelete={() => deleteCard(card.id)}
              flipButtonRef={(element) => {
                if (element) flipButtons.current.set(card.id, element)
                else flipButtons.current.delete(card.id)
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
