// React imports
import { useEffect, useState } from 'react'

// Next.js imports
import { useRouter } from 'next/router'
import Link from 'next/link'

// Third-party library imports
import { motion } from 'framer-motion'

// Internal API imports
import { getReviews } from '@/lib/api'

// Modal component for settings
import Modal from 'react-modal'

// Main Home component for the AI-powered review response assistant
export default function Home() {
  // State variables
  const [reviews, setReviews] = useState<any[]>([])
  const [tone, setTone] = useState('Professional')
  const [businessName, setBusinessName] = useState('')
  const [customerReview, setCustomerReview] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedResponse, setEditedResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const router = useRouter()

  // Fetch all reviews on component mount
  useEffect(() => {
    const fetchData = async () => {
      const allReviews = await getReviews()
      setReviews(allReviews)
    }
    fetchData()
  }, [])

  const handleGenerateResponse = async (reviewId: number, business_name: string, customer_review: string) => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, business_name, customer_review, tone })
      })
      if (!response.ok) throw new Error('Failed to generate response')
      alert('AI response generated!')
      const updatedReviews = await getReviews()
      setReviews(updatedReviews)
    } catch (error) {
      setErrorMessage('Oops, response failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    const response = await fetch('/api/add-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_name: businessName, customer_review: customerReview, tone })
    })
    if (response.ok) {
      alert('Review added! Refreshing...')
      const updatedReviews = await getReviews()
      setReviews(updatedReviews)
      setBusinessName('')
      setCustomerReview('')
    } else {
      alert('Error submitting review')
    }
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    const response = await fetch('/api/delete-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId })
    })
    if (response.ok) {
      alert('Review deleted!')
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } else {
      alert('Error deleting review')
    }
  }

  const handleSaveEditedResponse = async (reviewId: number) => {
    if (!editedResponse.trim()) {
      alert('Please enter a valid response before saving.')
      return
    }
    setIsLoading(true)
    setErrorMessage('')
    try {
      const response = await fetch('/api/update-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, newResponse: editedResponse })
      })
      if (!response.ok) throw new Error('Failed to update response')
      alert('Response updated!')
      const updatedReviews = await getReviews()
      setReviews(updatedReviews)
      setEditingId(null)
      setEditedResponse('')
    } catch (error) {
      setErrorMessage('Oops, update failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReviews = reviews.filter(
    (review) =>
      review.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customer_review.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ padding: '2rem' }}>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        👋 Welcome to LocalEcho
      </motion.h1>
      <p>This is the MVP starting point for your AI-powered review response assistant.</p>

      <button onClick={() => setShowSettings(true)} style={{ margin: '1rem 0', padding: '0.5rem 1rem' }}>
        ⚙️ Settings
      </button>

      <Modal
        isOpen={showSettings}
        onRequestClose={() => setShowSettings(false)}
        contentLabel="Settings"
        style={{ content: { maxWidth: '400px', margin: 'auto' } }}
      >
        <h2>Settings</h2>
        <label htmlFor="default-tone">Default Tone:</label>
        <select
          id="default-tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
        >
          <option value="Professional">Professional</option>
          <option value="Friendly">Friendly</option>
          <option value="Empathetic">Empathetic</option>
          <option value="Witty">Witty</option>
          <option value="Apologetic">Apologetic</option>
        </select>
        <br />
        <button onClick={() => setShowSettings(false)}>Close</button>
      </Modal>

      <section style={{ margin: '2rem 0' }}>
        <h2>Add New Review</h2>
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <input
          type="text"
          placeholder="Customer Review"
          value={customerReview}
          onChange={(e) => setCustomerReview(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="Professional">Professional</option>
          <option value="Friendly">Friendly</option>
          <option value="Empathetic">Empathetic</option>
          <option value="Witty">Witty</option>
          <option value="Apologetic">Apologetic</option>
        </select>
        <button
          onClick={handleSubmitReview}
          style={{ backgroundColor: '#4CAF50', color: 'white', padding: '0.5rem 1rem' }}
        >
          Submit Review
        </button>
      </section>

      <section>
        <label htmlFor="search">🔍 Search Reviews:</label>
        <input
          id="search"
          type="text"
          placeholder="Search by business or review..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: '0.5rem', padding: '0.4rem' }}
        />
      </section>

      {isLoading && <p>⏳ Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <section style={{ marginTop: '2rem' }}>
        <h2>📋 Reviews:</h2>
        {filteredReviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <ul>
            {filteredReviews.map((review, index) => (
              <li key={index} style={{ marginBottom: '1.5rem' }}>
                <strong>{review.business_name}</strong> — <em>{review.customer_review}</em>
                <br />
                <small>
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Date not available'}
                </small>
                <br />
                {review.sentiment && (
                  <small><strong>Sentiment:</strong> {review.sentiment}</small>
                )}
                <br />
                {editingId === review.id ? (
                  <>
                    <textarea
                      value={editedResponse}
                      onChange={(e) => setEditedResponse(e.target.value)}
                      style={{ width: '100%', minHeight: '80px' }}
                    />
                    <button onClick={() => handleSaveEditedResponse(review.id)}>💾 Save</button>
                    <button onClick={() => setEditingId(null)}>❌ Cancel</button>
                  </>
                ) : (
                  review.generated_response && (
                    <>
                      <p><strong>AI Response:</strong> {review.generated_response}</p>
                      <button
                        onClick={() => {
                          setEditingId(review.id)
                          setEditedResponse(review.generated_response || '')
                        }}
                        style={{ marginRight: '0.5rem' }}
                      >
                        ✏️ Edit
                      </button>
                    </>
                  )
                )}
                <button
                  onClick={() => handleGenerateResponse(review.id, review.business_name, review.customer_review)}
                  style={{ marginRight: '0.5rem', padding: '0.3rem 0.7rem' }}
                >
                  Generate AI Response
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  style={{ backgroundColor: 'red', color: 'white', padding: '0.3rem 0.7rem' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <Link href="/insights">📊 View Insights</Link>
      </section>
    </div>
  )
}
