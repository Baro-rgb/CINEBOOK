import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { shows } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (shows.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % shows.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [shows.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + shows.length) % shows.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % shows.length);
  };

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get year from release date
  const getYear = (releaseDate) => {
    if (!releaseDate) return "N/A";
    return new Date(releaseDate).getFullYear();
  };

  // Get genres as string
  const getGenres = (genres) => {
    if (!genres || genres.length === 0) return "N/A";
    return genres.map((g) => g.name).join(" | ");
  };

  if (!shows || shows.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-xl text-gray-400">Đang tải phim...</p>
      </div>
    );
  }

  const currentMovie = shows[currentIndex];
  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : "/backgroundImage.png";

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 z-10">
        {/* Tagline */}
        {/* {currentMovie.tagline && (
          <div className="px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
            <p className="text-sm text-primary font-medium">
              {currentMovie.tagline}
            </p>
          </div>
        )} */}

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight">
          {currentMovie.title}
        </h1>

        {/* Movie Info */}
        <div className="flex items-center gap-4 text-gray-300 flex-wrap">
          <span className="text-sm md:text-base">
            {getGenres(currentMovie.genres)}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm md:text-base">
              {getYear(currentMovie.release_date)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm md:text-base">
              {formatRuntime(currentMovie.runtime)}
            </span>
          </div>
          {currentMovie.vote_average && (
            <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
              <span className="text-yellow-500 font-semibold">
                ⭐ {currentMovie.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="max-w-2xl text-gray-300 text-sm md:text-base line-clamp-3">
          {currentMovie.overview}
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => navigate(`/movies/${currentMovie._id}`)}
            className="flex items-center gap-2 px-6 py-3 text-sm md:text-base bg-primary hover:bg-primary/90 transition rounded-full font-medium cursor-pointer"
          >
            Đặt vé ngay
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/movies")}
            className="flex items-center gap-2 px-6 py-3 text-sm md:text-base bg-white/10 hover:bg-white/20 backdrop-blur-sm transition rounded-full font-medium cursor-pointer"
          >
            Xem tất cả phim
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex gap-2 mt-4">
          {shows.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-6 bg-gray-500 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {shows.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Movie Counter */}
      <div className="absolute bottom-8 right-8 z-20 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
        <p className="text-sm text-gray-300">
          {currentIndex + 1} / {shows.length}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
