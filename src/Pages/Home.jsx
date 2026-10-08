import { useEffect, useRef, useState } from 'react'
import Navbar from '../Components/Navbar.jsx'
import MovieCard from '../Components/MovieCard.jsx'

const normalizeGenre = (genre) => genre.toLowerCase().replace(/[^a-z0-9]/g, '')

const matchesGenre = (show, selectedGenre) => (
  !selectedGenre || show.genres?.some(
    (genre) => normalizeGenre(genre) === normalizeGenre(selectedGenre),
  )
)

const filterShowsByGenre = (shows, selectedGenre) => (
  shows.filter((show) => matchesGenre(show, selectedGenre))
)

const Home = ({
  theme,
  themeMode,
  schedule,
  onToggleTheme,
  onThemeModeChange,
  onScheduleChange,
}) => {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const abortControllerRef = useRef(null)
  const visibleResults = filterShowsByGenre(results, selectedGenre)

  useEffect(() => {
    const controller = new AbortController()
    abortControllerRef.current = controller

    const loadInitialShows = async () => {
      setError('')

      try {
        const response = await fetch(
          'https://api.tvmaze.com/shows?page=0',
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`TVMaze request failed with status ${response.status}`)
        }

        const shows = await response.json()
        if (!Array.isArray(shows)) {
          throw new Error('TVMaze returned an invalid shows response')
        }

        setResults(shows.slice(0, 12))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setResults([])
          setError('Unable to load shows right now. Please try again.')
        }
      } finally {
        if (abortControllerRef.current === controller) {
          setIsLoading(false)
        }
      }
    }

    loadInitialShows()

    return () => controller.abort()
  }, [])

  const handleSearch = async (query, genre, options = {}) => {
    if (options.filterOnly) {
      setSelectedGenre(genre)
      return
    }

    abortControllerRef.current?.abort()
    setSearchQuery(query)
    setSelectedGenre(genre)

    if (!query) {
      setResults([])
      setIsLoading(false)
      setError('Enter a title to search for shows.')
      return
    }

    const controller = new AbortController()
    abortControllerRef.current = controller
    setResults([])
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
        { signal: controller.signal },
      )

      if (!response.ok) {
        throw new Error(`TVMaze request failed with status ${response.status}`)
      }

      const searchResults = await response.json()
      if (!Array.isArray(searchResults)) {
        throw new Error('TVMaze returned an invalid search response')
      }

      const shows = searchResults
        .map(({ show }) => show)
        .filter(Boolean)

      setResults(shows)
    } catch (searchError) {
      if (searchError.name !== 'AbortError') {
        setResults([])
        setError('Unable to load shows right now. Please try again.')
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="home">
      <Navbar
        onSearch={handleSearch}
        theme={theme}
        themeMode={themeMode}
        schedule={schedule}
        onToggleTheme={onToggleTheme}
        onThemeModeChange={onThemeModeChange}
        onScheduleChange={onScheduleChange}
      />
      <main className="home__main" aria-label="TV show gallery">
        {isLoading ? (
          <p className="home__status" role="status">
            {searchQuery ? `Searching for “${searchQuery}”...` : 'Loading shows...'}
          </p>
        ) : error ? (
          <p className="home__status" role="alert">{error}</p>
        ) : visibleResults.length > 0 ? (
          <>
            {searchQuery && (
              <p className="home__status" role="status">
                {visibleResults.length} shows found for “{searchQuery}”.
              </p>
            )}
            <section className="home__movie-grid" aria-label="Shows">
              {visibleResults.map((show) => (
                <MovieCard key={show.id} show={show} />
              ))}
            </section>
          </>
        ) : (
          <p className="home__status">
            {searchQuery
              ? `No shows found for “${searchQuery}” with that genre.`
              : 'No shows found with that genre.'}
          </p>
        )}
      </main>
    </div>
  )
}

export default Home
