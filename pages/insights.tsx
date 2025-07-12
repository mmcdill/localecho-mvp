import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getReviews } from '@/lib/api'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import Image from 'next/image'

export default function Insights() {
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      const supabase = createPagesBrowserClient<Database>()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (!user || authError) {
        router.push('/auth')
        return
      }

      setUserId(user.id)
      const allReviews = await getReviews()
      const userReviews = allReviews.filter((r) => r.user_id === user.id)
      setReviews(userReviews)
    }

    fetchReviews()
  }, [])

  const handleLogout = async () => {
    const supabase = createPagesBrowserClient()
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const total = reviews.length
  const withResponse = reviews.filter((r) => r.generated_response).length

  const sentiments = ['positive', 'neutral', 'negative']
  const chartData = sentiments.map((s) => ({
    sentiment: s,
    count: reviews.filter((r) => r.sentiment === s).length,
  }))

  return (
    <div className="relative bg-gray-50 min-h-screen py-10 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <Image
          src="/LocalEcho Logo.png"
          alt="LocalEcho Logo"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold">📊 Insights</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-4 max-w-4xl mx-auto">
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

      <div className="bg-white rounded-xl shadow p-6 mx-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Sentiment Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="sentiment" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="fixed bottom-4 left-4">
        <button
          onClick={handleLogout}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  )
}
