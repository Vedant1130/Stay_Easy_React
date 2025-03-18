import axios from "axios";
// axios.defaults.withCredentials = true;

const LISTING_URL = " http://127.0.0.1:8000/Listings/";
const REVIEW_URL = " http://127.0.0.1:8000/Reviews/";
const LOGIN_URL = `${LISTING_URL}login/`;
const LOGOUT_URL = `${LISTING_URL}logout/`;
const REFRESH_URL = `${LISTING_URL}token/refresh/`;
const GET_LISTINGS = `${LISTING_URL}home/`;
const GET_CATEGORIES_URL = `${LISTING_URL}categories/`;
const SHOW_LISTINGS = `${LISTING_URL}show/`;
const CREATE_LISTINGS = `${LISTING_URL}create-listing/`;
const SEARCH_URL = `${LISTING_URL}search/`;
const FILTER_URL = `${LISTING_URL}filter/`;
const AUTH_URL = `${LISTING_URL}authenticated/`;
const REGISTER_URL = `${LISTING_URL}register/`;
const UPDATE_URL = `${LISTING_URL}update/`;
const DELETE_URL = `${LISTING_URL}delete/`;
const VERIFY_OTP = `${LISTING_URL}verify-otp/`;
const RESEND_OTP = `${LISTING_URL}resend-otp/`;
const CREATE_PAYMENT = `${LISTING_URL}payment/create/`;
const VERIFY_PAYMENT = `${LISTING_URL}payment/verify/`;

const REVIEW_SUMMARY = `${REVIEW_URL}reviews-summary/`;
const ADD_REVIEW = `${REVIEW_URL}create/`;
const DELETE_REVIEW = `${REVIEW_URL}delete/`;

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      LOGIN_URL,
      { username, password },
      {
        withCredentials: true, // Required for cookies to be sent/received
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        email: response.data.email,
      };
    } else {
      console.error("❌ Login Failed:", response.data);
      return {
        success: false,
        message: response.data?.message || "Login failed",
      };
    }
  } catch (error) {
    console.error("❌ Login Error:", error);

    if (error.response) {
      // Handle specific backend errors
      if (
        error.response.status === 403 &&
        error.response.data?.message === "Email not verified"
      ) {
        return {
          success: false,
          message: "Email not verified",
          email: error.response.data?.data?.email,
        };
      }
      return {
        success: false,
        message: error.response.data?.message || "Login failed",
      };
    } else if (error.request) {
      // No response received
      return {
        success: false,
        message: "No response from server. Please try again.",
      };
    } else {
      // Request setup error
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  }
};

export const get_listings = async () => {
  const response = await axios.get(GET_LISTINGS, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const show_listings = async (id) => {
  const response = await axios.get(`${SHOW_LISTINGS}${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const refresh_token = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axios.post(
      REFRESH_URL,
      { refresh: refreshToken },
      { withCredentials: true }
    );
    if (response.data.success) {
      localStorage.setItem("access_token", response.data.access);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const create_listing = async (
  title,
  description,
  image,
  price,
  country,
  location,
  category
) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("country", country);
    formData.append("location", location);
    formData.append("category", category);
    const token = localStorage.getItem("access_token");

    const response = await axios.post(CREATE_LISTINGS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error);

    return await call_refresh(error, () =>
      axios.post(CREATE_LISTINGS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
    );
  }
};

const call_refresh = async (error, retryFunc) => {
  if (error.response && error.response.status === 401) {
    const tokenRefreshed = await refresh_token();
    if (tokenRefreshed) {
      try {
        const retryResponse = await retryFunc();
        return retryResponse.data;
      } catch (retryError) {
        console.error("Retry request failed:", retryError);
        return null;
      }
    }
  }
  return null;
};

export const is_authenticated = async () => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No access token found in localStorage");
      return false;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(AUTH_URL, {}, { headers });

    return response.data;
  } catch (error) {
    console.error(
      "Authentication check failed:",
      error.response?.data || error.message
    );
    return false;
  }
};

export const logout = async () => {
  try {
    await axios.post(LOGOUT_URL, {}, { withCredentials: true });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return true;
  } catch (error) {
    return false;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(
      REGISTER_URL,
      { username, email, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    return { success: true, message: response.data.message }; // ✅ Return success
  } catch (error) {
    return {
      success: false,
      errors: error.response?.data || {
        message: "Signup failed. Please try again.",
      },
    }; // ❌ Return backend errors correctly
  }
};

export const update_listing = async (
  id,
  title,
  description,
  image,
  price,
  country,
  location
) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // Ensure image is a valid file before appending
    if (image instanceof File) {
      formData.append("image", image);
    }

    // Ensure price is a valid number
    if (price) {
      formData.append("price", parseFloat(price));
    }

    formData.append("country", country);
    formData.append("location", location);

    const response = await axios.put(`${UPDATE_URL}${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error);

    return await call_refresh(error, () =>
      axios.put(`${UPDATE_URL}${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
    );
  }
};

export const delete_listing = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(`${DELETE_URL}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data; // Return only the response data
  } catch (error) {
    console.error("Error deleting listing:", error);

    // If needed, return a custom error response
    return {
      success: false,
      message: error?.response?.data || "Delete failed",
    };
  }
};

export const search_listings = async (location) => {
  try {
    const response = await axios.get(`${SEARCH_URL}`, {
      params: { location: location },
    });

    // Ensure we return valid data
    return response.data.listings || [];
  } catch (error) {
    console.error("Error fetching search results:", error);

    // Return an empty array on error to prevent UI crashes
    return [];
  }
};

export const filter_listings = async (category) => {
  try {
    const response = await axios.get(`${FILTER_URL}`, {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
  }
};

export const get_categories = async () => {
  try {
    const response = await axios.get(`${GET_CATEGORIES_URL}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getListingReviewsSummary = async (id) => {
  try {
    const response = await axios.get(`${REVIEW_SUMMARY}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listing reviews:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Something went wrong",
    };
  }
};

export const addReview = async (id, rating, comment) => {
  try {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    const token = localStorage.getItem("access_token");

    const response = await axios.post(
      `${ADD_REVIEW}${id}/`, // Adjust endpoint as per backend
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // If authentication is required
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    return null;
  }
};

export const deleteReview = async (listingId, reviewId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${DELETE_REVIEW}${listingId}/review/${reviewId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data; // Success response
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, message: "Failed to delete review." };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${VERIFY_OTP}`, {
      email,
      otp,
    });
    if (response?.data?.success) {
      return response.data;
    } else {
      return response.data || { error: "OTP verification failed" };
    }
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await axios.post(`${RESEND_OTP}`, { email });

    // Ensure consistent response format
    return {
      success: response.data?.success ?? false,
      message: response.data?.message || "",
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "",
      error: error.response?.data?.error || "Something went wrong",
    };
  }
};

export const createRazorpayOrder = async (token, paymentData) => {
  try {
    const response = await axios.post(CREATE_PAYMENT, paymentData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data; // Returns { order_id, amount, currency, booking_id }
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error.response?.data || { message: "Failed to create order" };
  }
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (token, paymentResponse) => {
  try {
    const response = await axios.post(VERIFY_PAYMENT, paymentResponse, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data; // { success: true, message: "Payment verified successfully" }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    throw error.response?.data || { message: "Payment verification failed" };
  }
};