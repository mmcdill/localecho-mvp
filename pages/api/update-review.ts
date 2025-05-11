import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('BODY RECEIVED:', req.body) // 👈 LOG THE INCOMING REQUEST BODY

  const { reviewId, newResponse } = req.body

  if (!reviewId || !newResponse) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { error } = await supabase
    .from('reviews')
    .update({ generated_response: newResponse })
    .eq('id', reviewId)

  if (error) {
    console.error('Supabase update error:', error) // 👈 optional extra logging
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ message: 'Response updated successfully' })
}
