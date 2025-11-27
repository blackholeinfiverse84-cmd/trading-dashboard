import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import './Public.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    setLoading(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="public-page">
      <div className="public-container">
        <Card variant="elevated" className="public-card">
          <h1>Contact Us</h1>
          <p className="contact-intro">
            Have questions, feedback, or need support? We'd love to hear from you. 
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          {submitted && (
            <div className="contact-success">
              <span>✅</span>
              <span>Thank you! Your message has been sent. We'll respond soon.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <Input
              label="Your Name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              fullWidth
            />

            <Input
              label="Subject"
              type="text"
              placeholder="What is this regarding?"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              required
              fullWidth
            />

            <div className="input-wrapper input-wrapper-full-width">
              <label className="input-label">Message</label>
              <textarea
                className="input-textarea"
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={6}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>

          <div className="contact-info">
            <h3>Other Ways to Reach Us</h3>
            <div className="contact-methods">
              <div className="contact-method">
                <strong>Email:</strong>
                <span>support@tradingdashboard.com</span>
              </div>
              <div className="contact-method">
                <strong>Response Time:</strong>
                <span>Within 24 hours</span>
              </div>
            </div>
          </div>

          <div className="contact-cta">
            <p>New to the platform?</p>
            <Link to="/register">
              <Button variant="secondary">Create Free Account</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Contact

