import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const Appcontext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access the admin dashboard.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTheaters = async () => {
    try {
      const { data } = await axios.get("/api/theater/all");
      if (data.success) {
        setTheaters(data.theaters);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch theaters");
    }
  };

  const fetchfavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ⭐ ADD TO FAVORITES
  const addToFavorites = async (movieId) => {
    try {
      if (!user) {
        toast.error("Vui lòng đăng nhập để thêm phim yêu thích");
        return false;
      }

      const { data } = await axios.post(
        "/api/user/favorites/add",
        { movieId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        // Update local state
        await fetchfavoriteMovies();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể thêm vào yêu thích");
      return false;
    }
  };

  // ⭐ REMOVE FROM FAVORITES
  const removeFavorite = async (movieId) => {
    try {
      const { data } = await axios.delete(`/api/user/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        // Update local state
        setFavoriteMovies((prev) => prev.filter((m) => m._id !== movieId));
        toast.success("Đã xóa khỏi yêu thích");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa khỏi yêu thích");
      return false;
    }
  };

  // ⭐ CHECK IF MOVIE IS FAVORITED
  const isFavorite = (movieId) => {
    return favoriteMovies.some((movie) => movie._id === movieId);
  };

  useEffect(() => {
    fetchShows();
    fetchTheaters();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchfavoriteMovies();
    }
  }, [user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    theaters,
    fetchTheaters,
    favoriteMovies,
    fetchfavoriteMovies,
    addToFavorites, // ⭐ NEW
    removeFavorite, // ⭐ NEW
    isFavorite, // ⭐ NEW
    image_base_url,
  };

  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};

export const useAppContext = () => useContext(Appcontext);