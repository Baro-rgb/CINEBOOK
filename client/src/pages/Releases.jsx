import React, { useState } from 'react';
import { Film, Calendar, Clock, Bell, Play } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';

const ComingSoonCard = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <div className="group bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl shadow-xl overflow-hidden border border-zinc-800 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
      
      {/* Movie Poster / Trailer Section */}
      <div className="relative aspect-video bg-zinc-950 overflow-hidden">
        {showTrailer && movie.trailerUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={movie.trailerUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`Trailer for ${movie.title}`}
          />
        ) : (
          <>
            <img
              src={movie.poster || movie.image || 'https://placehold.co/800x450/09090B/FFFFFF?text=Coming+Soon'}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
            
            {/* Play Button Overlay */}
            {movie.trailerUrl && (
              <button
                onClick={() => setShowTrailer(true)}
                className="absolute inset-0 flex items-center justify-center group/play"
              >
                <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-primary">
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </div>
              </button>
            )}
          </>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight flex-1 pr-4">
            {movie.title}
          </h2>
          {movie.rating && (
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-sm font-semibold rounded-lg flex-shrink-0">
              {movie.rating}
            </span>
          )}
        </div>
        
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-zinc-400">
          {movie.genre && (
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-primary" />
              <span>{movie.genre}</span>
            </div>
          )}
          {movie.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{movie.duration} min</span>
            </div>
          )}
          {movie.releaseDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {movie.description || movie.synopsis || 'Exciting new movie coming soon to theaters near you!'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 px-4 text-sm font-semibold bg-primary text-white rounded-xl shadow-lg hover:bg-primary-dull transition-all duration-300 hover:shadow-primary/50 flex items-center justify-center gap-2">
            <Bell className="w-4 h-4" />
            Notify Me
          </button>
          {movie.trailerUrl && !showTrailer && (
            <button 
              onClick={() => setShowTrailer(true)}
              className="py-2.5 px-4 text-sm font-semibold bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Trailer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Releases = () => {
  const { upcomingMovies } = useAppContext();
  const [filter, setFilter] = useState('all');

  // Filter movies by genre if needed
  const filteredMovies = upcomingMovies?.filter(movie => {
    if (filter === 'all') return true;
    return movie.genre?.toLowerCase().includes(filter.toLowerCase());
  }) || [];

  // Extract unique genres
  const genres = [...new Set(upcomingMovies?.map(m => m.genre?.split('|')[0]?.trim()).filter(Boolean))] || [];

  return (
    <div className="relative my-40 mb-60 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" color="rgba(248, 69, 101, 0.1)" />
      <BlurCircle bottom="50px" right="50px" color="rgba(248, 69, 101, 0.15)" />

      {/* Page Header */}
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Coming Soon
        </h1>
        <p className="text-zinc-400 text-sm">Get ready for these upcoming releases</p>
      </div>

      {/* Genre Filter */}
      {genres.length > 0 && (
        <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2 relative z-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            All Movies
          </button>
          {genres.slice(0, 5).map((genre, idx) => (
            <button
              key={idx}
              onClick={() => setFilter(genre)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                filter === genre
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {filteredMovies.map((movie) => (
            <ComingSoonCard movie={movie} key={movie._id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 relative z-10">
          <div className="w-20 h-20 mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
            <Film className="w-10 h-10 text-zinc-700" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No upcoming movies</h2>
          <p className="text-sm">Check back soon for new releases</p>
        </div>
      )}

      {/* Load More Button */}
      {filteredMovies.length > 0 && filteredMovies.length >= 4 && (
        <div className='flex justify-center mt-16 relative z-10'>
          <button className='px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dull hover:shadow-primary/50 transition-all duration-300 hover:scale-105'>
            Load More Movies
          </button>
        </div>
      )}
    </div>
  );
};

export default Releases;