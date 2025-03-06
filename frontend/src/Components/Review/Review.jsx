import React, { useEffect, useState } from "react";
import { Rate } from "antd";
import AddReview from "./AddReview";
import { getListingReviewsSummary } from "../../api";
import Loader from "../Loader/Loader";

const iconColor = "#fe424d";

const Review = ({ id, onReviewAdded }) => {
  const [reviewData, setReviewData] = useState({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching review summary...");
    const loadReviews = async () => {
      try {
        const data = await getListingReviewsSummary(id);
        console.log("Updated Review Summary Data:", data);// Debugging
        if (data.success) {
          setReviewData(data);
        } else {
          setError("Failed to load reviews.");
        }
      } catch (err) {
        setError(err.message || "Error loading reviews.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [id,onReviewAdded]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  const { average_rating, total_reviews, rating_distribution } = reviewData;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
      {/* Left Side: Review Summary */}
      <div className="w-full md:w-1/2">
        <h2 className="text-4xl font-bold">{average_rating.toFixed(1)}</h2>
        <div className="flex justify-start text-3xl">
          <Rate
            allowHalf
            style={{ color: iconColor }}
            disabled
            value={average_rating}
          />
        </div>

        <div className="space-y-2 mt-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-0">
              <span className="w-6">{rating}</span>
              <div className="w-3/4 bg-gray-300 h-1 rounded-lg">
                <div
                  className="h-full rounded-lg"
                  style={{
                    width: total_reviews
                      ? `${
                          (rating_distribution[rating] / total_reviews) * 100
                        }%`
                      : "0%",
                    backgroundColor: iconColor,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-gray-600 mt-2">{total_reviews} reviews</p>
      </div>

      {/* Right Side: Add Review Form */}
      <div className="w-full md:w-full">
        <AddReview
          id={id}
          onReviewAdded={() => {
            console.log("Review added! Refreshing...");
            onReviewAdded(); // Ensure this is getting called
          }}
         />
        {/* <-- Refresh the component when a review is added */}
      </div>
    </div>
  );
};

export default Review;
