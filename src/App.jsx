import { useState } from 'react'
import Flashcards from './Flashcards.jsx'
import { topics } from './topics.js'
import styles from './App.module.css'

export default function App() {
  const [activeTopic, setActiveTopic] = useState(topics[0].id)
  const currentTopic = topics.find((topic) => topic.id === activeTopic) ?? topics[0]

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brandGroup}>
          <span className={styles.brandMark}>M3</span>
          <div>
            <p className={styles.overline}>FLASHCARDS</p>
            <h1>Course Companion</h1>
          </div>
        </div>

      </header>

      <main className={styles.workspace}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <p className={styles.overline}>Course reader</p>
            <h2>React basics</h2>
          </div>

          <nav className={styles.topicNav} aria-label="Course topics">
            {topics.map((topic, index) => {
              const isActive = topic.id === currentTopic.id

              return (
                <button
                  className={`${styles.topicButton} ${isActive ? styles.activeTopic : ''}`}
                  type="button"
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  aria-pressed={isActive}
                >
                  <span className={styles.topicNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.topicText}>
                    <span>{topic.nav}</span>
                    <small>{topic.label}</small>
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        <div className={styles.contentStack}>
          <section
            className={styles.readerPanel}
            aria-labelledby="reader-heading"
            key={currentTopic.id}
          >
            <div className={styles.readerHeader}>
              <div>
                <p className={styles.overline}>Selected lesson</p>
                <h2 id="reader-heading">{currentTopic.title}</h2>
              </div>
              <span className={styles.readTime}>{currentTopic.time}</span>
            </div>

            <p className={styles.summary}>{currentTopic.summary}</p>

            <ul className={styles.lessonPoints}>
              {currentTopic.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <Flashcards />
        </div>
      </main>
    </div>
  )
}
