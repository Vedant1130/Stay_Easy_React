import React from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { delete_listing, deleteReview, show_listings } from "../../api";
import { useAuth } from "../../contexts/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
import DeletePopup from "../Popup/deletePopup";
import { FaTrash } from "react-icons/fa";
import Review from "../Review/Review";
import Loader from "../Loader/Loader";
import { FaUserCircle } from "react-icons/fa";
import { Rate } from "antd";
import { handleRazorpayPayment } from "../../Components/Payment/handlePayment"; // Import payment handler
import Booking from "../Booking/Booking";


const ShowListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState([]);
  const [open, setOpen] = useState(false);
  const [isReviewDeleteOpen, setIsReviewDeleteOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { user, get_authenticated, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShowListing();
  }, [id]);
  const fetchShowListing = async () => {
    setLoading(true);
    const data = await show_listings(id);
    setLoading(false);
    setListing(data);
  };

  // Delete Listing
  const handleDelete = async () => {
    const response = await delete_listing(id);

    if (response.success !== false) {
      showToast("Listing deleted successfully!", "success");

      if (!user) {
        await get_authenticated();
      }
      nav("/");
    } else {
      showToast(response.message || "Failed to delete listing.", "error");
    }
  };

  // Open Review Delete Modal
  const handleOpenReviewDeleteModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setIsReviewDeleteOpen(true);
  };

  // Delete Review
  const handleDeleteReview = async () => {
    if (!selectedReviewId) return;

    const response = await deleteReview(id, selectedReviewId); // Ensure you have delete_review API
    if (response.success) {
      showToast("Review deleted successfully!", "success");
      setIsReviewDeleteOpen(false);
      fetchShowListing(); // Refresh listing after deleting review
    } else {
      showToast("Failed to delete review.", "error");
    }
  };

  

  return (
    <>
      {loading && <Loader />}
      <div className="container mx-auto mt-8 px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Image Section */}
          <div className="col-span-4">
            <img
              src={listing.image}
              className="w-full h-96 object-cover rounded-lg shadow-md"
              alt="listing_image"
            />
          </div>

          {/* Middle: Details Section */}
          <div className="col-span-5 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">{listing.title}</h3>
            <p className="text-gray-700 mt-2">{listing.description}</p>
            <p className="text-lg font-semibold text-gray-900 mt-4">
              &#8377; {listing.price}
            </p>
            <p className="text-sm text-gray-600">{listing.location}</p>
            <p className="flex items-center space-x-3 mt-4 text-base ">
              {/* Profile Icon */}
              <FaUserCircle className="text-gray-500 w-10 h-10" />

              {/* Owner Info */}
              <span className="flex flex-col">
                <span className="text-base font-semibold">Hosted by</span>
                <span className="text-gray-700">{listing.owner?.username}</span>
              </span>
            </p>

            {/* ✅ Show Payment Button Only for Non-Owners */}
            {user && listing.owner?.id !== user.id && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-4"
                onClick={() => setIsBookingOpen(true)}
              >
                Book Now
              </button>
            )}
            {/* Show the Booking component when isBookingOpen is true */}

            {isBookingOpen && (
              <Booking
                onClose={() => setIsBookingOpen(false)}
                onReserve={() => {
                  setIsBookingOpen(false); // Close booking
                  setIsPaymentOpen(true); // Open payment modal
                }}
                pricePerNight={listing.price}
                listingId={listing.id}
              />
            )}
            {/* {isPaymentOpen && (
              <Paymentconfirm
                onClose={() => setIsPaymentOpen(false)}
                pricePerNight={listing.price}
                listing={listing}
              />
            )} */}

            {/* Show Edit/Delete only for the listing owner */}
            {user && listing.owner?.id === user.id && (
              <>
                <div className="flex gap-4 mt-4">
                  <Link
                    className="bg-colar-red text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    to={`/listings/edit/${listing.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-slate-900 text-white px-4 py-2 rounded-md"
                    onClick={() => setOpen(true)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right: Added Review Section */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold mb-2">Recent Reviews</h3>

            {/* Scrollable Container */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {listing.reviews && listing.reviews.length > 0 ? (
                listing.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-3 rounded-md shadow-sm"
                  >
                    {/* User Info with Image */}
                    <div className="flex items-center space-x-3 mb-2">
                      <FaUserCircle className="text-gray-500 w-10 h-10" />
                      <div>
                        <div className="flex items-center space-x-28">
                          <p className="font-semibold">
                            {review.owner_username}
                          </p>
                          {user && review.owner === user.id && (
                            <FaTrash
                              onClick={() =>
                                handleOpenReviewDeleteModal(review.id)
                              }
                              className="text-colar-red cursor-pointer"
                            />
                          )}
                        </div>
                        <span className="text-gray-500 text-sm">
                          •
                          {new Intl.RelativeTimeFormat("en", {
                            numeric: "auto",
                          }).format(
                            Math.floor(
                              (new Date(review.created_at) - new Date()) /
                                (1000 * 60 * 60 * 24)
                            ),
                            "day"
                          )}
                        </span>
                      </div>
                    </div>
                    {/* Rating and Stars */}
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        <Rate
                          disabled
                          className="text-colar-red"
                          allowHalf
                          value={review.rating}
                          count={Math.ceil(review.rating)}
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                    </div>
                    <p className="text-lg text-slate-950">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
        <hr className="my-6" />
        <Review id={id} onReviewAdded={fetchShowListing} />

        {/* Delete Listing Modal */}
        <DeletePopup open={open} onClose={() => setOpen(false)}>
          <div className="text-center w-56">
            <FaTrash size={56} className="mx-auto text-red-500" />
            <div className="mx-auto my-4 w-48">
              <h3 className="text-lg font-black text-gray-800">
                Confirm Delete
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this Listing?
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full"
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 w-full"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </DeletePopup>

        {/* Delete Review Modal */}
        <DeletePopup
          open={isReviewDeleteOpen}
          onClose={() => setIsReviewDeleteOpen(false)}
        >
          <div className="text-center w-56">
            <FaTrash size={56} className="mx-auto text-red-500" />
            <div className="mx-auto my-4 w-48">
              <h3 className="text-lg font-black text-gray-800">
                Confirm Delete
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this review?
              </p>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md w-full"
                onClick={() => handleDeleteReview()}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md w-full"
                onClick={() => setIsReviewDeleteOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </DeletePopup>
      </div>
    </>
  );
};

export default ShowListing;
