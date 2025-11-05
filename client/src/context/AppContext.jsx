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

  useEffect(() => {
    fetchShows();
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
    favoriteMovies,
    fetchfavoriteMovies,
    image_base_url,
  };

  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};

export const useAppContext = () => useContext(Appcontext);
