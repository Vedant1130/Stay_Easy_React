import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get_listings } from "../../api";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

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
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 mt-6 px-2"
    >
      {listingsToShow.map((listing) => {
        const priceWithGST = Math.round(listing.price * 1.18);
        return (
          <motion.div variants={item} key={listing.id} className="group cursor-pointer">
            <Link to={`/listings/${listing.id}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm mb-4 bg-gray-100">
                <img
                  src={listing.image}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  alt={listing.title}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-brand-dark shadow-sm">
                  ★ {listing.reviews?.length > 0 ? (listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / listing.reviews.length).toFixed(1) : "New"}
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-brand-dark truncate pr-4">{listing.title}</h2>
                </div>
                <p className="text-brand-dark/60 text-sm mt-0.5 mb-1">{listing.location}, {listing.country}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-semibold text-brand-dark text-lg">
                    ₹{isTaxEnabled ? priceWithGST.toLocaleString() : listing.price.toLocaleString()}
                  </span>
                  <span className="text-brand-dark/60 text-sm">night {isTaxEnabled && " (inc. taxes)"}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Listing;
