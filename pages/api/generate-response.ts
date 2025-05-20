import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { reviewId, business_name, customer_review, tone } = req.body

  if (!reviewId || !business_name || !customer_review || !tone) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const prompt = `
You are an assistant helping businesses respond to customer reviews.
Tone: ${tone}
Business: ${business_name}
Review: ${customer_review}

First, write an appropriate response in the given tone.
Then, classify the sentiment of the customer's review as "positive", "neutral", or "negative".

Respond in this JSON format:
{
  "response": "<the response text>",
  "sentiment": "<positive|neutral|negative>"
}
`

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4'
    })

    const jsonResponse = completion.choices[0].message.content
    console.log('🔍 Raw OpenAI response:', jsonResponse)

    const parsed = JSON.parse(jsonResponse ?? '{}')
    const { response, sentiment } = parsed

    const { error } = await supabase
      .from('reviews')
      .update({ generated_response: response, sentiment })
      .eq('id', reviewId)

    if (error) {
      console.error('Supabase update error:', error.message)
      return res.status(500).json({ error: 'Failed to save AI response' })
    }

    return res.status(200).json({ success: true, generated_response: response, sentiment })
  } catch (error: any) {
    console.error('OpenAI error:', error.message)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
