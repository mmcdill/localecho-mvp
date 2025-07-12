// React imports
import { useEffect, useState } from 'react'

// Next.js imports
import { useRouter } from 'next/router'
import Link from 'next/link'

// Third-party library imports
import { motion } from 'framer-motion'
import Modal from 'react-modal'

// Internal API imports
import { getReviews } from '@/lib/api'
import { useUser } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

// Logo
import Image from 'next/image'

export default function Home() {
  const [reviews, setReviews] = useState<any[]>([])
  const [tone, setTone] = useState('Professional')
  const [businessName, setBusinessName] = useState('')
  const [customerReview, setCustomerReview] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedResponse, setEditedResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const user = useUser()
  const router = useRouter()
  const supabase = createPagesBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      const allReviews = await getReviews()
      const filtered = allReviews.filter((r) => r.user_id === user.id)
      setReviews(filtered)
    }
    fetchData()
  }, [user])

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
      const filtered = updatedReviews.filter((r) => r.user_id === user?.id)
      setReviews(filtered)
    } catch (error) {
      setErrorMessage('Oops, response failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!user?.id) {
      alert('User not authenticated')
      return
    }

    const response = await fetch('/api/add-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_name: businessName, customer_review: customerReview, tone, user_id: user.id })
    })

    if (response.ok) {
      alert('Review added! Refreshing...')
      const updatedReviews = await getReviews()
      const filtered = updatedReviews.filter((r) => r.user_id === user.id)
      setReviews(filtered)
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
      const filtered = updatedReviews.filter((r) => r.user_id === user?.id)
      setReviews(filtered)
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
    <div className="relative px-6 py-8 max-w-5xl mx-auto min-h-screen pb-20">
      <div className="text-center mb-6">
        <Image src="/LocalEcho Logo.png" alt="LocalEcho Logo" width={100} height={100} className="mx-auto" />
      </div>

      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-2xl font-bold mb-2">
        👋 Welcome to LocalEcho
      </motion.h1>
      <p className="mb-4">This is the MVP starting point for your AI-powered review response assistant.</p>

      <button onClick={() => setIsModalOpen(true)} className="mb-4 text-blue-600 underline">⚙️ Settings</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Settings Modal"
        className="bg-white p-6 max-w-lg mx-auto my-20 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-lg font-bold mb-2">Settings</h2>
        <p className="mb-4">(Coming soon!) Choose default tone, enable AI by default, etc.</p>
        <button onClick={() => setIsModalOpen(false)} className="text-blue-600 underline">Close</button>
      </Modal>

      <section className="my-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">➕ Add New Review</h2>
        <div className="flex flex-wrap gap-4">
          <input type="text" placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto" />
          <input type="text" placeholder="Customer Review" value={customerReview} onChange={(e) => setCustomerReview(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto" />
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="border px-3 py-2 rounded">
            <option value="Professional">Professional</option>
            <option value="Friendly">Friendly</option>
            <option value="Empathetic">Empathetic</option>
            <option value="Witty">Witty</option>
            <option value="Apologetic">Apologetic</option>
          </select>
          <button onClick={handleSubmitReview} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Review</button>
        </div>
      </section>

      <section className="mb-6">
        <label htmlFor="search" className="font-medium">🔍 Search Reviews:</label>
        <input id="search" type="text" placeholder="Search by business or review..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="ml-2 border px-3 py-2 rounded w-full md:w-auto" />
      </section>

      {isLoading && <p>⏳ Loading...</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">📋 Reviews:</h2>
        {filteredReviews.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-6xl">📭</p>
            <strong>No reviews yet.</strong>
            <p>Add a review above and see AI magic happen ✨</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {filteredReviews.map((review, index) => (
              <li key={index} className="bg-white border p-6 rounded-xl shadow-md">
                <div className="mb-2">
                  <strong>{review.business_name}</strong> — <em>{review.customer_review}</em>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not available'}
                  {review.sentiment && <span className="ml-4"><strong>Sentiment:</strong> {review.sentiment}</span>}
                </div>
                {editingId === review.id ? (
                  <>
                    <textarea value={editedResponse} onChange={(e) => setEditedResponse(e.target.value)} className="w-full min-h-[80px] border px-3 py-2 rounded mt-2" />
                    <div className="mt-3 flex gap-3">
                      <button onClick={() => handleSaveEditedResponse(review.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">💾 Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-600">❌ Cancel</button>
                    </div>
                  </>
                ) : (
                  review.generated_response && (
                    <>
                      <p className="mt-2"><strong>AI Response:</strong> {review.generated_response}</p>
                      <button onClick={() => { setEditingId(review.id); setEditedResponse(review.generated_response || '') }} className="mt-2 text-blue-600 underline">✏️ Edit</button>
                    </>
                  )
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => handleGenerateResponse(review.id, review.business_name, review.customer_review)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">⚡ Generate</button>
                  <button onClick={() => handleDeleteReview(review.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">🗑️ Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 text-center">
        <Link href="/insights" className="text-blue-600 underline">📊 View Insights</Link>
      </section>

      {user && (
        <div className="fixed bottom-4 left-4">
          <button onClick={handleLogout} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
            🚪 Log Out
          </button>
        </div>
      )}
    </div>
  )
}
