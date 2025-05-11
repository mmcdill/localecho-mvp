// pages/api/delete-review.ts

import { supabase } from '@/lib/supabaseClient'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { reviewId } = req.body

  if (!reviewId) {
    return res.status(400).json({ error: 'Missing review ID' })
  }

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId)

  if (error) {
    console.error('Error deleting review:', error)
    return res.status(500).json({ error: 'Failed to delete review' })
  }

  return res.status(200).json({ message: 'Review deleted successfully' })
}
