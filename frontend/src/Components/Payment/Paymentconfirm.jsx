import React from "react";
import { handleRazorpayPayment } from "./handlePayment";

const Paymentconfirm = ({ bookingData, onClose }) => {
  // ✅ Handle Payment

  if (!bookingData) return null;

  const {
    pricePerNight,
    nights,
    serviceFee,
    tax,
    totalAmount,
    checkIn,
    checkOut,
    listingId,
    guests,
  } = bookingData;

  const handlePayment = () => {
    const token = localStorage.getItem("access_token"); // Get user token
    if (!token) {
      alert("Please log in to proceed with payment.");
      return;
    }

    const paymentData = {
      amount: totalAmount, // Total price for the payment
      listing_id: listingId,
      check_in: checkIn,
      check_out: checkOut,
      guests: guests,
    };

    handleRazorpayPayment(token, paymentData);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-[60rem] border flex gap-8">
        {/* Left Section - Trip & Payment */}
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-6">Confirm and Pay</h2>

          {/* Trip Summary */}
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Your Trip</h3>
            <p className="text-gray-600">Check-in: {checkIn}</p>
            <p className="text-gray-600">Check-out: {checkOut}</p>
            <p className="text-gray-600">Guests: {guests}</p>
          </div>

          {/* Confirm & Close Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-pink-500 text-white px-6 py-2 rounded-md"
              onClick={handlePayment}
            >
              Confirm and Pay
            </button>
          </div>
        </div>

        {/* Right Section - Payment Summary */}
        <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Price details</h3>
          <div className="flex justify-between text-gray-600">
            <p>
              ₹{pricePerNight} x {nights} nights
            </p>
            <p>₹{(pricePerNight * nights).toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600 mt-2">
            <p>Service Fee</p>
            <p>₹{serviceFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600 mt-2">
            <p>Taxes</p>
            <p>₹{tax.toFixed(2)}</p>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-xl">
            <p>Total (INR)</p>
            <p>₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paymentconfirm;
