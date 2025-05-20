import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createServerSupabaseClient({ req, res })

  const { reviewId } = req.body

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId)

  if (error) {
    return res.status(500).json({ error: 'Failed to delete review' })
  }

  return res.status(200).json({ success: true })
}
