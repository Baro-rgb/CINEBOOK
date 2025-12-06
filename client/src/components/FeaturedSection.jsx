import { ArrowRight, Star, TrendingUp, Film } from "lucide-react";
import React, { useState } from "react";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const FeaturedSection = () => {
  const { shows } = useAppContext();
  const [activeTab, setActiveTab] = useState("trending");
  const navigate = useNavigate();

  // Lọc phim theo tab
  const getFilteredMovies = () => {
    switch (activeTab) {
      case "trending":
        // Top 8 phim có rating cao nhất
        return [...shows]
          .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
          .slice(0, 8);
      case "latest":
        // 8 phim mới nhất theo ngày phát hành
        return [...shows]
          .sort(
            (a, b) =>
              new Date(b.release_date || 0) - new Date(a.release_date || 0)
          )
          .slice(0, 8);
      case "popular":
        // 8 phim đầu tiên (mặc định)
        return shows.slice(0, 8);
      default:
        return shows.slice(0, 8);
    }
  };

  const filteredMovies = getFilteredMovies();
  const displayMovies = filteredMovies.slice(0, 4);

  const handleNavigate = (path) => {
    if (navigate) {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between pt-20 pb-10 gap-4">
        <BlurCircle top="0" right="-80px" />

        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Phim Đang Chiếu
          </h2>
          <p className="text-gray-400 text-sm">
            Khám phá những bộ phim đang được yêu thích nhất
          </p>
        </div>

        <button
          onClick={() => handleNavigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer transition"
        >
          Xem tất cả
          <ArrowRight className="group-hover:translate-x-1 transition w-5 h-5" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("trending")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition whitespace-nowrap ${
            activeTab === "trending"
              ? "bg-primary text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Thịnh hành
        </button>
        <button
          onClick={() => setActiveTab("latest")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition whitespace-nowrap ${
            activeTab === "latest"
              ? "bg-primary text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          <Film className="w-4 h-4" />
          Mới nhất
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition whitespace-nowrap ${
            activeTab === "popular"
              ? "bg-primary text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          <Star className="w-4 h-4" />
          Phổ biến
        </button>
      </div>

      {/* Movies Grid */}
      {displayMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {displayMovies.map((show, index) => (
            <div
              key={show._id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MovieCard movie={show} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Film className="w-10 h-10 text-gray-500" />
          </div>
          <p className="text-gray-400">Không có phim nào trong danh mục này</p>
        </div>
      )}

      {/* Stats Bar */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Tổng phim</p>
          <p className="text-2xl font-bold text-primary">{shows.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Đang hiển thị</p>
          <p className="text-2xl font-bold text-primary">
            {displayMovies.length}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Đánh giá TB</p>
          <p className="text-2xl font-bold text-yellow-500">
            {shows.length > 0
              ? (
                  shows.reduce((sum, m) => sum + (m.vote_average || 0), 0) /
                  shows.length
                ).toFixed(1)
              : "0.0"}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Thể loại</p>
          <p className="text-2xl font-bold text-primary">
            {
              [
                ...new Set(
                  shows.flatMap((m) => m.genres?.map((g) => g.name) || [])
                ),
              ].length
            }
          </p>
        </div>
      </div> */}

      {/* Call to Action */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => handleNavigate("/movies")}
          className="group flex items-center gap-2 px-10 py-4 text-sm bg-primary hover:bg-primary/90 transition rounded-full font-medium cursor-pointer shadow-lg shadow-primary/20"
        >
          Khám phá thêm phim
          <ArrowRight className="group-hover:translate-x-1 transition w-5 h-5" />
        </button>
      </div>

      {/* Decorative Elements */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default FeaturedSection;
