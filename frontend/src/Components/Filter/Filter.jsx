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
  FaPersonSkiing,
} from "react-icons/fa6";
import "./Filter.css";
import { filter_listings } from "../../api";

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
    { id: 9, icon: <FaPersonSkiing />, label: "Skiing" },
  ];
  const handleFilterClick = async (filterCategoryId) => {
    setActiveFilter(filterCategoryId); // Update the active filter

    try {
      // Fetch filtered listings from the backend API
      const filteredData = await filter_listings(filterCategoryId);
      setSearchResults(filteredData); // Pass the fetched data to the parent component
    } catch (error) {
      console.error("Error fetching filtered data:", error);
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
