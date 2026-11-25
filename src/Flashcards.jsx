import { useState } from 'react'
import styles from './Flashcards.module.css'

function countLabel(count) {
  return `${count} ${count === 1 ? 'card' : 'cards'}`
}

export default function Flashcards() {
  const [cards, setCards] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [flippedCards, setFlippedCards] = useState({})
  // Read out by screen readers after each add or delete (role="status").
  const [announcement, setAnnouncement] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedQuestion = question.trim()
    const trimmedAnswer = answer.trim()

    if (!trimmedQuestion || !trimmedAnswer) return

    const newCard = {
      id: `${Date.now()}-${trimmedQuestion}`,
      question: trimmedQuestion,
      answer: trimmedAnswer,
    }

    setCards((currentCards) => [newCard, ...currentCards])
    setQuestion('')
    setAnswer('')
    setAnnouncement(`Card added. ${countLabel(cards.length + 1)} in deck.`)
  }

  function toggleCard(cardId) {
    setFlippedCards((currentCards) => ({
      ...currentCards,
      [cardId]: !currentCards[cardId],
    }))
  }

  function deleteCard(cardId) {
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
