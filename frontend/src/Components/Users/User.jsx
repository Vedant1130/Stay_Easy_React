import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useFormik } from "formik";
import { loginSchema, signupSchema } from "../Schema/Index";
import { useAuth } from "../../contexts/useAuth";
import { showToast } from "../ToastNotification/ToastNotification";
import { register, verifyOtp, resendOtp } from "../../api";
import { useLocation, useNavigate } from "react-router";
import OtpPopup from "../Popup/OtpPopup";
import Loader from "../Loader/Loader";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

const User = ({ onClose, onLoginSuccess }) => {
  const [isActive, setIsActive] = useState(false);
  const [otpPopupOpen, setOtpPopupOpen] = useState(false); // ✅ Manage OTP popup visibility
  const { login_user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otp, setOtp] = useState(""); // ✅ Store OTP input
  const [registeredEmail, setRegisteredEmail] = useState(""); // ✅ Store email for OTP verification
  const [isResending, setIsResending] = useState(false); // ✅ Track OTP resend state
  const [isRegistering, setIsRegistering] = useState(false);

  // Get last attempted page or default to home
  const from = location.state?.from?.pathname || "/";

  // Login
  const loginFormik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      try {
        const success = await login_user(
          username,
          password,
          setOtpPopupOpen,
          setRegisteredEmail
        );
        if (success) {
          navigate(from, { replace: true });
        }
      } catch (error) {
        showToast("Login failed. Please try again.", "error");
      }
      setSubmitting(false);
    },
  });

  // SignUp
  const signupFormik = useFormik({
    initialValues: { username: "", email: "", password: "" },
    validationSchema: signupSchema,
    onSubmit: async ({ username, email, password }, { setSubmitting }) => {
      setIsRegistering(true);
      try {
        const response = await register(username, email, password);
        if (response.success) {
          showToast("Signup successful! OTP sent to your email.", "success");
          setRegisteredEmail(email);
          setOtpPopupOpen(true);
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
        showToast("An error occurred. Please try again.", "error");
      }
      setIsRegistering(false);
      setSubmitting(false);
    },
  });

  const handleOtpVerification = async () => {
    if (!registeredEmail) {
      showToast("Error: Registered email is missing!", "error");
      console.error("❌ `registeredEmail` is missing before OTP verification.");
      return;
    }

    if (!otp) {
      showToast("Please enter the OTP", "error");
      return;
    }

    console.log("📩 Email Sent to API:", registeredEmail);
    console.log("🔢 OTP Entered:", otp);

    setIsVerifyingOtp(true);

    try {
      const response = await verifyOtp(registeredEmail, otp);
      console.log("🔍 OTP Verification Response:", response);

      if (response?.message?.includes("User already verified")) {
        showToast("User is already verified! Proceed to login.", "info");
        setOtpPopupOpen(false);
      } else if (response?.message?.includes("Email verified successfully")) {
        showToast("OTP verified! Redirecting...", "success");
        setOtpPopupOpen(false);
        setIsActive(false);
      } else {
        showToast(
          response?.error || response?.message || "Invalid OTP. Try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("🚨 OTP Verification Failed:", error);
      showToast("An error occurred while verifying OTP.", "error");
    }

    setIsVerifyingOtp(false);
};

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await resendOtp(registeredEmail);

      // ✅ Check if the message confirms success, even if success is false
      if (response?.success || response?.message?.includes("OTP sent")) {
        showToast(
          response.message || "OTP Resent! Check your email.",
          "success"
        );
      } else {
        showToast(
          response.error || "Failed to resend OTP. Try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Resend OTP Error:", error);
      showToast("An error occurred. Please try again.", "error");
    }
    setIsResending(false);
  };

  return (
    <>
      {isRegistering && <Loader />}
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
            <form className="w-full" onSubmit={signupFormik.handleSubmit}>
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
                  disabled={isRegistering}
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
          {/* OTP Popup */}
          <OtpPopup open={otpPopupOpen} onClose={() => setOtpPopupOpen(false)}>
            <div className="p-6 rounded-lg w-96 ">
              <h2 className="text-2xl text-center font-bold text-gray-900 mb-2">
                User Verification
              </h2>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Enter the 6-digit code sent to your email. This code is valid
                for the next 10 minutes.
              </p>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-3 mb-6">
                {Array(6)
                  .fill("")
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={otp[index] || ""}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[index] = e.target.value;

                        // Move to next input if a digit is entered
                        if (e.target.value && index < 5) {
                          document
                            .getElementById(`otp-input-${index + 1}`)
                            ?.focus();
                        }

                        setOtp(newOtp.join(""));
                      }}
                      onKeyDown={(e) => {
                        // Move to previous input on backspace
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          document
                            .getElementById(`otp-input-${index - 1}`)
                            ?.focus();
                        }
                      }}
                      id={`otp-input-${index}`}
                    />
                  ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleOtpVerification}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md transition-all"
              >
                Verify OTP
              </button>

              {/* Resend OTP */}
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  Didn't get the code?{" "}
                  <button
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-blue-500 font-medium hover:underline"
                  >
                    {isResending ? "Resending..." : "Resend code"}
                  </button>
                </p>
              </div>
            </div>
          </OtpPopup>
        </div>
      </div>
    </>
  );
};

export default User;
