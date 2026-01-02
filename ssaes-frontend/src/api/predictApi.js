// src/api/predictApi.js
import axiosClient from "./axiosClient";

/**
 * Send student data to ML backend for prediction
 * @param {Object} studentData - student features
 * @returns {Object} { predictedScore, riskLevel, probability }
 */
export const predictStudentRisk = async (studentData) => {
  try {
    const response = await axiosClient.post("/predict", studentData);
    return response.data; // { predictedScore, riskLevel, probability }
  } catch (error) {
    console.error("Prediction API error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
