import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { business_name, customer_review, tone } = req.body

  const { error: insertError } = await supabase.from('reviews').insert({
    user_id: user.id,
    business_name,
    customer_review,
    tone
  })

  if (insertError) {
    return res.status(500).json({ error: insertError.message })
  }

  return res.status(200).json({ message: 'Review added successfully' })
}
