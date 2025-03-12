import React, { useEffect, useState } from "react";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 px-4">
      {listingsToShow.map((listing) => {
        const priceWithGST = Math.round(listing.price * 1.18);
        return (
          <div key={listing.id} className="flex justify-center items-center">
            {/* Flip Card Container */}
            <div className="group w-[390px] h-[390px]  perspective-1000">
              {/* Flip Card Wrapper */}
              <div className="relative w-full h-full  transition-transform duration-1000 preserve-3d group-hover:rotate-y-180">
                {/* Front Side */}
                <div className="absolute w-full h-full rounded-3xl overflow-hidden bg-white flex items-center justify-center backface-hidden">
                  <img
                    src={listing.image}
                    className="w-full h-96 object-cover rounded-3xl"
                    alt="Listing"
                  />
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full text-center rounded-3xl flex flex-col justify-center items-center bg-gray-400 bg-opacity-50 text-[#0F1823] rotate-y-180 backface-hidden">
                  <h2 className="text-2xl font-bold my-1">{listing.title}</h2>
                  <p className="text-lg my-1">{listing.location}</p>$
                  {isTaxEnabled ? priceWithGST : listing.price}
                  {/* View Listing Button */}
                  <Link
                    to={`/listings/${listing.id}`}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    View Listing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Listing;
