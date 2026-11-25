import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App.jsx'

function topicNav() {
  return screen.getByRole('navigation', { name: 'Course topics' })
}

describe('docs reader', () => {
  it('lists the four course topics in a navigation landmark', () => {
    render(<App />)
    expect(within(topicNav()).getAllByRole('button')).toHaveLength(4)
  })

  it('opens on the first topic', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: 'What is React?' })).toBeInTheDocument()
    expect(within(topicNav()).getByRole('button', { name: /React/, pressed: true })).toBeInTheDocument()
  })

  it('shows the topic you select and marks only its button as pressed', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(within(topicNav()).getByRole('button', { name: /Virtual DOM/ }))

    expect(screen.getByRole('heading', { level: 2, name: 'The Virtual DOM' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'What is React?' })).not.toBeInTheDocument()
    const pressed = within(topicNav()).getAllByRole('button', { pressed: true })
    expect(pressed).toHaveLength(1)
    expect(pressed[0]).toHaveTextContent('Virtual DOM')
  })

  it('includes the flashcard deck', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: 'Flashcards' })).toBeInTheDocument()
  })
})
