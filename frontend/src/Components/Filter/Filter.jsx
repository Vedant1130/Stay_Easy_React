import React, { useState, useEffect } from "react";
import {
  FaMountainCity,
  FaMountain,
  FaFortAwesome,
  FaPersonSwimming,
  FaCampground,
  FaTractor,
  FaSnowflake,
  FaUmbrellaBeach,
} from "react-icons/fa6";
import { filter_listings, get_listings } from "../../api";
import { showToast } from "../ToastNotification/ToastNotification";
import Loader from "../Loader/Loader";

const Filter = ({ setSearchResults }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const filters = [
    { id: 1, icon: <FaMountainCity />, label: "Iconic Cities" },
    { id: 2, icon: <FaMountain />, label: "Mountains" },
    { id: 3, icon: <FaFortAwesome />, label: "Castles" },
    { id: 4, icon: <FaPersonSwimming />, label: "Amazing Pools" },
    { id: 5, icon: <FaCampground />, label: "Camping" },
    { id: 6, icon: <FaTractor />, label: "Farms" },
    { id: 7, icon: <FaSnowflake />, label: "Arctic Pools" },
    { id: 8, icon: <FaUmbrellaBeach />, label: "Beach" },
  ];

  const handleFilterClick = async (filterCategoryId) => {
    setLoading(true);
    try {
      let data;
      if (activeFilter === filterCategoryId) {
        setActiveFilter(null);
        data = await get_listings();
      } else {
        setActiveFilter(filterCategoryId);
        data = await filter_listings(filterCategoryId);
      }

      setSearchResults(data);
      if (data.length === 0) {
        setToastMessage({
          text: "No listings found in this category.",
          type: "info",
        });
      } else {
        setToastMessage(null);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setToastMessage({ text: "Failed to load listings.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && toastMessage) {
      showToast(toastMessage.text, toastMessage.type);
      setToastMessage(null);
    }
  }, [loading, toastMessage]);

  return (
    <div
      className="flex space-x-2 overflow-x-auto px-6 py-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {loading ? (
        <Loader />
      ) : (
        filters.map((filter, index) => (
          <div
            className={`flex flex-col items-center cursor-pointer px-4 py-2 flex-none transition-all duration-300 snap-center ${
              activeFilter === filter.id
                ? "text-black border-b-2 border-black"
                : "text-gray-500 border-b-2 border-transparent"
            } hover:text-black`}
            key={index}
            onClick={() => handleFilterClick(filter.id)}
          >
            <div className="text-3xl">{filter.icon}</div>
            <p className="text-xs mt-1 font-medium">{filter.label}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Filter;
