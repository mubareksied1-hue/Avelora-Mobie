import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './MovieDetails.css'

const MovieDetails = () => {
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadShow = async () => {
      setIsLoading(true)
      setShow(null)
      setError('')
  
      try {
        const response = await fetch(
          `https://api.tvmaze.com/shows/${encodeURIComponent(id)}`,
          { signal: controller.signal },
        )

        if (response.status === 404) {
          throw new Error('SHOW_NOT_FOUND')
        }
        if (!response.ok) {
          throw new Error(`TVMaze request failed with status ${response.status}`)
        }

        const showData = await response.json()
        if (!showData || typeof showData !== 'object' || !Number.isFinite(showData.id)) {
          throw new Error('TVMaze returned an invalid show response')
        }

        setShow(showData)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(
            loadError.message === 'SHOW_NOT_FOUND'
              ? 'This show could not be found.'
              : 'Unable to load this show right now. Please try again.',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadShow()

    return () => controller.abort()
  }, [id])

  if (isLoading) {
    return (
      <main className="movie-details-page">
        <div className="movie-details-page__container">
          <p className="movie-details-page__status" role="status">
            Loading show details...
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="movie-details-page">
        <div className="movie-details-page__container">
          <p className="movie-details-page__status" role="alert">{error}</p>
          <Link className="movie-details-page__back" to="/">
            <span aria-hidden="true">←</span> Back to Home
          </Link>
        </div>
      </main>
    )
  }

  if (!show) {
    return null
  }

  const rating = show.rating?.average
  const hasRating = typeof rating === 'number' && Number.isFinite(rating)
  const filledStars = hasRating ? Math.round(rating / 2) : 0
  const poster = show.image?.original || show.image?.medium
  const summaryDocument = new DOMParser().parseFromString(show.summary || '', 'text/html')
  summaryDocument.querySelectorAll('script, style').forEach((element) => element.remove())
  const summary = summaryDocument.body.textContent?.replace(/\s+/g, ' ').trim()
  const channel = show.network?.name || show.webChannel?.name
  const runtime = show.runtime ?? show.averageRuntime

  return (
    <main className="movie-details-page">
      <div className="movie-details-page__container">
        <Link className="movie-details-page__back" to="/">
          <span aria-hidden="true">←</span> Back to Home
        </Link>

        <article className="movie-details">
          <div className="movie-details__poster-wrap">
            {poster ? (
              <img className="movie-details__poster" src={poster} alt={`${show.name} poster`} />
            ) : (
              <div className="movie-details__poster-placeholder">
                No poster available
              </div>
            )}
          </div>

          <div className="movie-details__content">
            <p className="movie-details__eyebrow">Show details</p>
            <h1 className="movie-details__title">{show.name}</h1>
            <p className="movie-details__year">
              {show.premiered?.slice(0, 4) || 'Release year unavailable'}
            </p>

            {show.genres?.length > 0 && (
              <ul className="movie-details__genres" aria-label="Genres">
                {show.genres.map((genre) => (
                  <li className="movie-details__genre" key={genre}>{genre}</li>
                ))}
              </ul>
            )}

            <div className="movie-details__rating">
              <span
                className="movie-details__stars"
                role="img"
                aria-label={hasRating ? `${filledStars} out of 5 stars` : 'Not rated'}
              >
                {'★'.repeat(filledStars)}{'☆'.repeat(5 - filledStars)}
              </span>
              <span className="movie-details__rating-value">
                {hasRating ? `${rating.toFixed(1)} / 10` : 'Not rated'}
              </span>
            </div>

            <dl className="movie-details__facts">
              {show.status && (
                <div>
                  <dt>Status</dt>
                  <dd>{show.status}</dd>
                </div>
              )}
              {channel && (
                <div>
                  <dt>{show.network?.name ? 'Network' : 'Channel'}</dt>
                  <dd>{channel}</dd>
                </div>
              )}
              {runtime && (
                <div>
                  <dt>Runtime</dt>
                  <dd>{runtime} minutes</dd>
                </div>
              )}
            </dl>

            <section className="movie-details__story" aria-labelledby="story-title">
              <h2 id="story-title">The Story</h2>
              <p>{summary || 'No summary available.'}</p>
            </section>
          </div>
        </article>
      </div>
    </main>
  )
}

export default MovieDetails
