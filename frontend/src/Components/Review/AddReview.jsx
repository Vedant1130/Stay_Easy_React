import React, { useState } from "react";
import { Rate } from "antd";
import { addReview } from "../../api";
import { showToast } from "../ToastNotification/ToastNotification";
import Loader from "../Loader/Loader";

const iconColor = "#fe424d";

const AddReview = ({ id, onReviewAdded }) => {
  // <-- Ensure `onReviewAdded` is received
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!comment.trim()) {
      showToast("Comment cannot be empty!", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await addReview(id, rating, comment);
      console.log("Review API Response:", response); // Debugging

      if (response && response.success) {
        showToast("Review added successfully!", "success");
        setComment("");
        if (onReviewAdded) {
          onReviewAdded(); // This will refresh the listing page
        }
      } else {
        showToast("Failed to add review. Please try again.", "error");
      }
    } catch (error) {
      showToast("Something went wrong!", "error");
      console.error("Add Review Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-1">Write a review</h2>
      <div className="flex gap-2 mb-1">
        <Rate
          allowHalf
          style={{ color: iconColor }}
          value={rating}
          onChange={setRating}
        />
      </div>
      <textarea
        className="w-full p-3 border rounded-lg h-48 mb-1"
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-colar-red text-white rounded-lg"
          onClick={handleAdd}
          disabled={loading}
        >
          Add {loading && <Loader />}
        </button>
        <button
          className="px-4 py-2 bg-slate-900 text-white rounded-lg"
          onClick={() => {
            setRating(0);
            setComment("");
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default AddReview;
