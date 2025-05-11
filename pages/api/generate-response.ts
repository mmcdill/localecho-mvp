// pages/api/generate-response.ts
import { openai } from '@/lib/openai'
import { supabase } from '@/lib/supabaseClient'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { reviewId, business_name, customer_review, tone } = req.body

  if (!reviewId || !business_name || !customer_review || !tone) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // 1. Generate AI response
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an assistant that writes ${tone.toLowerCase()} responses to customer reviews for a business.`,
        },
        {
          role: 'user',
          content: `Write a ${tone.toLowerCase()} response to this customer review for ${business_name}: "${customer_review}"`,
        },
      ],
      model: 'gpt-4',
    })

    const aiResponse = completion.choices[0]?.message?.content?.trim()

    if (!aiResponse) {
      return res.status(500).json({ error: 'Failed to generate AI response' })
    }

    // 2. Generate Sentiment
    const sentimentCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analysis assistant. Only respond with one word: Positive, Neutral, or Negative.`,
        },
        {
          role: 'user',
          content: `Analyze the following customer review and classify its sentiment: "${customer_review}"`,
        },
      ],
      model: 'gpt-4',
    })

    const sentiment = sentimentCompletion.choices[0]?.message?.content?.trim()

    // 3. Save both AI response and sentiment to Supabase
    const { error } = await supabase
      .from('reviews')
      .update({ generated_response: aiResponse, sentiment: sentiment })
      .eq('id', reviewId)

    if (error) {
      console.error('Supabase update error:', error)
      return res.status(500).json({ error: 'Failed to save response to database' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}
