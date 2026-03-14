import { useEffect, useMemo, useRef, useState } from 'react'
import './LiveFeed.css'

const initialUpdates = [
  {
    id: 1,
    time: 'now',
    message: 'Mission started. Monitoring security telemetry across branches.',
  },
  {
    id: 2,
    time: '2m ago',
    message: 'New campaign launched: "Quarterly phishing test".',
  },
]

export default function LiveFeed() {
  const [updates, setUpdates] = useState(initialUpdates)
  const counterRef = useRef(3)

  const addFakeUpdate = () => {
    const now = new Date()
    const newUpdate = {
      id: counterRef.current++,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: `User ${['Ava', 'Sam', 'Jordan', 'Taylor'][
        Math.floor(Math.random() * 4)
      ]} detected a suspicious link in an email.`,
    }
    setUpdates((prev) => [newUpdate, ...prev].slice(0, 6))
  }

  useEffect(() => {
    const interval = setInterval(addFakeUpdate, 18000)
    return () => clearInterval(interval)
  }, [])

  const feedItems = useMemo(
    () =>
      updates.map((update) => (
        <li key={update.id} className="livefeed__item">
          <span className="livefeed__time">{update.time}</span>
          <span className="livefeed__message">{update.message}</span>
        </li>
      )),
    [updates],
  )

  return (
    <section className="livefeed">
      <header className="livefeed__header">
        <h3>Live mission timeline</h3>
      </header>
      <ul className="livefeed__list">{feedItems}</ul>
    </section>
  )
}
