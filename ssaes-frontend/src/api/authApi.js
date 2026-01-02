import axiosClient from "./axiosClient";

/**
 * ============================
 * LOGIN USER
 * ============================
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axiosClient.post("/auth/login", { email, password });

    // Save token and user in localStorage for demo/mock purposes
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data; // { token, user }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * LOGOUT USER
 * ============================
 */
export const logoutUser = async () => {
  try {
    await axiosClient.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * REGISTER NEW USER
 * ============================
 * @param {object} userData
 */
export const registerUser = async (userData) => {
  try {
    const response = await axiosClient.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * ============================
 * GET CURRENT USER
 * ============================
 * Returns user object from localStorage
 * Used by AuthContext or pages
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
