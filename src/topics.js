// The lessons shown in the docs reader: one entry per topic in the nav.
export const topics = [
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
