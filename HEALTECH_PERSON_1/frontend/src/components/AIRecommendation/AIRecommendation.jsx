import './AIRecommendation.css'

const AIRecommendation = ({ suggestion }) => {
  if (!suggestion) return null
  const { possibleConditions = [], recommendedSpecialization, urgency, generalAdvice } = suggestion
  return (
    <div className={`ai-rec ai-rec-${urgency || 'low'}`}>
      <h4>AI Suggestion</h4>
      {recommendedSpecialization && <p><strong>Specialization:</strong> {recommendedSpecialization}</p>}
      {possibleConditions.length > 0 && (
        <p><strong>Possible conditions:</strong> {possibleConditions.join(', ')}</p>
      )}
      {urgency && <p className="ai-rec-urgency">Urgency: {urgency}</p>}
      {generalAdvice && <p>{generalAdvice}</p>}
    </div>
  )
}

export default AIRecommendation
