import "./App.css";
import Footer from "./Components/Footer/Footer";
import Listing from "./Components/Listings/Listing";
import New from "./Components/Listings/New";
import ShowListing from "./Components/Listings/ShowListing";
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Edit from "./Components/Listings/Edit";
import { AuthProvider } from "./contexts/useAuth";
import PrivateRoute from "./Components/private_route";
import { useState } from "react";
import ToastNotification from "./Components/ToastNotification/ToastNotification";
import Filter from "./Components/Filter/Filter";
import TaxToggle from "./Components/TaxToggle/TaxToggle";
import User from "./Components/Users/User";
import Trips from "./Components/Trips/Trips";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isTaxEnabled, setIsTaxEnabled] = useState(false);

  return (
    <>
      <ToastNotification />
      <AuthProvider>
        <Routes>
          {/* Login Page - No Navbar or Footer */}
          <Route path="/login" element={<User />} />

          {/* All routes that include Navbar and Footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar setSearchResults={setSearchResults} />
                <div className="flex flex-col min-h-screen">
                  <div className="container mx-auto flex-1 px-4">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex overflow-x-auto space-x-4">
                                <Filter setSearchResults={setSearchResults} />
                              </div>
                              <div className="flex">
                                <TaxToggle
                                  isTaxEnabled={isTaxEnabled}
                                  setIsTaxEnabled={setIsTaxEnabled}
                                />
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
                          <PrivateRoute>
                            <New />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/listings/edit/:id/"
                        element={
                          <PrivateRoute>
                            <Edit />
                          </PrivateRoute>
                        }
                      />
                      <Route path="/trips" element={<Trips />} />
                    </Routes>
                  </div>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
