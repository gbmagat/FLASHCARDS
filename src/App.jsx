import { useState } from 'react'
import Flashcards from './Flashcards.jsx'
import styles from './App.module.css'

const topics = [
  {
    id: 'react',
    nav: 'React',
    title: 'What is React?',
    label: 'UI foundations',
    time: '4 min',
    summary:
      'React is a JavaScript library for building interfaces from reusable components. You describe what the screen should show for your data, and React keeps the page in sync as that data changes.',
    points: [
      'Components split a screen into small pieces that are easier to understand.',
      'State stores information that can change while someone uses the app.',
      'React updates the interface when state changes, so the UI stays consistent.',
    ],
  },
  {
    id: 'dom',
    nav: 'Virtual DOM',
    title: 'The Virtual DOM',
    label: 'Rendering model',
    time: '3 min',
    summary:
      "The virtual DOM is React's lightweight description of the page. React compares the newest description with the previous one, then updates only the parts of the real page that need to change.",
    points: [
      'JSX creates a tree of elements that React can compare quickly.',
      'Small updates help complex pages feel fast and predictable.',
      'You focus on data and layout while React handles most DOM updates.',
    ],
  },
  {
    id: 'components',
    nav: 'Components',
    title: 'Components and Props',
    label: 'Reusable UI',
    time: '5 min',
    summary:
      'Components are reusable functions that return UI. Props are the values you pass into a component so the same component can show different content in different places.',
    points: [
      'Good components have a clear job and readable names.',
      'Props keep shared UI flexible without copying the same markup.',
      'Breaking a page into components makes styling and testing easier.',
    ],
  },
  {
    id: 'state',
    nav: 'State',
    title: 'State and Hooks',
    label: 'Interactivity',
    time: '6 min',
    summary:
      'State lets a component remember changing information, such as the selected topic or the cards in your study deck. Hooks such as useState give function components that memory.',
    points: [
      'Controlled inputs store form values in state as the user types.',
      'Arrays of objects are useful for dynamic lists like flashcards.',
      'Conditional rendering shows different UI based on the current state.',
    ],
  },
]

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
