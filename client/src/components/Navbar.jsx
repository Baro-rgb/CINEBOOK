import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const { favoriteMovies } = useAppContext();

  // Danh sách các link
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/movies", label: "Movies" },
    { path: "/theaters", label: "Theaters" },
    { path: "/releases", label: "Releases" },
    ...(favoriteMovies.length > 0
      ? [{ path: "/favorite", label: "Favorites" }]
      : []),
  ];

  // Cập nhật vị trí của indicator khi route thay đổi
  useEffect(() => {
    if (navRef.current) {
      const activeLink = navRef.current.querySelector(
        `[data-path="${location.pathname}"]`
      );
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setIndicatorStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [location.pathname, favoriteMovies.length]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <nav
          ref={navRef}
          className="relative flex flex-col md:flex-row items-center gap-8"
        >
          {/* Indicator trượt với bóng mờ */}
          <span
            className="hidden md:block absolute h-full bg-primary/20 rounded-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] -z-10"
            style={indicatorStyle}
          />

          {navLinks.map((link) => (
            <Link
              key={link.path}
              data-path={link.path}
              onClick={() => {
                scrollTo(0, 0);
                setIsOpen(false);
              }}
              to={link.path}
              className={`relative px-4 py-2 transition-all duration-300 ${
                isActive(link.path)
                  ? "text-primary font-semibold max-md:bg-primary/20 max-md:rounded-full max-md:px-6"
                  : "text-white hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 
            bg-primary hover:bg-primary-dull transition rounded-full 
            font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Booking"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;
