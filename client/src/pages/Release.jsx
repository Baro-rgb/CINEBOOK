import React from "react";
import { useAppContext } from "../context/AppContext";
import Loading from "../components/Loading"; // Giả sử bạn có component này, nếu không thì bỏ qua

const Release = () => {
  const { upcomingMovies, image_base_url } = useAppContext();

  // Hàm format ngày tháng (VD: 2025-12-20 -> 20/12/2025)
  const formatDate = (dateString) => {
    if (!dateString) return "Coming Soon";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  if (!upcomingMovies) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-36 pt-32 pb-10">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
          Upcoming Releases
        </h2>
        <p className="text-gray-400">
          Discover the latest movies coming soon to theaters near you.
        </p>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
        {upcomingMovies.map((movie, index) => (
          <div
            key={index}
            className="group relative cursor-pointer bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg border border-gray-800"
          >
            {/* Poster Image */}
            <div className="aspect-[2/3] overflow-hidden">
              {movie.poster_path ? (
                <img
                  src={`${image_base_url}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Movie Info Overlay (Hiện khi hover hoặc luôn hiện ở dưới) */}
            <div className="p-4">
              <h3
                className="text-lg font-semibold truncate"
                title={movie.title}
              >
                {movie.title}
              </h3>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs border border-primary/50">
                  {formatDate(movie.release_date)}
                </span>
                {/* Hiển thị ngôn ngữ gốc */}
                <span className="uppercase border border-gray-600 px-1 rounded text-xs">
                  {movie.original_language}
                </span>
              </div>

              {/* Tóm tắt ngắn (chỉ hiện 2 dòng) */}
              <p className="text-xs text-gray-500 mt-3 line-clamp-2">
                {movie.overview || "No overview available."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {upcomingMovies.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No upcoming movies found at the moment.
        </div>
      )}
    </div>
  );
};

export default Release;
