import api from './apiClient.js'

export const getSymptomSuggestions = (symptoms) =>
  api.post('/ai/suggest', { symptoms }).then((r) => r.data.data)

export const sendHealthBuddyMessage = (message, history) =>
  api.post('/ai/health-buddy', { message, history }).then((r) => r.data.data)
