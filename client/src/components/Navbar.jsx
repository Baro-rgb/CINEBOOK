import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Search, TicketPlus, X, Heart } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { path: "/", label: "Trang chủ" },
    { path: "/movies", label: "Phim Đang Chiếu" },
    { path: "/theaters", label: "Rạp Phim" },
    { path: "/releases", label: "Sắp ra mắt" },
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
              <button className="w-full mt-6 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-gray-300 hover:text-white font-medium flex items-center justify-center gap-2">
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