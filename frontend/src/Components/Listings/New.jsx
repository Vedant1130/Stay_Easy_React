import { useFormik } from "formik";
import { newSchema } from "../Schema/Index";
import { useNavigate } from "react-router";
import { create_listing, filter_listings, get_categories } from "../../api";
import { useState, useEffect } from "react";

const initialValues = {
  title: "",
  description: "",
  image: null,
  price: "",
  country: "",
  location: "",
  category: "",
};
const New = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: initialValues,
      validationSchema: newSchema,
      onSubmit: async (values) => {
        await create_listing(
          values.title,
          values.description,
          values.image,
          values.price,
          values.country,
          values.location,
          Number(values.category)
        );
        navigate("/");
      },
    });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get_categories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="row mt-3">
      <div className="col-8 offset-2">
        <h3>Create your listing</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              name="title"
              onChange={handleChange}
              value={values.title}
              type="text"
              className="form-control"
              placeholder="Enter Title"
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
              onChange={handleChange}
              value={values.description}
              placeholder="Enter Description"
              type="text"
              className="form-control"
            ></textarea>
            {
              <p className="form-error" style={{ color: "red" }}>
                {errors.description}
              </p>
            }
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Upload Listing Image
            </label>
            <input
              name="image"
              onChange={(event) =>
                setFieldValue("image", event.target.files[0])
              }
              type="file"
              className="form-control"
            />
            {
              <p className="form-error" style={{ color: "red" }}>
                {errors.image}
              </p>
            }
          </div>
          <div className="row">
            <div className="mb-3 col-md-4">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                name="price"
                onChange={handleChange}
                value={values.price}
                type="number"
                placeholder="Enter Price"
                className="form-control"
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
                onChange={handleChange}
                value={values.country}
                type="text"
                placeholder="Enter Country"
                className="form-control"
              />
              {
                <p className="form-error" style={{ color: "red" }}>
                  {errors.country}
                </p>
              }
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="location">Location</label>
            <input
              name="location"
              onChange={handleChange}
              value={values.location}
              type="text"
              placeholder="Enter Location"
              className="form-control"
            />
            {
              <p className="form-error" style={{ color: "red" }}>
                {errors.location}
              </p>
            }
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                name="category"
                onChange={handleChange}
                value={values.category}
                className="form-control"
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="form-error" style={{ color: "red" }}>
                  {errors.category}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-dark add-btn mb-3"
            style={{ backgroundColor: "#fe424d", border: "None" }}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default New;
