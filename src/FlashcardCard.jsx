import styles from './Flashcards.module.css'

// One card: the question on the front, the answer on the back, and a single
// set of controls outside the faces, so keyboard focus never lands on a face
// that has turned away.
export default function FlashcardCard({ card, isFlipped, onFlip, onDelete, flipButtonRef }) {
  return (
    <article
      className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
      data-testid="flashcard"
    >
      <div className={styles.flipSurface}>
        <div className={styles.cardFace} aria-hidden={isFlipped}>
          <div className={styles.cardBody}>
            <h3 className={styles.question}>{card.question}</h3>
            <p className={styles.hiddenAnswer}>Answer hidden</p>
          </div>
        </div>

        {/* The back stays mounted so the card shows it while turning back;
            only the answer enters the page when the card is flipped. */}
        <div className={`${styles.cardFace} ${styles.cardBack}`} aria-hidden={!isFlipped}>
          <div className={styles.cardBody}>
            <h3 className={styles.question}>{card.question}</h3>
            {isFlipped && <p className={styles.answer}>{card.answer}</p>}
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button
          ref={flipButtonRef}
          className={styles.secondaryButton}
          type="button"
          aria-pressed={isFlipped}
          onClick={onFlip}
        >
          Flip
        </button>
        <button className={styles.ghostButton} type="button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  )
}
