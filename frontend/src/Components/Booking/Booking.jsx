import React, { useState } from "react";
import { createRazorpayOrder } from "../../api";
import { useAuth } from "../../contexts/useAuth";
import Paymentconfirm from "../Payment/paymentConfirm";
import Loader from "../Loader/Loader";

const Booking = ({ pricePerNight, listingId, onClose }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const { user } = useAuth();

  // Calculate total nights
  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const nights = getNights();
  const totalPrice = nights * pricePerNight;
  const serviceFee = totalPrice * 0.1;
  const tax = totalPrice * 0.12;
  const totalAmount = totalPrice + serviceFee + tax;

  // Handle Booking Creation
  const handleReserve = async () => {
    if (!checkIn || !checkOut || guests <= 0) {
      setError("Please fill in all details.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("access_token");

      // Create Booking Data
      const bookingInfo = {
        user: user.username,
        amount: totalPrice,
        listing_id: listingId,
        check_in: checkIn,
        check_out: checkOut,
        guests,
      };

      await createRazorpayOrder(token, bookingInfo);

      setSuccess("Booking created successfully!");
      setBookingData({
        pricePerNight,
        nights,
        serviceFee,
        tax,
        totalAmount,
        checkIn,
        checkOut,
        guests,
        listingId,
      });

      setShowPaymentModal(true); // Show PaymentConfirm modal
    } catch (err) {
      setError(err.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-slate-200 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[450px] border">
        <h2 className="text-2xl font-bold">
          <span className="text-gray-500 line-through">
            ₹{(pricePerNight * 1.2).toFixed(0)}
          </span>
          <span className="text-black"> ₹{pricePerNight}</span> per night
        </h2>

        {/* Date & Guest Selection */}
        <div className="border rounded-lg mt-4 overflow-hidden">
          <div className="grid grid-cols-2 border-b border-gray-300">
            <div className="p-3">
              <label className="text-xs font-bold text-gray-600">
                CHECK-IN
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="p-3 border-l border-gray-300">
              <label className="text-xs font-bold text-gray-600">
                CHECKOUT
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="p-3">
            <label className="text-xs font-bold">GUESTS</label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full outline-none"
            >
              {[...Array(5).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1} guest
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reserve Button */}
        <button
          className="bg-colar-red text-white w-full py-3 rounded-lg mt-4 text-lg"
          onClick={handleReserve}
          disabled={loading}
        >
          Reserve
          {loading && <Loader />}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {/* {success && <p className="text-green-500 text-sm mt-2">{success}</p>} */}

        {/* Close Button */}
        <button
          className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-md w-full text-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <Paymentconfirm
          bookingData={bookingData}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default Booking;
