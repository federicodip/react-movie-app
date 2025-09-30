import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import "../css/Details.css";

export default function Details() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="details loading">Loading…</div>;
  if (error) return <div className="details error">{error}</div>;
  if (!movie) return null;

  const favorite = isFavorite(movie.id);

  const toggleFavorite = () => {
    if (favorite) removeFromFavorites(movie.id);
    else
      addToFavorites({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
      });
  };

  return (
    <div className="details">
      <div className="details-header">
        <Link to="/" className="back">
          &larr; Back
        </Link>
        <button
          className={`favorite ${favorite ? "active" : ""}`}
          onClick={toggleFavorite}
        >
          {favorite ? "♥ Favorited" : "♡ Add to Favorites"}
        </button>
      </div>

      <div className="details-content">
        {movie.poster_path && (
          <img
            className="details-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        )}

        <div className="details-info">
          <h1>{movie.title}</h1>
          <p className="muted">
            {movie.release_date?.split("-")[0]} •{" "}
            {movie.runtime ? `${movie.runtime} min` : "—"} •{" "}
            {movie.vote_average
              ? `★ ${movie.vote_average.toFixed(1)}`
              : "No rating"}
          </p>

          {movie.genres?.length ? (
            <p className="genres">
              {movie.genres.map((g) => g.name).join(" • ")}
            </p>
          ) : null}

          {movie.overview ? <p className="overview">{movie.overview}</p> : null}

          <a
            className="trailer"
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
              movie.title + " trailer"
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Watch trailer on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
