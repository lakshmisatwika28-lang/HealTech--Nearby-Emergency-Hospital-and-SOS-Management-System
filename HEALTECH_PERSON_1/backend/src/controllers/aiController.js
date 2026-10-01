import * as aiService from '../services/aiService.js'

export const suggestFromSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body
    if (!symptoms) return res.status(400).json({ success: false, message: 'symptoms is required' })
    const result = await aiService.getSymptomSuggestions(symptoms)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export const healthBuddyChat = async (req, res, next) => {
  try {
    const { message, history } = req.body
    if (!message) return res.status(400).json({ success: false, message: 'message is required' })
    const reply = await aiService.getHealthBuddyResponse(message, history)
    res.json({ success: true, data: { reply } })
  } catch (err) {
    next(err)
  }
}
