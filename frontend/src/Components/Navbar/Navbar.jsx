import React, { useState, useEffect } from "react";
import { FaHouse } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { logout, search_listings } from "../../api";
import { useAuth } from "../../contexts/useAuth";
import Login from "../Users/Login";
import SignUp from "../Users/SignUp";
import "./Navbar.css";


const Navbar = ({ setSearchResults }) => {
  const { logout_user, showLoginPopup, setShowLoginPopup, user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [searchDestination, setSearchDestination] = useState("");

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

  const handleSearchChange = (e) => {
    setSearchDestination(e.target.value);
  };

  const handleSearch = async () => {
    if (searchDestination.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await search_listings(searchDestination);
      setSearchResults(response);
    } catch (error) {
      console.error("Error fetching search results:", error);
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
      setSearchResults([]); // Reset listings when search bar is cleared
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom sticky-top custom-navbar"
      // style={{
      //   height: "5rem",
      //   fontSize: "1rem",
      //   backgroundColor: "white",
      // }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <FaHouse
            style={{
              color: "#fe424d",
              fontSize: "2rem",
            }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse w-100 "
          id="navbarSupportedContent"
        >
          {/* <div className="navbar-nav">
            <Link className="nav-link" to="/">
              Explore
            </Link>
          </div> */}
          <div className="navbar-nav ms-auto">
            <div className="d-flex search-container">
              <input
                className="search-input"
                type="text"
                placeholder="Search destinations"
                aria-label="Search"
                value={searchDestination}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <button
                className="search-btn"
                type="button"
                onClick={handleSearch}
              >
                <FaSearch />
              </button>
            </div>
          </div>
          <div className="navbar-nav ms-auto auth-buttons d-flex">
            <Link className="nav-link" to="/listings/new">
              Airbnb your home
            </Link>
            {user ? (
              <button className="nav-link" onClick={handleLogout}>
                <b>Log out</b>
              </button>
            ) : (
              <>
                <div className="auth-buttons d-flex flex-column flex-lg-row">
                  {/* Open SignUp modal instead of redirecting */}

                  <button
                    className="nav-link"
                    onClick={() => setIsSignUpOpen(true)}
                  >
                    <b>Sign Up</b>
                  </button>
                  {/* Open Bootstrap-styled login modal */}
                  <button
                    className="nav-link"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    <b>Log in</b>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Show Bootstrap-styled Login Modal */}
      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
      {/* Show SignUp Modal */}
      {isSignUpOpen && <SignUp onClose={() => setIsSignUpOpen(false)} />}
    </nav>
  );
 
};

export default Navbar;
