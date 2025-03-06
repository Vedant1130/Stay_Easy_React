import React from "react";

import { Rate } from "antd";
import AddReview from "./AddReview";

const iconColor = "#fe424d"; 
const Review = () => {
  const reviewCounts = { 5: 100, 4: 0, 3: 5, 2: 0, 1: 0 };
  const totalReviews = Object.values(reviewCounts).reduce((a, b) => a + b, 0);
  const averageRating = totalReviews
    ? Object.entries(reviewCounts).reduce(
        (sum, [rating, count]) => sum + rating * count,
        0
      ) / totalReviews
    : 0;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
      {/* Left Side: Review Summary */}
      <div className="w-full md:w-1/2">
        <h2 className="text-4xl font-bold">{averageRating.toFixed(2)}</h2>
        <div className="flex justify-start text-3xl">
          <Rate
            allowHalf
            style={{ color: iconColor }}
            disabled
            value={averageRating}
          />
        </div>

        <div className="space-y-2 mt-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-0">
              <span className="w-6 space-x-4">{rating}</span>
              <div className="w-3/4 bg-gray-300 h-1 rounded-lg">
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
        <p className="text-gray-600 mt-2">{totalReviews} reviews</p>
      </div>

      {/* Right Side: Add Review Form */}
      <div className="w-full md:w-full">
        <AddReview />
      </div>
    </div>
  );
};

export default Review;
