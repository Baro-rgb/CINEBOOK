import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Search, TicketPlus, X, Heart, Film } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteMovies } = useAppContext();

  // Detect scroll for backdrop blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, searchOpen]);

  // Handle search functionality
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce search

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Close search with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      // TODO: Thay thế bằng API endpoint thực tế của bạn
      // const response = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
      // const data = await response.json();
      
      // Demo data - bạn cần thay thế bằng API call thực tế
      const demoMovies = [
        { id: 1, title: "Avengers: Endgame", poster: "/poster1.jpg", releaseDate: "2024-01-15" },
        { id: 2, title: "Spider-Man: No Way Home", poster: "/poster2.jpg", releaseDate: "2024-02-20" },
        { id: 3, title: "The Batman", poster: "/poster3.jpg", releaseDate: "2024-03-10" },
      ];
      
      const filtered = demoMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const navLinks = [
    { path: "/", label: "Trang chủ" },
    { path: "/movies", label: "Phim Đang Chiếu" },
    { path: "/theaters", label: "Rạp Phim" },
    { path: "/releases", label: "Tinder Phim" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery("");
          }}
        >
          <div
            className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-gray-500"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : searchQuery.trim().length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Film className="w-12 h-12 mb-3 opacity-50" />
                  <p>Nhập tên phim để tìm kiếm</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Film className="w-12 h-12 mb-3 opacity-50" />
                  <p>Không tìm thấy phim nào</p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {searchResults.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-left group"
                    >
                      <div className="w-16 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {movie.poster ? (
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium group-hover:text-primary transition-colors duration-200 truncate">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {movie.releaseDate}
                        </p>
                      </div>
                      <Search className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors duration-200" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {searchQuery.trim().length === 0 && (
              <div className="p-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-3">GỢI Ý TÌM KIẾM</p>
                <div className="flex flex-wrap gap-2">
                  {["Phim hành động", "Phim kinh dị", "Phim hoạt hình", "Phim chiếu rạp"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-400 hover:text-white transition-all duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 z-50 transition-transform hover:scale-105 active:scale-95"
              onClick={handleLinkClick}
            >
              <img
                src={assets.logo}
                alt="Logo"
                className="h-8 md:h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-white bg-primary"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <span className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-20" />
                    )}
                  </Link>
                ))}
                {favoriteMovies.length > 0 && (
                  <Link
                    to="/favorite"
                    onClick={handleLinkClick}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive("/favorite")
                        ? "text-white bg-primary"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    Yêu Thích
                    {favoriteMovies.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favoriteMovies.length}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-4 z-50">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-300" />
              </button>

              {/* Auth Button / User Menu */}
              {!user ? (
                <button
                  onClick={openSignIn}
                  className="px-4 py-2 md:px-6 md:py-2.5 bg-primary hover:bg-primary/90 active:scale-95 transition-all duration-200 rounded-full font-medium text-sm md:text-base shadow-lg shadow-primary/20 hover:shadow-primary/40"
                >
                  Đăng nhập
                </button>
              ) : (
                <div className="transform hover:scale-105 transition-transform">
                  <UserButton afterSignOutUrl="/">
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label="My Booking"
                        labelIcon={<TicketPlus width={15} />}
                        onClick={() => navigate("/my-bookings")}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed top-0 right-0 h-screen w-72 bg-gradient-to-b from-gray-900 to-black shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="text-lg font-semibold text-white">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:translate-x-2 ${
                      isActive(link.path)
                        ? "bg-primary text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                {favoriteMovies.length > 0 && (
                  <Link
                    to="/favorite"
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 transform hover:translate-x-2 ${
                      isActive("/favorite")
                        ? "bg-primary text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Yêu Thích
                    </span>
                    {favoriteMovies.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[24px] text-center">
                        {favoriteMovies.length}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* Mobile Search */}
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full mt-6 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-gray-300 hover:text-white font-medium flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;