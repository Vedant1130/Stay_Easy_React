import React, { useState, Suspense } from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/useAuth";
import PrivateRoute from "./Components/private_route";
import ToastNotification from "./Components/ToastNotification/ToastNotification";
import Filter from "./Components/Filter/Filter";
import TaxToggle from "./Components/TaxToggle/TaxToggle";

// Lazy Loaded Components
const User = React.lazy(() => import("./Components/Users/User"));
const Listing = React.lazy(() => import("./Components/Listings/Listing"));
const New = React.lazy(() => import("./Components/Listings/New"));
const ShowListing = React.lazy(() => import("./Components/Listings/ShowListing"));
const Edit = React.lazy(() => import("./Components/Listings/Edit"));
const Trips = React.lazy(() => import("./Components/Trips/Trips"));

// Sleek Loading Fallback
const LoadingFallback = () => (
  <div className="flex h-[80vh] items-center justify-center">
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 rounded-full border-t-4 border-brand-primary animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-r-4 border-brand-secondary animate-spin" style={{ animationDirection: 'reverse' }}></div>
      <div className="absolute inset-4 rounded-full border-b-4 border-brand-dark animate-pulse"></div>
    </div>
  </div>
);

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isTaxEnabled, setIsTaxEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-brand-primary selection:text-white">
      <ToastNotification />
      <AuthProvider>
        <Routes>
          {/* Login Page - No Navbar or Footer */}
          <Route path="/login" element={
            <Suspense fallback={<LoadingFallback />}>
              <User />
            </Suspense>
          } />

          {/* All routes that include Navbar and Footer */}
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar setSearchResults={setSearchResults} />
                <main className="container mx-auto flex-1 px-4 py-8 animate-fade-in">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <div className="flex flex-col gap-6 animate-slide-up">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full glass p-4 rounded-2xl shadow-sm">
                              <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                <Filter setSearchResults={setSearchResults} />
                              </div>
                              <div className="flex flex-shrink-0">
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
                          </div>
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
                      <Route
                        path="/trips"
                        element={
                          <PrivateRoute>
                            <Trips />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
