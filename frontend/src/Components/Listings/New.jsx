import { useFormik } from "formik";
import { newSchema } from "../Schema/Index";
import { useNavigate } from "react-router";
import { create_listing, get_categories } from "../../api";
import { useState, useEffect } from "react";
import { showToast } from "../ToastNotification/ToastNotification";

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
      onSubmit: async (values, { setSubmitting }) => {
        try {
          await create_listing(
            values.title,
            values.description,
            values.image,
            values.price,
            values.country,
            values.location,
            Number(values.category)
          );
          showToast("Listing created successfully!", "success");
          navigate("/");
        } catch (error) {
          showToast("Failed to create listing. Try again!", "error");
        } finally {
          setSubmitting(false);
        }
      },
    });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get_categories();
        setCategories(data);
      } catch (error) {
        showToast("Error fetching categories", "error");
      }
    };

    fetchCategories();
  }, []);
  return (
    <>
      {/* // <div className="h-screen flex justify-center items-center bg-gray-100">
    //   <div className="relative w-full max-w-4xl bg-white p-10 shadow-lg rounded-lg flex flex-col justify-center items-center text-center"> */}
      <h3 className="text-3xl font-bold mb-6 text-center mt-6">
        Create your listing
      </h3>
      <form
        onSubmit={handleSubmit}
        className="w-full flex justify-center flex-col"
      >
        <div className="relative flex flex-col justify-center items-center w-full mb-4">
          <div className="relative w-10/12">
            <input
              name="title"
              placeholder="Title"
              type="text"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              value={values.title}
              onChange={handleChange}
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-sm w-10/12 text-left">
              {errors.title}
            </p>
          )}
        </div>
        <div className="relative flex flex-col justify-center items-center w-full mb-4">
          <div className="relative w-10/12">
            <textarea
              name="description"
              placeholder="Description"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              value={values.description}
              onChange={handleChange}
            ></textarea>
          </div>
          {errors.description && (
            <p className="text-red-500 text-sm w-10/12 text-left">
              {errors.description}
            </p>
          )}
        </div>
        <div className="relative flex flex-col justify-center items-center w-full mb-4">
          <div className="relative w-10/12">
            <input
              name="image"
              type="file"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              onChange={(event) =>
                setFieldValue("image", event.target.files[0])
              }
            />
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm w-10/12 text-left">
              {errors.image}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-10/12 mx-auto">
          <div>
            <input
              name="price"
              type="number"
              placeholder="Price"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              value={values.price}
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>
          <div>
            <input
              name="country"
              type="text"
              placeholder="Country"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              value={values.country}
              onChange={handleChange}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            )}
          </div>
        </div>
        <div className="relative flex flex-col justify-center items-center w-full my-4">
          <div className="relative w-10/12">
            <input
              name="location"
              type="text"
              placeholder="Location"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              value={values.location}
              onChange={handleChange}
            />
          </div>
          {errors.location && (
            <p className="text-red-500 text-sm w-10/12 text-left">
              {errors.location}
            </p>
          )}
        </div>
        <div className="relative flex flex-col justify-center items-center w-full ">
          <div className="relative w-10/12">
            <select
              name="category"
              className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
              value={values.category}
              onChange={handleChange}
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="text-red-500 text-sm w-10/12 text-left">
              {errors.category}
            </p>
          )}
        </div>
        <div className="relative flex justify-center items-center w-full">
          <button
            type="submit"
            className="w-36 mt-6 mb-6 bg-red-500 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-600 transition"
          >
            Add
          </button>
        </div>
      </form>
      {/* </div>
    </div> */}
    </>
  );
};

export default New;
