import { useEffect, useState } from 'react'
import { getReviews } from '@/lib/api'
import Link from 'next/link'

type Review = {
  id: number
  business_name: string
  customer_review: string
  generated_response: string | null
  tone: string | null
  sentiment: string | null
  created_at: string
}

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [toneCounts, setToneCounts] = useState<Record<string, number>>({})
  const [sentimentCounts, setSentimentCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchData = async () => {
      const data = await getReviews()
      setReviews(data)

      const tones: Record<string, number> = {}
      const sentiments: Record<string, number> = {}

      data.forEach((r) => {
        const tone = r.tone || 'Unknown'
        tones[tone] = (tones[tone] || 0) + 1

        const sentiment = r.sentiment || 'Unknown'
        sentiments[sentiment] = (sentiments[sentiment] || 0) + 1
      })

      setToneCounts(tones)
      setSentimentCounts(sentiments)
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📊 Insights Dashboard</h1>
      <p>This dashboard shows analytics on your submitted reviews.</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>🗣️ Tone Distribution</h2>
        <ul>
          {Object.entries(toneCounts).map(([tone, count]) => (
            <li key={tone}>
              {tone}: <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>🧠 Sentiment Analysis</h2>
        <ul>
          {Object.entries(sentimentCounts).map(([sentiment, count]) => (
            <li key={sentiment}>
              {sentiment}: <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/" style={{ color: '#0070f3' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
