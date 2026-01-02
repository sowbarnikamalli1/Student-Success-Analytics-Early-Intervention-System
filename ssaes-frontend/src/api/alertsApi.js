import axiosClient from "./axiosClient";

// Fetch risk alerts from backend
export const getRiskAlerts = async () => {
  try {
    const response = await axiosClient.get("/alerts/");
    return response.data; // expected [{ name, reg, attendance, score, risk }]
  } catch (error) {
    console.error("Fetch Risk Alerts error:", error);
    throw error;
  }
};
