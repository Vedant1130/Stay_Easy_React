import React from "react";
import sampleListings from "./data";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { editSchema } from "../Schema/Index";
import { useEffect } from "react";
import { useState } from "react";
import { show_listings, update_listing } from "../../api";

const Edit = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const getListing = async () => {
      const data = await show_listings(id);
      setListing(data);
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
    // onSubmit: () => {
    //   nav("/");
    // },
  });

  const handleEdit = async ({
    id,
    title,
    description,
    image,
    price,
    country,
    location,
  }) => {
    const success = await update_listing(
      id,
      title,
      description,
      image,
      price,
      country,
      location
    );
    if (success) {
      nav("/");
    }
  };

  return (
    <>
      <div className="row mt-3">
        <div className="col-8 offset-2">
          <h3>Edit your listing</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                name="title"
                value={values.title}
                type="text"
                className="form-control"
                onChange={handleChange}
              />
              {
                <p className="form-error" style={{ color: "red" }}>
                  {errors.title}
                </p>
              }
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                name="description"
                value={values.description}
                type="text"
                className="form-control"
                onChange={handleChange}
              ></textarea>
              {
                <p className="form-error" style={{ color: "red" }}>
                  {errors.description}
                </p>
              }
            </div>
            <div className="mb-3 d-flex align-items-center flex-column flex-md-row text-center">
              Original Image Uploaded:
              <img
                src={values.image}
                className="img-fluid mt-2 mt-md-0 ms-md-3"
                style={{
                  width: "200px",
                  height: "200px",
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Upload New Image
              </label>
              <input
                onChange={(event) =>
                  setFieldValue("image", event.target.files[0])
                }
                name="image"
                type="file"
                className="form-control"
              />
            </div>
            <div className="row">
              <div className="mb-3 col-md-4">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  name="price"
                  value={values.price}
                  type="number"
                  className="form-control"
                  onChange={handleChange}
                />
                {
                  <p className="form-error" style={{ color: "red" }}>
                    {errors.price}
                  </p>
                }
              </div>
              <div className="mb-3 col-md-8">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <input
                  name="country"
                  value={values.country}
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                />
                {
                  <p className="form-error" style={{ color: "red" }}>
                    {errors.country}
                  </p>
                }
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                name="location"
                value={values.location}
                type="text"
                className="form-control"
                onChange={handleChange}
              />
              {
                <p className="form-error" style={{ color: "red" }}>
                  {errors.location}
                </p>
              }
            </div>
            <button
              onClick={() => {
                handleEdit({
                  id,
                  title: values.title,
                  description: values.description,
                  image: values.image,
                  price: values.price,
                  country: values.country,
                  location: values.location,
                });
              }}
              type="button"
              className="btn btn-dark edit-btn mb-3"
            >
              Edit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;
