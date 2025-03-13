import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaBars, FaUserCircle } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
import Loader from "../Loader/Loader";
import { search_listings } from "../../api";

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

      <nav className="bg-white border-b sticky top-0 shadow-sm py-3 px-4 flex items-center justify-between z-50">
        {/* Left Side: Icon */}
        <Link to="/" className="text-red-500 text-3xl">
          <FaHouse />
        </Link>

        {/* Center: Search Bar */}
        <div className="relative flex items-center w-full max-w-md">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Search destinations"
            value={searchDestination}
            onChange={(e) => setSearchDestination(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="absolute right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
        </div>

        {/* Right Side: Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2 p-2 border rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            <FaBars className="text-gray-600" size={18} />
            <FaUserCircle className="text-gray-600" size={24} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden border">
              {user ? (
                <>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    to="/listings/new"
                  >
                    List your home
                  </Link>
                  <Link className="block px-4 py-2 hover:bg-gray-100" to="">
                    Saved Listings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    to="/listings/new"
                  >
                    List your home
                  </Link>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    to="/login"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
