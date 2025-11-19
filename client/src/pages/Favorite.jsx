import React, { useState } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import { Heart, Film, Sparkles, ArrowRight, Trash2 } from "lucide-react";

const Favorite = () => {
  const { favoriteMovies, removeFavorite } = useAppContext();
  const [sortBy, setSortBy] = useState("recent"); // recent, title, rating

  // Sort movies based on selected option
  const getSortedMovies = () => {
    const movies = [...favoriteMovies];
    switch (sortBy) {
      case "title":
        return movies.sort((a, b) => a.title.localeCompare(b.title));
      case "rating":
        return movies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return movies;
    }
  };

  const sortedMovies = getSortedMovies();

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <BlurCircle top="20%" left="10%" className="opacity-30" />
      <BlurCircle bottom="20%" right="10%" className="opacity-30" />

      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping opacity-20">
          <div className="w-32 h-32 rounded-full bg-primary" />
        </div>
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
          <Heart className="w-16 h-16 text-primary animate-pulse" />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Chưa có phim yêu thích
      </h1>
      <p className="text-gray-400 text-center max-w-md mb-8 text-lg">
        Hãy khám phá và thêm những bộ phim tuyệt vời vào danh sách yêu thích của bạn!
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleNavigate("/movies")}
          className="group flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
        >
          <Film className="w-5 h-5" />
          Khám phá phim đang chiếu
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button
          onClick={() => handleNavigate("/releases")}
          className="group flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-all duration-300 hover:scale-105 border border-white/20"
        >
          <Sparkles className="w-5 h-5" />
          Phim sắp ra mắt
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="mt-16 flex items-center gap-8 opacity-20">
        <Film className="w-8 h-8 animate-bounce" style={{ animationDelay: "0s" }} />
        <Heart className="w-8 h-8 animate-bounce" style={{ animationDelay: "0.2s" }} />
        <Sparkles className="w-8 h-8 animate-bounce" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );

  // Main content with movies
  if (favoriteMovies.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative pt-32 pb-20 px-4 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-screen">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
            <Heart className="w-6 h-6 text-primary fill-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Phim Yêu Thích
            </h1>
            <p className="text-gray-400 text-sm md:text-base mt-1">
              {favoriteMovies.length} bộ phim trong danh sách của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="recent" className="bg-gray-900">Gần đây</option>
            <option value="title" className="bg-gray-900">Tên phim (A-Z)</option>
            <option value="rating" className="bg-gray-900">Đánh giá cao</option>
          </select>
        </div>

        <button
          onClick={() => {
            if (window.confirm(`Bạn có chắc muốn xóa tất cả ${favoriteMovies.length} phim yêu thích?`)) {
              favoriteMovies.forEach(movie => removeFavorite && removeFavorite(movie._id));
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all duration-200 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Xóa tất cả
        </button>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedMovies.map((movie, index) => (
          <div
            key={movie._id}
            className="animate-fadeIn"
            style={{
              animationDelay: `${index * 0.05}s`,
              animationFillMode: "both"
            }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-1">Tìm thêm phim hay?</h3>
            <p className="text-gray-400 text-sm">
              Khám phá hàng trăm bộ phim đang chiếu và sắp ra mắt
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleNavigate("/movies")}
              className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap"
            >
              Phim đang chiếu
            </button>
            <button
              onClick={() => handleNavigate("/releases")}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-all duration-200 hover:scale-105 border border-white/20 whitespace-nowrap"
            >
              Sắp ra mắt
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Favorite;