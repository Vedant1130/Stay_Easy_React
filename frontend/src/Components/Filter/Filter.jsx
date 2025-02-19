import React, { useState } from "react";
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

const Filter = ({ setSearchResults }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const filters = [
    { id: 1, icon: <FaMountainCity />, label: "Iconic Cities" },
    { id: 2, icon: <FaMountain />, label: "Mountains" },
    { id: 3, icon: <FaFortAwesome />, label: "Castles" },
    { id: 4, icon: <FaPersonSwimming />, label: "Amazing Pools" },
    { id: 5, icon: <FaCampground />, label: "Camping" },
    { id: 6, icon: <FaTractor />, label: "Farms" },
    { id: 7, icon: <FaSnowflake />, label: "Arctic Pools" },
    { id: 8, icon: <FaUmbrellaBeach />, label: "Beach" },
    // { id: 9, icon: <FaPersonSkiing />, label: "Skiing" },
  ];
  const handleFilterClick = async (filterCategoryId) => {
    if (activeFilter === filterCategoryId) {
      // Reset filter to show all listings
      setActiveFilter(null);
      try {
        const allListings = await get_listings();
        setSearchResults(allListings);
      } catch (error) {
        console.error("Error fetching all listings:", error);
        showToast("Failed to load all listings.", "error");
      }
    } else {
      // Apply filter
      setActiveFilter(filterCategoryId);
      try {
        const filteredData = await filter_listings(filterCategoryId);

        if (filteredData.length === 0) {
          showToast("No listings found in this category.", "info");
        }

        setSearchResults(filteredData);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        showToast("Failed to fetch filtered listings.", "error");
      }
    }
  };
  return (
    <div className="filter-container">
      {filters.map((filter, index) => (
        <div
          className={`filter-item ${
            activeFilter === filter.category ? "active" : ""
          }`}
          key={index}
          onClick={() => handleFilterClick(filter.id)} // Set active filter and fetch data
        >
          <div className="filter-icon">{filter.icon}</div>
          <p className="filter-label">{filter.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Filter;
