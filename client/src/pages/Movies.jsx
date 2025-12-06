import React, { useState, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import { Search, Filter, Calendar, Star } from "lucide-react";

const Movies = () => {
  const { shows } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Lấy danh sách thể loại từ tất cả phim
  const allGenres = useMemo(() => {
    const genresSet = new Set();
    shows.forEach((movie) => {
      if (movie.genres && Array.isArray(movie.genres)) {
        movie.genres.forEach((genre) => genresSet.add(genre.name));
      }
    });
    return Array.from(genresSet).sort();
  }, [shows]);

  // Lọc và sắp xếp phim
  const filteredAndSortedMovies = useMemo(() => {
    let result = [...shows];

    // Tìm kiếm theo tên
    if (searchTerm) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo thể loại
    if (selectedGenre !== "all") {
      result = result.filter((movie) =>
        movie.genres?.some((genre) => genre.name === selectedGenre)
      );
    }

    // Sắp xếp
    switch (sortBy) {
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "rating":
        result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case "release_date":
        result.sort(
          (a, b) =>
            new Date(b.release_date || 0) - new Date(a.release_date || 0)
        );
        break;
      default:
        break;
    }

    return result;
  }, [shows, searchTerm, selectedGenre, sortBy]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedGenre("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchTerm || selectedGenre !== "all" || sortBy !== "default";

  return shows.length > 0 ? (
    <div className="relative my-20 mb-40 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-screen">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Phim Đang Chiếu
          </h1>
          <p className="text-gray-400">
            {filteredAndSortedMovies.length} phim có sẵn
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Bộ lọc & Tìm kiếm</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Genre Filter */}
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
            >
              <option value="all">Tất cả thể loại</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
            >
              <option value="default">Sắp xếp mặc định</option>
              <option value="title">Theo tên A-Z</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="release_date">Mới nhất</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Movies Grid */}
      {filteredAndSortedMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedMovies.map((movie) => (
            <MovieCard movie={movie} key={movie._id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Không tìm thấy phim nào
          </h3>
          <p className="text-gray-400 text-center max-w-md mb-4">
            Không có phim nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử
            điều chỉnh bộ lọc.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg transition"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Movie Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-400">Tổng phim</span>
          </div>
          <p className="text-2xl font-bold">{shows.length}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-400">Thể loại</span>
          </div>
          <p className="text-2xl font-bold">{allGenres.length}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-400">Đang hiển thị</span>
          </div>
          <p className="text-2xl font-bold">{filteredAndSortedMovies.length}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-400">Đánh giá TB</span>
          </div>
          <p className="text-2xl font-bold">
            {shows.length > 0
              ? (
                  shows.reduce((sum, m) => sum + (m.vote_average || 0), 0) /
                  shows.length
                ).toFixed(1)
              : "0.0"}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen px-6">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Calendar className="w-12 h-12 text-gray-500" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Không có phim nào đang chiếu
      </h1>
      <p className="text-gray-400 text-center max-w-md">
        Hiện tại chưa có phim nào được lên lịch chiếu. Vui lòng quay lại sau.
      </p>
    </div>
  );
};

export default Movies;
