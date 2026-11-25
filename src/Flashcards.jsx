import { useEffect, useRef, useState } from 'react'
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
  const [cards, setCards] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [flippedCards, setFlippedCards] = useState({})
  // Read out by screen readers after each add or delete (role="status").
  const [announcement, setAnnouncement] = useState('')

  const questionInput = useRef(null)
  const flipButtons = useRef(new Map())
  // Where focus goes once a deleted card has left the page: a card id, or
  // 'question' for the form when the deck is empty.
  const focusAfterDelete = useRef(null)

  useEffect(() => {
    const target = focusAfterDelete.current
    if (!target) return
    focusAfterDelete.current = null
    const element = target === 'question' ? questionInput.current : flipButtons.current.get(target)
    element?.focus()
  }, [cards])

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedQuestion = question.trim()
    const trimmedAnswer = answer.trim()

    if (!trimmedQuestion || !trimmedAnswer) return

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
    focusAfterDelete.current = neighbour ? neighbour.id : 'question'

    setCards((currentCards) => currentCards.filter((card) => card.id !== cardId))
    setFlippedCards((currentCards) => {
      const nextCards = { ...currentCards }
      delete nextCards[cardId]
      return nextCards
    })
    setAnnouncement(`Card deleted. ${countLabel(cards.length - 1)} in deck.`)
  }

  return (
    <section className={styles.flashcards} aria-labelledby="flashcards-heading">
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.overline}>Practice deck</p>
          <h2 id="flashcards-heading">Flashcards</h2>
          <p>Add a question and answer, then flip a card to study your recall.</p>
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
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Question"
          />
        </label>

        <label className={styles.field}>
          <span>Answer</span>
          <input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Answer"
          />
        </label>

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
          <span className={styles.emptyIcon}>Q/A</span>
          <p>Your saved cards will appear here.</p>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {cards.map((card) => {
            const isFlipped = Boolean(flippedCards[card.id])

            return (
              <article
                className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
                data-testid="flashcard"
                key={card.id}
              >
                <div className={styles.flipSurface}>
                  <div className={styles.cardFace} aria-hidden={isFlipped}>
                    <div className={styles.cardBody}>
                      <h3 className={styles.question}>{card.question}</h3>
                      <p className={styles.hiddenAnswer}>Answer hidden</p>
                    </div>
                  </div>

                  {/* The back stays mounted so the card shows it while turning
                      back; only the answer enters the page when flipped. */}
                  <div
                    className={`${styles.cardFace} ${styles.cardBack}`}
                    aria-hidden={!isFlipped}
                  >
                    <div className={styles.cardBody}>
                      <h3 className={styles.question}>{card.question}</h3>
                      {isFlipped && <p className={styles.answer}>{card.answer}</p>}
                    </div>
                  </div>
                </div>

                {/* One set of controls per card, outside the faces, so focus
                    never lands on a face that has turned away. */}
                <div className={styles.cardActions}>
                  <button
                    ref={(element) => {
                      if (element) flipButtons.current.set(card.id, element)
                      else flipButtons.current.delete(card.id)
                    }}
                    className={styles.secondaryButton}
                    type="button"
                    aria-pressed={isFlipped}
                    onClick={() => toggleCard(card.id)}
                  >
                    Flip
                  </button>
                  <button
                    className={styles.ghostButton}
                    type="button"
                    onClick={() => deleteCard(card.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
