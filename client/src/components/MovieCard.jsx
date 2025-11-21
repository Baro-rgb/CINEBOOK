import { StarIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";
import axios from "axios"; // Đảm bảo bạn đã cài axios hoặc dùng fetch

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext(); // Giả sử bạn có API_KEY trong context hoặc file env

  // --- STATE ---
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null); // Lưu key trailer
  const [showTrailer, setShowTrailer] = useState(false); // Quyết định có hiện iframe không

  // --- CẤU HÌNH API (Thay bằng key của bạn hoặc lấy từ context) ---
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "YOUR_TMDB_API_KEY_HERE";
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`, // Nếu dùng Token
    },
  };

  // --- EFFECT 1: Xử lý độ trễ và gọi API ---
  useEffect(() => {
    let timer;

    if (isHovered) {
      // 1. Bắt đầu đếm ngược 800ms
      timer = setTimeout(async () => {
        // 2. Nếu chưa có trailer key, thì gọi API lấy về
        if (!trailerKey) {
          try {
            // Gọi endpoint videos của TMDB
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
            );

            // 3. Lọc lấy Trailer từ Youtube
            const videos = response.data.results;
            const officialTrailer = videos.find(
              (vid) =>
                vid.site === "YouTube" &&
                (vid.type === "Trailer" || vid.type === "Teaser")
            );

            if (officialTrailer) {
              setTrailerKey(officialTrailer.key);
              setShowTrailer(true); // Có key rồi thì hiện video
            }
          } catch (error) {
            console.error("Error fetching trailer:", error);
          }
        } else {
          // Nếu đã có key (từ lần hover trước), thì hiện luôn
          setShowTrailer(true);
        }
      }, 800); // Delay 800ms
    } else {
      // Khi chuột rời đi
      setShowTrailer(false);
    }

    // Cleanup: Xóa timer nếu chuột rời đi trước 800ms
    return () => clearTimeout(timer);
  }, [isHovered, movie.id, trailerKey]); // Dependencies

  const handleNavigate = () => {
    navigate(`/movies/${movie._id || movie.id}`); // TMDB thường dùng .id
    scrollTo(0, 0);
  };

  return (
    <div
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- PHẦN MEDIA (ẢNH HOẶC VIDEO) --- */}
      <div
        className="relative rounded-lg h-52 w-full overflow-hidden cursor-pointer bg-gray-900"
        onClick={handleNavigate}
      >
        {showTrailer && trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
            title={movie.title}
            className="absolute top-0 left-0 w-full h-full object-cover fade-in"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: "none" }} // Chặn click vào video
          />
        ) : (
          <img
            src={image_base_url + (movie.backdrop_path || movie.poster_path)}
            alt={movie.title}
            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
              showTrailer ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
      </div>

      {/* --- PHẦN THÔNG TIN --- */}
      <p className="font-semibold mt-2 truncate" title={movie.title}>
        {movie.title}
      </p>

      <p className="text-sm text-gray-400 mt-2">
        {movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "N/A"}{" "}
        •{" "}
        {/* TMDB trả về genre_ids chứ không phải object genres đầy đủ trong list, cần xử lý nếu muốn hiện tên */}
        TMDB Movie
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-white"
        >
          Detail
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary text-yellow-500 fill-yellow-500" />
          {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
