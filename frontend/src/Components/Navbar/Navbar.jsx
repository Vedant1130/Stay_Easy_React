import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaBars, FaUserCircle } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
import Loader from "../Loader/Loader";
import { search_listings } from "../../api";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ setSearchResults }) => {
  const { logout_user, user, isAuthenticated } = useAuth();
  const [searchDestination, setSearchDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const nav = useNavigate();

  const handleLogout = async () => {
    const success = await logout_user();
    if (success) {
      nav("/");
    }
  };

  const handleSearch = async () => {
    if (searchDestination.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await search_listings(searchDestination);
      const fetchTime = Date.now() - startTime;

      setTimeout(() => {
        setSearchResults(response);
        setLoading(false);
      }, Math.max(1000 - fetchTime, 0));

      if (response.length === 0) {
        showToast("No listings found for your search.", "info");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      showToast("Failed to fetch search results.", "error");
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      {loading && <Loader />}

      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass sticky top-0 border-b border-brand-dark/5 shadow-sm py-4 px-6 flex items-center justify-between z-50 backdrop-blur-xl"
      >
        {/* Left Side: Icon */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-brand-primary p-2 rounded-xl text-white shadow-lg shadow-brand-primary/30"
          >
            <FaHouse size={20} />
          </motion.div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary hidden sm:block">StayEasy</span>
        </Link>

        {/* Center: Search Bar */}
        <div className="relative flex items-center w-full max-w-md mx-4">
          <input
            type="text"
            className="w-full px-5 py-3 pl-12 border border-brand-dark/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-inner bg-brand-light/50 font-medium placeholder:text-brand-dark/40 transition-all focus:bg-white"
            placeholder="Search destinations..."
            value={searchDestination}
            onChange={(e) => setSearchDestination(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FaSearch className="absolute left-4 text-brand-dark/40" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white p-2 rounded-full shadow-md"
            onClick={handleSearch}
          >
            <FaSearch size={14} />
          </motion.button>
        </div>

        {/* Right Side: Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 p-2 px-3 border border-brand-dark/10 rounded-full hover:shadow-md transition-shadow bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            <FaBars className="text-brand-dark/70" size={16} />
            <div className="bg-brand-dark/5 p-1 rounded-full">
               <FaUserCircle className="text-brand-dark" size={24} />
            </div>
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 bg-white/[0.95] backdrop-blur-xl shadow-xl rounded-xl overflow-hidden border border-brand-dark/5 py-2 font-medium"
              >
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-brand-dark/5 mb-2">
                       <p className="text-sm text-brand-dark/50">Signed in as</p>
                       <p className="font-bold text-brand-dark truncate">{user.username || user.email}</p>
                    </div>
                    <Link
                      className="block px-4 py-2 hover:bg-brand-primary/5 hover:text-brand-primary transition-colors"
                      to="/listings/new"
                    >
                      List your home
                    </Link>
                    <Link className="block px-4 py-2 hover:bg-brand-primary/5 hover:text-brand-primary transition-colors" to="/trips">
                     Trips
                    </Link>
                    <div className="my-1 border-t border-brand-dark/5"></div>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      className="block px-4 py-2 hover:bg-brand-primary/5 hover:text-brand-primary transition-colors"
                      to="/listings/new"
                    >
                      List your home
                    </Link>
                    <Link
                      className="block px-4 py-2 hover:bg-brand-primary/5 hover:text-brand-primary transition-colors"
                      to="/login"
                    >
                      Login / Sign up
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
