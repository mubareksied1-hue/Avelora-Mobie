import { Link } from 'react-router-dom'
import './MovieCard.css'

const MovieCard = ({ show }) => {
  const rating = show.rating?.average
  const hasRating = typeof rating === 'number' && Number.isFinite(rating)
  const filledStars = hasRating ? Math.round(rating / 2) : 0
  const summary = show.summary ?.replace(/<[^>]*>/g, ' ') .replace(/\s+/g, ' ') .trim()
  const poster = show.image?.original || show.image?.medium

  return (
    <Link className="movie-card"to={`/movies/${show.id}`} aria-label={`View details for ${show.name}`}>
      <div className="movie-card__visual">
        {poster ? (
          <img className="movie-card__poster" src={poster}   alt={`${show.name} poster`} loading="lazy"/>
        ) : (
          <div className="movie-card__poster-placeholder" aria-label="No poster available">
            No poster available
          </div>
        )}
        <div className="movie-card__poster-shade" aria-hidden="true" />
      </div>

      <div className="movie-card__content">
        <div className="movie-card__heading">
          <div>
            <h2 className="movie-card__title">{show.name}</h2>
            <p className="movie-card__year">
              {show.premiered?.slice(0, 4) || 'Release year unavailable'}
            </p>
          </div>
          <div className="movie-card__rating">
            <span
              className="movie-card__stars"
              role="img"
              aria-label={hasRating ? `${filledStars} out of 5 stars` : 'Not rated'}
            >
              {'★'.repeat(filledStars)}{'☆'.repeat(5 - filledStars)}
            </span>
            <span className="movie-card__rating-value">
              {hasRating ? rating.toFixed(1) : 'Not rated'}
            </span>
          </div>
        </div>

        {show.genres?.length > 0 && (
          <ul className="movie-card__genres" aria-label="Genres">
            {show.genres.map((genre) => (
              <li className="movie-card__genre" key={genre}>{genre}</li>
            ))}
          </ul>
        )}

        <p className="movie-card__summary">
          {summary || 'No summary available.'}
        </p>

        <span className="movie-card__details">
          View Details
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}

export default MovieCard
