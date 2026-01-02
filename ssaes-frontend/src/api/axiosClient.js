import axios from "axios";

/**
 * Axios instance for SSAES API calls
 * - baseURL: backend API root
 * - timeout: 10 seconds
 * - JSON headers
 * - JWT Authorization from localStorage
 */

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// ==================== REQUEST INTERCEPTOR ====================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
