// pages/api/add-review.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { user_id, business_name, customer_review, tone } = req.body

  if (!business_name || !customer_review || !tone) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const { error } = await supabase.from('reviews').insert([
    {
      user_id: user_id || 'testuser',
      business_name,
      customer_review,
      generated_response: null,
      tone
    }
  ])

  if (error) {
    console.error('Error inserting review:', error)
    return res.status(500).json({ message: 'Failed to insert review' })
  }

  return res.status(200).json({ message: 'Review added successfully' })
}