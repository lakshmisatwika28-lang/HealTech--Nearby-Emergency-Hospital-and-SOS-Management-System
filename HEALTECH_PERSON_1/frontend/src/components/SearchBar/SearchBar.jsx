import { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ onSearch, placeholder = 'Search symptoms, diseases, specializations...' }) => {
  const [value, setValue] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form className="search-bar" onSubmit={submit}>
      <input
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit" className="btn-primary">Search</button>
    </form>
  )
}

export default SearchBar
