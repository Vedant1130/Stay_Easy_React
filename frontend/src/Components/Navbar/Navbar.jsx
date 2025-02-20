import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaBars, FaUserCircle } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import Login from "../Users/Login";
import SignUp from "../Users/SignUp";
import "./Navbar.css";
import { showToast } from "../ToastNotification/ToastNotification";
import Loader from "../Loader/Loader";

const Navbar = ({ setSearchResults }) => {
  const { logout_user, showLoginPopup, setShowLoginPopup, user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
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

  useEffect(() => {
    if (showLoginPopup) {
      setIsLoginOpen(true);
      setShowLoginPopup(false);
    }
  }, [showLoginPopup]);

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

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchDestination(value);

    if (value.trim() === "") {
      setSearchResults([]);
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

  useEffect(() => {
    setLoading(true);
    const startTime = Date.now();

    const timer = setTimeout(() => {
      const fetchTime = Date.now() - startTime;
      setLoading(false);
    }, Math.max(1000 - (Date.now() - startTime), 0));

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}

      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top custom-navbar">
        <div className="container-fluid d-flex align-items-center">
          {/* Left Side: Icon */}
          <Link className="navbar-brand me-auto" to="/">
            <FaHouse
              style={{
                color: "#fe424d",
                fontSize: "2rem",
              }}
              className="home-icon"
            />
          </Link>

          {/* Center: Search Bar */}
          <div className="search-container mx-auto">
            <input
              className="search-input"
              type="text"
              placeholder="Search destinations"
              aria-label="Search"
              value={searchDestination}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" type="button" onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>

          {/* Right Side: Dropdown Menu */}
          <div className="position-relative ms-auto" ref={menuRef}>
            <button
              className="menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
            >
              <FaBars className="text-secondary me-2" size={18} />
              <FaUserCircle className="text-secondary" size={24} />
            </button>

            {menuOpen && (
              <div className="dropdown-menu show position-absolute end-0 mt-2 p-2 shadow-sm border rounded">
                {user ? (
                  <>
                    <Link className="dropdown-item" to="/listings/new">
                      List your home
                    </Link>
                    <Link className="dropdown-item" to="">
                      Saved Listings
                    </Link>

                    <button className="dropdown-item" onClick={handleLogout}>
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link className="dropdown-item" to="/listings/new">
                      List your home
                    </Link>

                    <button
                      className="dropdown-item"
                      onClick={() => setIsSignUpOpen(true)}
                    >
                      Sign Up
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => setIsLoginOpen(true)}
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
        {isSignUpOpen && <SignUp onClose={() => setIsSignUpOpen(false)} />}
      </nav>
    </>
  );
};

export default Navbar;
