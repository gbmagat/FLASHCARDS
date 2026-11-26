// One starter card per lesson in topics.js, offered on an empty deck so a
// first-time visitor can try flipping cards straight away.
export const sampleCards = [
  {
    question: 'What does React keep in sync for you?',
    answer: 'The page and your data: you describe the UI for the current data, and React updates the page when the data changes.',
  },
  {
    question: 'How does React decide what to change on the page?',
    answer: 'It compares the newest virtual DOM with the previous one and updates only the parts of the real page that differ.',
  },
  {
    question: 'What are props?',
    answer: 'Values passed into a component, so the same component can show different content in different places.',
  },
  {
    question: 'What does useState return?',
    answer: 'The current value and a function that updates it.',
  },
]
