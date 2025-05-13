import { useEffect, useState } from 'react'
import { getReviews } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Review {
  id: string
  sentiment: string
  ai_response: string | null
  created_at: string
}

export default function Insights() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviews()
      setReviews(data)
    }
    fetchReviews()
  }, [])

  const total = reviews.length
  const positive = reviews.filter(r => r.sentiment === 'Positive').length
  const neutral = reviews.filter(r => r.sentiment === 'Neutral').length
  const negative = reviews.filter(r => r.sentiment === 'Negative').length
  const withResponse = reviews.filter(r => r.ai_response).length

  const chartData = [
    { sentiment: 'Positive', count: positive },
    { sentiment: 'Neutral', count: neutral },
    { sentiment: 'Negative', count: negative },
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-center">📊 Insights</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="text-3xl font-semibold">{total}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-gray-500">Responses Generated</p>
            <p className="text-3xl font-semibold">
              {withResponse} ({total > 0 ? ((withResponse / total) * 100).toFixed(0) : 0}%)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Sentiment Breakdown</h2>
          <div className="w-full" style={{ height: 300 }}>
  <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="sentiment" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" /> {/* Tailwind indigo-600 */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
