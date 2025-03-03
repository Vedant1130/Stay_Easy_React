import React from "react";
import sampleListings from "./data";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { editSchema } from "../Schema/Index";
import { useEffect, useState } from "react";
import { show_listings, update_listing } from "../../api";
import { showToast } from "../ToastNotification/ToastNotification";

const Edit = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const getListing = async () => {
      try {
        const data = await show_listings(id);
        setListing(data);
      } catch (error) {
        showToast("Error fetching listing data!", "error");
      }
    };
    getListing();
  }, [id]);

  const initialValues = {
    title: listing?.title || "",
    description: listing?.description || "",
    image: listing?.image || "",
    price: listing?.price || "",
    country: listing?.country || "",
    location: listing?.location || "",
  };
  const { values, errors, handleChange, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: editSchema,
  });

  const handleEdit = async () => {
    try {
      const success = await update_listing(id, values);
      if (success) {
        showToast("Listing updated successfully!", "success");
        nav("/");
      } else {
        showToast("Failed to update listing. Try again!", "error");
      }
    } catch (error) {
      showToast("Something went wrong!", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h3 className="text-3xl font-bold mb-6 text-center mt-6">
        Edit your listing
      </h3>
      <form>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-semibold mb-1">
              Title
            </label>
            <input
              name="title"
              value={values.title}
              type="text"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={values.description}
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none h-32"
              onChange={handleChange}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div>
            <span className="font-semibold">Original Image Uploaded:</span>
            <img
              src={values.image}
              className="mt-2 w-48 h-48  max-w-xs object-cover rounded-lg"
              alt="Uploaded Preview"
            />
          </div>
          <div>
            <label htmlFor="image" className="block font-semibold mb-1">
              Upload New Image
            </label>
            <input
              onChange={(event) =>
                setFieldValue("image", event.target.files[0])
              }
              name="image"
              type="file"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block font-semibold mb-1">
                Price
              </label>
              <input
                name="price"
                value={values.price}
                type="number"
                className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                onChange={handleChange}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
            <div>
              <label htmlFor="country" className="block font-semibold mb-1">
                Country
              </label>
              <input
                name="country"
                value={values.country}
                type="text"
                className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                onChange={handleChange}
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block font-semibold mb-1">
              Location
            </label>
            <input
              name="location"
              value={values.location}
              type="text"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              onChange={handleChange}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleEdit}
              type="button"
              className="w-36 mt-4 bg-red-500 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-600 transition"
            >
              Edit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit;
