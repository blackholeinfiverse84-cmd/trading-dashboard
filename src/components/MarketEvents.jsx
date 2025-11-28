import React, { useEffect, useRef, useState } from 'react'
import Card from './common/Card'
import { useToast } from '../contexts/ToastContext'
import './MarketEvents.css'

const mockEvents = [
  {
    time: '10:00 AM',
    title: 'Fed Chair speech',
    detail: 'Monitor USDINR & PSU banks for volatility spike.',
    type: 'macro',
  },
  {
    time: '12:30 PM',
    title: 'Reliance earnings call',
    detail: 'Desk expects commentary on capex guidance.',
    type: 'earnings',
  },
  {
    time: '02:00 PM',
    title: 'Krishna model refresh',
    detail: 'New predictions drop at 14:00 with updated sentiment.',
    type: 'model',
  },
]

const MarketEvents = ({ events }) => {
  const { addToast } = useToast()
  const [eventList, setEventList] = useState(() => (events?.length ? events : mockEvents))
  const lastCountRef = useRef(eventList.length)
  const fallbackRef = useRef(false)

  useEffect(() => {
    if (events?.length) {
      setEventList(events)
      if (lastCountRef.current !== events.length) {
        lastCountRef.current = events.length
        fallbackRef.current = false
        addToast({
          title: 'Catalysts refreshed',
          message: `${events.length} event${events.length > 1 ? 's' : ''} queued for today.`,
          variant: 'success',
        })
      }
    } else {
      setEventList(mockEvents)
      lastCountRef.current = mockEvents.length
      if (!fallbackRef.current) {
        fallbackRef.current = true
        addToast({
          title: 'Events feed unavailable',
          message: 'Showing curated mock catalysts until the feed returns.',
          variant: 'warning',
          duration: 4000, // Shorter duration
        })
      }
    }
  }, [events, addToast])

  return (
    <Card
      title="Today’s catalysts"
      subtitle="Upcoming events that could move the book"
      className="events-card"
      padding="md"
    >
      <ul className="events-list">
        {eventList.map((event, index) => (
          <li key={`${event.title}-${index}`} className={`event-row event-${event.type}`}>
            <div className="event-time">{event.time}</div>
            <div>
              <p className="event-title">{event.title}</p>
              <p className="event-detail">{event.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default MarketEvents

