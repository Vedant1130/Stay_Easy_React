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
import "./Filter.css";
import { filter_listings, get_listings } from "../../api";
import { showToast } from "../ToastNotification/ToastNotification";
import Loader from "../Loader/Loader"; // Import Loader

const Filter = ({ setSearchResults }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // Store toast message

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
    setLoading(true); // Show loader

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
        setToastMessage(null); // Clear previous message if results exist
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setToastMessage({ text: "Failed to load listings.", type: "error" });
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    if (!loading && toastMessage) {
      showToast(toastMessage.text, toastMessage.type);
      setToastMessage(null); // Reset message after showing
    }
  }, [loading, toastMessage]); // Runs when loading completes

  return (
    <div className="filter-container">
      {loading ? (
        <Loader />
      ) : (
        filters.map((filter, index) => (
          <div
            className={`filter-item ${
              activeFilter === filter.id ? "active" : ""
            }`}
            key={index}
            onClick={() => handleFilterClick(filter.id)}
          >
            <div className="filter-icon">{filter.icon}</div>
            <p className="filter-label">{filter.label}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Filter;
