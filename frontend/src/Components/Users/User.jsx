import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useFormik } from "formik";
import { loginSchema, signupSchema } from "../Schema/Index";
import { useAuth } from "../../contexts/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
import { register } from "../../api";
import { useLocation, useNavigate } from "react-router";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

const User = ({ onClose, onLoginSuccess }) => {
  const [isActive, setIsActive] = useState(false);
  const { login_user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get last attempted page or default to home
  const from = location.state?.from?.pathname || "/";

  // Login
  const loginFormik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      try {
        const success = await login_user(username, password);
        if (success) {
          navigate(from, { replace: true }); // ✅ Redirect back to last attempted page
        }
      } catch (error) {
        console.error("Login failed", error);
        showToast("Login failed. Please try again.", "error");
      }
      setSubmitting(false);
    },
  });

  // SignUp
  const signupFormik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async ({ username, email, password }, { setSubmitting }) => {
      try {
        const response = await register(username, email, password);
        if (response.success) {
          showToast("Signup successful! Please log in.", "success");
          setIsActive(false); // Switch to login panel after signup
        } else {
          const errorMessages = Object.values(response.errors || {})
            .flat()
            .join(" ");
          showToast(
            errorMessages || "Signup failed. Please try again.",
            "error"
          );
        }
      } catch (error) {
        const errorMessages = Object.values(error.response?.data || {})
          .flat()
          .join(" ");
        showToast(
          errorMessages || "An error occurred. Please try again.",
          "error"
        );
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-300">
      <div
        className={`relative w-full h-full bg-white shadow-2xl overflow-hidden transition-all duration-[1.8s] ${
          isActive ? "active" : ""
        }`}
      >
        {/* {/ Login Form /} */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center text-center p-10 transition-all duration-700 ${
            isActive
              ? "translate-x-full opacity-0 "
              : "translate-x-0 opacity-100 "
          }`}
        >
          <h1 className="text-4xl font-bold mb-6">Login</h1>
          <form
            className="w-full flex justify-center flex-col"
            onSubmit={loginFormik.handleSubmit}
          >
            {/* {/ Username /} */}
            <div className="relative flex flex-col justify-center items-center w-full">
              <div className="relative w-10/12">
                <input
                  name="username"
                  placeholder="Username"
                  type="text"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={loginFormik.values.username}
                  onChange={loginFormik.handleChange}
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {loginFormik.errors.username && (
                  <p className="text-red-500 text-sm">
                    {loginFormik.errors.username}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Password /} */}
            <div className="relative flex flex-col justify-center items-center w-full my-6">
              <div className="relative w-10/12">
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                />
                <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {loginFormik.errors.password && (
                  <p className="text-red-500 text-sm">
                    {loginFormik.errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Login Button /} */}
            <div className="relative flex justify-center items-center w-full">
              <button
                type="submit"
                className="w-10/12 bg-colar-red text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-600 transition"
              >
                {"Login"}
              </button>
            </div>
          </form>
        </div>

        {/* {/ Register Form /} */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center text-center p-10 transition-all duration-700 ${
            isActive
              ? "translate-x-0 opacity-100 visible"
              : "-translate-x-full opacity-0 invisible"
          }`}
        >
          <h1 className="text-4xl font-bold mb-6">Register</h1>
          <form className="w-full">
            {/* {/ Username /} */}
            <div className="relative flex flex-col justify-center items-center w-full">
              <div className="relative w-10/12">
                <input
                  name="username"
                  placeholder="Username"
                  type="text"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={signupFormik.values.username}
                  onChange={signupFormik.handleChange}
                />
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {signupFormik.errors.username && (
                  <p className="text-red-500 text-sm">
                    {signupFormik.errors.username}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Email /} */}
            <div className="relative flex flex-col justify-center items-center w-full my-6">
              <div className="relative w-10/12">
                <input
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={signupFormik.values.email}
                  onChange={signupFormik.handleChange}
                />
                <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {signupFormik.errors.email && (
                  <p className="text-red-500 text-sm">
                    {signupFormik.errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Password /} */}
            <div className="relative flex flex-col justify-center items-center w-full my-6">
              <div className="relative w-10/12">
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="w-full p-3 bg-gray-200 rounded-lg text-lg focus:outline-none"
                  value={signupFormik.values.password}
                  onChange={signupFormik.handleChange}
                />
                <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
              </div>
              <div className="w-10/12 text-left">
                {signupFormik.errors.password && (
                  <p className="text-red-500 text-sm">
                    {signupFormik.errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* {/ Register Button /} */}
            <div className="relative flex justify-center items-center w-full">
              <button
                type="submit"
                className="w-10/12 bg-colar-red text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-600 transition"
              >
                {"Register"}
              </button>
            </div>
          </form>
        </div>

        {/* {/ Toggle Panel /} */}
        <div
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center overflow-hidden"
          style={{ pointerEvents: "none" }}
        >
          <div
            className={`absolute top-0 left-0 w-full h-full bg-colar-red rounded-sm transition-all duration-[1.8s] ${
              isActive ? "translate-x-1/2" : "-translate-x-1/2"
            }`}
          ></div>
          <div
            className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center text-white transition-all duration-700 ${
              isActive ? "-translate-x-full opacity-0" : "opacity-100"
            }`}
            style={{ pointerEvents: isActive ? "none" : "auto" }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome to StayEasy!</h1>
            <p className="text-center mb-6">
              Find your perfect stay or list your home!
            </p>
            <button
              onClick={() => setIsActive(true)}
              className="border-2 border-white px-6 py-2 rounded-lg text-lg hover:bg-white hover:text-colar-red transition"
              style={{ pointerEvents: "auto" }}
            >
              Register
            </button>
          </div>
          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center text-white transition-all duration-700 ${
              isActive ? "opacity-100" : "translate-x-full opacity-0"
            }`}
            style={{ pointerEvents: isActive ? "auto" : "none" }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-center mb-6">Already have an account?</p>
            <button
              onClick={() => setIsActive(false)}
              className="border-2 border-white px-6 py-2 rounded-lg text-lg hover:bg-white hover:text-colar-red transition"
              style={{ pointerEvents: "auto" }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
