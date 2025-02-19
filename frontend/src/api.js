import axios from "axios";
// axios.defaults.withCredentials = true;

const BASE_URL = " http://127.0.0.1:8000/Listings/";
const LOGIN_URL = `${BASE_URL}login/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const GET_LISTINGS = `${BASE_URL}home/`;
const GET_CATEGORIES_URL = `${BASE_URL}categories/`;
const SHOW_LISTINGS = `${BASE_URL}show/`;
const CREATE_LISTINGS = `${BASE_URL}create-listing/`;
const SEARCH_URL = `${BASE_URL}search/`;
const FILTER_URL = `${BASE_URL}filter/`;
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register/`;
const UPDATE_URL = `${BASE_URL}update/`;
const DELETE_URL = `${BASE_URL}delete/`;

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      LOGIN_URL,
      { username, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    if (response.data.success) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
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

    const response = await axios.post(CREATE_LISTINGS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error);

    return await call_refresh(error, () =>
      axios.post(CREATE_LISTINGS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
    const response = await axios.post(AUTH_URL, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
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
    const response = await axios.delete(`${DELETE_URL}${id}/`, {
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
