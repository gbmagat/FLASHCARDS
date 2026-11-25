import { useState } from 'react'
import styles from './Flashcards.module.css'

export default function Flashcards() {
  const [cards, setCards] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [flippedCards, setFlippedCards] = useState({})

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
  }

  return (
    <section className={styles.flashcards} aria-labelledby="flashcards-heading">
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.overline}>Practice deck</p>
          <h2 id="flashcards-heading">Flashcards</h2>
          <p>Add a question and answer, then flip a card to study your recall.</p>
        </div>

        <div className={styles.deckCount} aria-label={`${cards.length} cards in deck`}>
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
                  <div
                    className={styles.cardFace}
                    aria-hidden={isFlipped}
                  >
                    <div className={styles.cardBody}>
                      <p className={styles.question}>{card.question}</p>
                      <p className={styles.hiddenAnswer}>Answer hidden</p>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        className={styles.secondaryButton}
                        type="button"
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
                  </div>

                  {isFlipped && (
                    <div className={`${styles.cardFace} ${styles.cardBack}`}>
                      <div className={styles.cardBody}>
                        <p className={styles.question}>{card.question}</p>
                        <p className={styles.answer}>{card.answer}</p>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          className={styles.secondaryButton}
                          type="button"
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
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
