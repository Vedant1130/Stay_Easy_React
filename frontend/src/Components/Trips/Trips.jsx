import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import { get_bookings } from "../../api";
import { FaUserCircle } from "react-icons/fa";
import { GoVerified } from "react-icons/go";

const Trips = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await get_bookings(token);
        setBookings(data || []); // ✅ Ensures bookings is never undefined/null
      } catch (err) {
        setError(err?.message || "Failed to load bookings");
        setBookings([]); // ✅ Prevents `.map()` crash
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookings();
    }
  }, [token]);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <h2 className="text-4xl font-bold mb-6">Trips</h2>

      {/* User Profile Section */}
      <div className="flex items-center bg-gray-100 p-6 rounded-lg shadow-md w-full">
        <FaUserCircle className="text-gray-500 w-24 h-24" />
        <div className="ml-6">
          <h3 className="text-2xl font-bold">
            Hello, {user?.username || "Guest"}
          </h3>
          <p className="text-lg text-gray-700">
            {user?.email || "No email provided"}
          </p>
        </div>
      </div>

      {/* Booking List */}
      <div className="w-full mt-6">
        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (bookings?.length || 0) === 0 ? ( // ✅ Safer way to check if array is empty
          <div className="text-center p-6 bg-white rounded-lg shadow-md w-full">
            <p className="text-lg font-bold">No trips booked... yet!</p>
            <p className="text-gray-600">Start planning your next adventure.</p>
            <button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition">
              Start Searching
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            {bookings?.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-lg shadow-lg flex items-center hover:shadow-xl transition"
              >
                <img
                  src={booking.listing_image || "/placeholder-image.jpg"}
                  alt={booking.listing_title}
                  className="w-36 h-36 object-cover rounded-lg"
                />
                <div className="ml-6">
                  <h3 className="text-2xl font-semibold">
                    {booking.listing_title}
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Check-in: {booking.check_in} | Check-out:{" "}
                    {booking.check_out}
                  </p>
                  <div className="flex items-center text-green-600 mt-2 text-lg">
                    <GoVerified className="w-6 h-6 mr-2" />
                    <span>Payment Done</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
