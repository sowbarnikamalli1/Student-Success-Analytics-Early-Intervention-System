// src/api/uploadApi.js
import axiosClient from "./axiosClient";

/**
 * Upload a CSV or Excel file containing student data
 * @param {File} file - CSV or XLSX file
 * @returns {Object} response from backend
 */
export const uploadStudentFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post("/students/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("File upload error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
