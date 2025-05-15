import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/initSupabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { business_name, customer_review, tone, user_id } = req.body

    const { data, error } = await supabase.from('reviews').insert([
      {
        business_name,
        customer_review,
        tone,
        user_id: user_id || 'demo-user', // fallback if user_id isn't provided
      },
    ])

    if (error) {
      console.error('Error inserting review:', error)
      return res.status(500).json({ error: 'Error adding review' })
    }

    return res.status(200).json(data)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
