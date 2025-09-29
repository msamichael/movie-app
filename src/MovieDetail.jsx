import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


const API_BASE_URL = "https://api.themoviedb.org/3";

const API_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_ACCESS_TOKEN;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_ACCESS_TOKEN}`,
  },
};

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false)

  const fetchMovieDetails = async () => {


    try {
        const endpoint = `${API_BASE_URL}/movie/${id}?append_to_response=videos,images,credits`;
        const response = await fetch (endpoint, API_OPTIONS);
        
        if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      setMovie(data);

      


    } catch (error) {
     console.error(error)   
    }
  }

  
  useEffect(() => {

    fetchMovieDetails();
  }, []);
  if (!movie) return <p>Loading...</p>;

  // Trailer (YouTube)
  const trailer = movie.videos.results.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  // Background Image
  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '/no-movie.png';


 return (
  <div
    className="h-screen w-screen bg-cover bg-center relative"
    style={{ backgroundImage: `url(${backdropUrl})` }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>

    <div className="relative z-10 flex flex-col justify-between h-[70vh] p-8 max-w-5xl">
      {/* Movie Title */}
      <h1 className="text-5xl font-bold text-white mb-4 text-left mx-0">{movie.title}</h1>

      {/* Info Row */}
      <div className="flex items-center gap-3 text-white mb-4">
        <div className="flex items-center gap-1 ">
          <img className="w-4 h-4 object-contain" src="/star.svg" alt="Star Icon" />
          <p className="font-bold">{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
        </div>

        <span>•</span>
        <p className="capitalize font-medium">{movie.original_language}</p>

        <span>•</span>
        <p className="font-medium">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
      </div>

      {/* Genres */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {movie.genres.map((genre) => (
          <span
            key={genre.id}
            className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm"
          >
            {genre.name}
          </span>
        ))}
      </div>

      {/* Overview */}
      <p className="text-white mb-6 max-w-3xl">{movie.overview}</p>

      {/* Watch Trailer Button */}
      {!showTrailer && trailer && (
        <button
          onClick={() => setShowTrailer(true)}
          className="px-6 py-2 w-fit bg-white text-black font-semibold rounded shadow hover:bg-gray-100 transition"
        >
          ▶ Watch Trailer
        </button>
      )}

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              className="w-full h-full rounded"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>

            {/* Close button */}
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 text-white text-3xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

}

export default MovieDetail;



   