import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './SearchBar.css'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [genre, setGenre] = useState('')
  const genres = [
    { label: 'All films', value: '' },
    { label: 'Action', value: 'action' },
    { label: 'Comedy', value: 'comedy' },
    { label: 'Drama', value: 'drama' },
    { label: 'Horror', value: 'horror' },
    { label: 'Romance', value: 'romance' },
    { label: 'Sci-Fi', value: 'science-fiction' },
  ]

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(searchTerm.trim(), genre)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__query">
        <label className="search-bar__label" htmlFor="movie-search">
          Discover your next favorite
        </label>
        <input
          className="search-bar__input"
          id="movie-search"
          type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search movies, stories, and more..."
        />
      </div>

      <button className="search-bar__button" type="submit">
        <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
      </button>

      <fieldset className="search-bar__filters">
        <legend className="search-bar__label">Explore by genre</legend>
        <div className="search-bar__chips">
          {genres.map(({ label, value }) => (
            <button
              key={value || 'all'}
              className={`search-bar__chip${genre === value ? ' is-active' : ''}`}
              type="button"
              aria-pressed={genre === value}
              onClick={() => {
                setGenre(value)
                onSearch(searchTerm.trim(), value, { filterOnly: true })
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
    </form>
  )
}

export default SearchBar
