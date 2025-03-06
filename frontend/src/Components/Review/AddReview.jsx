import React, { useState } from "react";
import { Rate } from "antd";

const iconColor = "#fe424d";

const AddReview = () => {
  const [comment, setComment] = useState("");

  const handleAdd = () => {
    console.log("Review Added:", { rating: value, comment });
  };

  const handleCancel = () => {
    setValue(0);
    setComment("");
  };

  return (
    // <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-md w-full max-w-md">
    <>
      <h2 className="text-xl font-semibold mb-1">Write a review</h2>
      {/* Star Rating Buttons */}
      <div className="flex gap-2 mb-1">
        <Rate allowHalf style={{ color: iconColor }} />
      </div>
      {/* Larger Textarea for Review Input */}
      <textarea
        className="w-full p-3 border rounded-lg h-48 mb-1"
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      {/* Buttons */}
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-colar-red text-white rounded-lg"
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          className="px-4 py-2 bg-slate-900 text-white rounded-lg"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </>
    // </div>
  );
};

export default AddReview;
