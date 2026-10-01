import { useState } from 'react'
import { sendHealthBuddyMessage } from '../../services/aiService.js'
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation.jsx'
import './AIHealthBuddy.css'

const AIHealthBuddy = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input.trim() }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)
    try {
      const { reply } = await sendHealthBuddyMessage(userMsg.content, messages)
      setMessages([...history, { role: 'assistant', content: reply }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container ai-buddy">
      <h2>AI Health Buddy</h2>
      <div className="ai-buddy-thread">
        {messages.map((m, i) => (
          <div key={i} className={`ai-buddy-msg ai-buddy-${m.role}`}>{m.content}</div>
        ))}
        {loading && <LoadingAnimation label="Thinking..." />}
      </div>
      <form className="ai-buddy-input" onSubmit={send}>
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe how you're feeling..."
        />
        <button className="btn-primary" disabled={loading}>Send</button>
      </form>
    </div>
  )
}

export default AIHealthBuddy
