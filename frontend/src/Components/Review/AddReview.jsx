import React, { useState } from "react";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";

const iconColor = "#fe424d";

const customIcons = {
  1: (selected) => (
    <FrownOutlined style={{ color: selected ? iconColor : "gray" }} />
  ),
  2: (selected) => (
    <FrownOutlined style={{ color: selected ? iconColor : "gray" }} />
  ),
  3: (selected) => (
    <MehOutlined style={{ color: selected ? iconColor : "gray" }} />
  ),
  4: (selected) => (
    <SmileOutlined style={{ color: selected ? iconColor : "gray" }} />
  ),
  5: (selected) => (
    <SmileOutlined style={{ color: selected ? iconColor : "gray" }} />
  ),
};

const AddReview = () => {
  const [value, setValue] = useState(0);
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
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            className={`text-2xl ${
              num <= value ? "text-red-500" : "text-gray-400"
            }`}
            onClick={() => setValue(num)}
          >
            {customIcons[num](num <= value)}
          </button>
        ))}
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
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded-lg"
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
