import "./App.css";
import Footer from "./Components/Footer/Footer";
import Listing from "./Components/Listings/Listing";
import New from "./Components/Listings/New";
import ShowListing from "./Components/Listings/ShowListing";
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import SignUp from "./Components/Users/SignUp";
import Login from "./Components/Users/Login";
import Edit from "./Components/Listings/Edit";
import { AuthProvider } from "./contexts/useAuth";
import PrivateRoute from "./Components/private_route";
import { useState } from "react";
import ToastNotification from "./Components/ToastNotification/ToastNotification";
import Filter from "./Components/Filter/Filter";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  return (
    <>
      <ToastNotification />
      <AuthProvider>
        <Navbar
          setSearchResults={setSearchResults}
          onOpenLogin={() => setShowLogin(true)}
        />

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Filter setSearchResults={setSearchResults} />
                  <Listing searchResults={searchResults} />
                </>
              }
            />
            <Route path="/listings/:id" element={<ShowListing />} />
            <Route
              path="/listings/new"
              element={
                <PrivateRoute
                  onOpenLogin={() => {
                    setShowLogin(true);
                  }}
                >
                  <New />
                </PrivateRoute>
              }
            />
            <Route
              path="/listings/edit/:id/"
              element={
                <PrivateRoute
                  onOpenLogin={() => {
                    setShowLogin(true);
                  }}
                >
                  <Edit />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </AuthProvider>
      <Footer />
    </>
  );
}

export default App;
