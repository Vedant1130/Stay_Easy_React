import React from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { delete_listing, show_listings } from "../../api";
import { useAuth } from "../../contexts/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
import DeletePopup from "../Popup/deletePopup";
import { FaTrash } from "react-icons/fa";
import Review from "../Review/Review";

const ShowListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const fetchShowListing = async () => {
      const data = await show_listings(id);
      setListing(data);
    };
    fetchShowListing();
  }, [id]);

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

  return (
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

          {user && listing.owner === user.id && (
            <div className="flex gap-4 mt-4">
              <Link
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                to={`/listings/edit/${listing.id}`}
              >
                Edit
              </Link>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => setOpen(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Right: Added Review Section */}
        <div className="col-span-3">
          <h3 className="text-lg font-semibold mb-2">Recent Reviews</h3>
          <div className="bg-gray-100 p-3 rounded-md shadow-sm mb-2">
            <p className="font-semibold">John Doe</p>
            <p className="text-sm text-gray-600">
              "Great place, very clean and well maintained!"
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md shadow-sm mb-2">
            <p className="font-semibold">Alice Smith</p>
            <p className="text-sm text-gray-600">
              "Loved the location and amenities. Would visit again!"
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md shadow-sm">
            <p className="font-semibold">Michael Brown</p>
            <p className="text-sm text-gray-600">
              "Host was very friendly and helpful!"
            </p>
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <Review /> {/* Keeping original reviews at old place */}
      <DeletePopup open={open} onClose={() => setOpen(false)}>
        <div className="text-center w-56">
          <FaTrash size={56} className="mx-auto text-red-500" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
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
    </div>
  );
};

export default ShowListing;
