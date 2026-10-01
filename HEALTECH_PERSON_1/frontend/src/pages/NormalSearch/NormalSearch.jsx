import { useState } from 'react'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import HospitalList from '../../components/HospitalList/HospitalList.jsx'
import AIRecommendation from '../../components/AIRecommendation/AIRecommendation.jsx'
import { searchHospitals } from '../../services/hospitalService.js'
import { getSymptomSuggestions } from '../../services/aiService.js'
import { getCurrentPosition } from '../../services/mapService.js'
import './NormalSearch.css'

const NormalSearch = () => {
  const [hospitals, setHospitals] = useState([])
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (query) => {
    setLoading(true)
    setSearched(true)
    try {
      let coords = null
      try { coords = await getCurrentPosition() } catch { /* location optional */ }

      const [hospitalResults, aiResult] = await Promise.all([
        searchHospitals(query, coords?.lat, coords?.lng),
        getSymptomSuggestions(query).catch(() => null)
      ])
      setHospitals(hospitalResults)
      setSuggestion(aiResult)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container normal-search">
      <h2>Find care</h2>
      <SearchBar onSearch={handleSearch} />
      <AIRecommendation suggestion={suggestion} />
      {searched && <HospitalList hospitals={hospitals} loading={loading} />}
    </div>
  )
}

export default NormalSearch
