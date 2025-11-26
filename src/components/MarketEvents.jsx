import React from 'react'
import Card from './common/Card'
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

const MarketEvents = ({ events = mockEvents }) => (
  <Card
    title="Today’s catalysts"
    subtitle="Upcoming events that could move the book"
    className="events-card"
    padding="md"
  >
    <ul className="events-list">
      {events.map((event, index) => (
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

export default MarketEvents

