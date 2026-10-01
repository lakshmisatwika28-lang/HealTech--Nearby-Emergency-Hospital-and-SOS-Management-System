import axios from 'axios'
import { ENV } from '../config/env.js'

const XAI_URL = 'https://api.x.ai/v1/responses'

const callGrok = async (systemPrompt, messages) => {
  console.log('🔥 CALLING GROK API')
  console.log('📨 Messages:', messages)

  const input = [
    {
      role: 'system',
      content: systemPrompt
    },
    ...messages
  ]

  try {
    const { data } = await axios.post(
      XAI_URL,
      {
        model: 'grok-4.7',
        input
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.XAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('✅ GROK RESPONSE RECEIVED')

    return data.output_text || ''
  } catch (error) {
    console.error(
      '❌ GROK API ERROR:',
      error.response?.data || error.message
    )

    throw new Error('Failed to get response from Grok')
  }
}

export const getSymptomSuggestions = async (symptomText) => {
  const system = `You are a medical triage assistant for a healthcare app called HEALTECH.

Given the user's symptoms, respond ONLY with valid JSON, with no markdown fences and no preamble.

Use exactly this structure:
{
  "possibleConditions": ["..."],
  "recommendedSpecialization": "...",
  "urgency": "low|medium|high",
  "generalAdvice": "..."
}

Do not claim that the user definitely has a particular disease.
Provide general health information only.
If symptoms could indicate an emergency, set urgency to "high" and advise the user to seek immediate professional medical help.`

  const raw = await callGrok(system, [
    {
      role: 'user',
      content: symptomText
    }
  ])

  const clean = raw.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    return {
      possibleConditions: [],
      recommendedSpecialization: null,
      urgency: 'low',
      generalAdvice: raw
    }
  }
}

export const getHealthBuddyResponse = async (message, history = []) => {
  console.log('🔥 GROK HEALTH BUDDY CALLED')
  console.log('MESSAGE:', message)
  console.log('HISTORY:', history)

  const system = `You are AI Health Buddy inside the HEALTECH healthcare app.

Your job is to provide clear, helpful and personalized general health guidance based on the information the user provides.

IMPORTANT:
- Pay close attention to EVERY symptom, duration, and relevant detail mentioned by the user.
- Do not ignore symptoms simply because another symptom is more common.
- Use the conversation history to understand the user's situation.
- Ask relevant follow-up questions when important information is missing.
- Do not claim to diagnose the user with certainty.
- Explain possible causes or possibilities in general terms.
- Suggest an appropriate medical specialization when relevant.
- If symptoms may be serious or urgent, clearly recommend prompt professional medical care.
- Do not recommend changing prescription medicines or dosages without a qualified healthcare professional.
- Do not ask for unnecessary sensitive personal information.
- Do not pretend to be a doctor.
- Keep responses clear and reasonably concise.
- If the user provides multiple symptoms, address the important symptoms individually rather than responding only to one of them.
- If the situation sounds like an emergency, prioritize immediate professional medical assistance.`

  const messages = [
    ...history
      .filter(
        (h) =>
          h &&
          (h.role === 'user' || h.role === 'assistant') &&
          h.content
      )
      .map((h) => ({
        role: h.role,
        content: h.content
      })),
    {
      role: 'user',
      content: message
    }
  ]

  return callGrok(system, messages)
}