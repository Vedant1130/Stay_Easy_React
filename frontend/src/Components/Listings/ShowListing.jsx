import React from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { delete_listing, show_listings } from "../../api";
import { useAuth } from "../../contexts/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
import DeletePopup from "../Popup/deletePopup";
import { FaTrash } from "react-icons/fa";

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
    <>
      <div className="mt-3 flex flex-col items-center">
        <h3 className="text-xl font-semibold">{listing.title}</h3>
        <div className="w-3/5 bg-white shadow-md rounded-lg overflow-hidden mt-4">
          <img
            src={listing.image}
            className="w-full h-60 object-cover"
            alt="listing_image"
          />
          <div className="p-4">
            <p className="text-gray-700">{listing.description}</p>
            <p className="text-lg font-semibold text-gray-900">
              &#8377; {listing.price}
            </p>
            <p className="text-sm text-gray-600">{listing.location}</p>
          </div>
        </div>

        {user && listing.owner === user.id && (
          <div className="flex gap-4 mt-4">
            <Link
              className="bg-colar-red text-white px-4 py-2 rounded-md hover:bg-red-700"
              to={`/listings/edit/${listing.id}`}
            >
              Edit
            </Link>
            <button
              className="bg-colar-red text-white px-4 py-2 rounded-md hover:bg-red-700"
              onClick={() => setOpen(true)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

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
    </>
  );
};

export default ShowListing;
