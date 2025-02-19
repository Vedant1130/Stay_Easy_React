import React from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import "./ShowListing.css";
import { useState, useEffect } from "react";
import { delete_listing, show_listings } from "../../api";
import { useAuth } from "../../contexts/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
const ShowListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState([]);
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
      <div className="row mt-3">
        <div className="col-8 offset-3">
          <h3>{listing.title}</h3>
        </div>
        <div className="card col-6 offset-3 show-card listing-card">
          <img
            src={listing.image} // Ensure listing.image is the URL, if not use listing.image.url
            className="card-img-top show-img"
            alt="listing_image"
          />
          <div className="card-body">
            {/* <p className="card-text">Owned by:{listing.owner} </p> */}
            <p className="card-text">{listing.description}</p>
            <p className="card-text">&#8377; {listing.price}</p>
            <p className="card-text">{listing.location}</p>{" "}
            {/* Assuming location is a valid field */}
          </div>
        </div>

        {/* Show buttons only if the logged-in user is the owner */}
        {user && listing.owner === user.id && (
          <div className="btns mb-3">
            <Link
              className="btn btn-dark offset-3 edit-btn"
              to={`/listings/edit/${listing.id}`}
            >
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-dark delete-btn">
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowListing;
