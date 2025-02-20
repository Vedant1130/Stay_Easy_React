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
import TaxToggle from "./Components/TaxToggle/TaxToggle";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isTaxEnabled, setIsTaxEnabled] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <>
      <ToastNotification />
      <AuthProvider>
        <Navbar
          setGlobalLoading={setGlobalLoading}
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
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col-md-9 col-12">
                        <Filter setSearchResults={setSearchResults} />
                      </div>
                      <div className="col-md-3 col-12 text-md-end">
                        <TaxToggle
                          isTaxEnabled={isTaxEnabled}
                          setIsTaxEnabled={setIsTaxEnabled}
                        />
                      </div>
                    </div>
                  </div>
                  <Listing
                    searchResults={searchResults}
                    isTaxEnabled={isTaxEnabled}
                  />
                </>
              }
            />
            <Route path="/listings/:id" element={<ShowListing />} />
            <Route
              path="/listings/new"
              element={
                <PrivateRoute
                  setGlobalLoading={setGlobalLoading}
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
