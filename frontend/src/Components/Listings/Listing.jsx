import React, { useEffect, useState } from "react";
import "./Listing.css";
import { Link } from "react-router-dom";
import { get_listings } from "../../api";

const Listing = ({ searchResults, isTaxEnabled }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsData = await get_listings();
        setListings(listingsData);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };
    fetchListings();
  }, []);

  const listingsToShow =
    searchResults && searchResults.length > 0 ? searchResults : listings;

  return (
    <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-3">
      {listingsToShow.map((listing, index) => {
        const priceWithGST = Math.round(listing.price * 1.18); // Calculating price with GST

        return (
          <Link
            key={index}
            to={`/listings/${listing.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="card cols listing-card">
              <img
                src={listing.image}
                className="card-img-top"
                alt="listing_image"
                style={{ height: "20rem" }}
              />

              <div className="card-img-overlay"></div>
              <div className="card-body">
                <p className="card-text">
                  <b>{listing.title}</b> <br />
                  &#8377;{" "}
                  {isTaxEnabled
                    ? `${priceWithGST.toLocaleString("en-IN")} `
                    : `${listing.price.toLocaleString("en-IN")}`}{" "}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Listing;
