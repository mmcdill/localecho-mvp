import { useEffect, useState } from 'react'
import { getReviews } from '@/lib/api'

type Review = {
  id: number
  user_id: string
  business_name: string
  customer_review: string
  generated_response: string
  created_at: string
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getReviews()
      setReviews(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        👋 Welcome to LocalEcho
      </h1>
      <p style={{ fontSize: '1.2rem' }}>
        This is the MVP starting point for your AI-powered review response assistant.
      </p>
      <h2 style={{ marginTop: '2rem' }}>📋 Reviews:</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: '1rem' }}>
              <strong>{review.business_name}</strong> — <em>{review.customer_review}</em>
              <br />
              <small>{new Date(review.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
