import React from "react";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { Rate } from "antd";

const iconColor = "#fe424d"; // Yellow for full stars
const emptyColor = "#d9d9d9"; // Gray for empty stars

const Review = () => {
  // Mock review data (replace with real API data)
  const reviewCounts = { 5: 100, 4: 7, 3: 0, 2: 0, 1: 0 };
  const totalReviews = Object.values(reviewCounts).reduce((a, b) => a + b, 0);

  // Calculate average rating
  const averageRating = totalReviews
    ? Object.entries(reviewCounts).reduce(
        (sum, [rating, count]) => sum + rating * count,
        0
      ) / totalReviews
    : 0;

  // Function to get custom icons for stars
  const getCustomIcon = (index) => {
    const fullStars = Math.floor(averageRating);
    const isHalf = averageRating - fullStars >= 0.5 && index === fullStars;

    const icons = {
      1: FrownOutlined,
      2: FrownOutlined,
      3: MehOutlined,
      4: SmileOutlined,
      5: SmileOutlined,
    };

    const IconComponent = icons[index + 1];

    return (
      <span
        style={{
          position: "relative",
          display: "inline-block",
          width: "24px",
          height: "24px",
          color: isHalf
            ? "transparent"
            : index < averageRating
            ? iconColor
            : emptyColor,
        }}
      >
        <IconComponent
          style={{
            fontSize: "24px",
            position: "absolute",
            left: 0,
            top: 0,
            color: iconColor,
            clipPath: isHalf ? "inset(0 50% 0 0)" : "none",
          }}
        />
        {isHalf && (
          <IconComponent
            style={{
              fontSize: "24px",
              position: "absolute",
              left: 0,
              top: 0,
              color: emptyColor,
              clipPath: "inset(0 0 0 50%)",
            }}
          />
        )}
      </span>
    );
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg w-full max-w-sm mx-auto text-center">
      {/* Average Rating */}
      <h2 className="text-4xl font-bold">{averageRating.toFixed(1)}</h2>

      {/* Star Rating with Custom Icons */}
      <div className="flex justify-center my-2 text-3xl">
        <Rate
          value={averageRating}
          disabled
          allowHalf
          character={({ index }) => getCustomIcon(index)}
        />
      </div>

      {/* Review Summary Bars */}
      <div className="space-y-2 mt-3 text-left">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <span className="w-6 text-right">{rating}</span>
            <div className="w-full bg-gray-300 h-2 rounded-lg">
              <div
                className="h-full rounded-lg"
                style={{
                  width: totalReviews
                    ? `${(reviewCounts[rating] / totalReviews) * 100}%`
                    : "0%",
                  backgroundColor: iconColor,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Reviews */}
      <p className="text-gray-600 text-center mt-2">{totalReviews} reviews</p>
    </div>
  );
};

export default Review;
