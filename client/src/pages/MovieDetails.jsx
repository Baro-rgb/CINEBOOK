import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon, X } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MovieDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const {
    shows,
    axios,
    getToken,
    user,
    fetchfavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
        // Lấy trailer
        fetchTrailer(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrailer = async (movieId) => {
    try {
      // Thử lấy trailer tiếng Việt trước
      let response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=vi-VN`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiN2M0ZTJjZTRhNzFmOTA0NWI4ZDQ5M2ZmNDAwZDExZCIsIm5iZiI6MTc2MDUyNDI3Ni43NzMsInN1YiI6IjY4ZWY3N2Y0NTA4NDg5OWM4ZWFlZGZhNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vJ8pUiqeNZKGSJoTEDRD8Cec3AVpkI8J_0xUgKoxFO8`,
            accept: 'application/json'
          }
        }
      );
      let data = await response.json();
      
      // Tìm trailer YouTube
      let trailer = data.results?.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      ) || data.results?.find(
        (video) => video.type === "Teaser" && video.site === "YouTube"
      );
      
      // Nếu không có trailer tiếng Việt, thử lấy tiếng Anh
      if (!trailer) {
        response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiN2M0ZTJjZTRhNzFmOTA0NWI4ZDQ5M2ZmNDAwZDExZCIsIm5iZiI6MTc2MDUyNDI3Ni43NzMsInN1YiI6IjY4ZWY3N2Y0NTA4NDg5OWM4ZWFlZGZhNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vJ8pUiqeNZKGSJoTEDRD8Cec3AVpkI8J_0xUgKoxFO8`,
              accept: 'application/json'
            }
          }
        );
        data = await response.json();
        
        trailer = data.results?.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        ) || data.results?.find(
          (video) => video.type === "Teaser" && video.site === "YouTube"
        ) || data.results?.find(
          (video) => video.site === "YouTube"
        );
      }
      
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.log("Error fetching trailer:", error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        await fetchfavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true);
      // Ngăn scroll khi mở modal
      document.body.style.overflow = "hidden";
    } else {
      toast.error("Trailer không khả dụng");
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    getShow();
  }, [id]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={image_base_url + show.movie.poster_path}
          alt=""
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {show.movie.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie.vote_average.toFixed(1)} Đánh giá của người dùng
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>

          <p>
            {timeFormat(show.movie.runtime)} •{" "}
            {show.movie.genres.map((genre) => genre.name).join(", ")} •{" "}
            {show.movie.release_date.split("-")[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button 
              onClick={handlePlayTrailer}
              disabled={!trailerKey}
              className={`flex items-center gap-2 px-7 py-3 text-sm rounded-md font-medium cursor-pointer active:scale-95 transition ${
                trailerKey 
                  ? 'bg-gray-800 hover:bg-gray-900' 
                  : 'bg-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <PlayCircleIcon className="w-5 h-5" />
              Xem đoạn giới thiệu
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Đặt vé
            </a>
            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  favoriteMovies?.find((movie) => movie._id === id)
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <p className="text-lg font-medium mt-20">Tất cả diễn viên</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={image_base_url + cast.profile_path}
                alt=""
                className="rounded-full h-20 
                      md:h-20 aspect-square object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <p className="text-lg font-medium mt-20 mb-8">Có Thể Bạn Cũng Thích</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Hiển thị thêm
        </button>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={handleCloseTrailer}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-12 right-0 text-white hover:text-primary transition p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDetails;