// src/api/goalsApi.js
import axiosClient from "./axiosClient";

// Fetch all student goals and progress
export const getGoals = async () => {
  try {
    const response = await axiosClient.get("/goals/"); 
    // Expected response: [{ id, name, goalName, progress (0-100), deadline }]
    return response.data;
  } catch (error) {
    console.error("Fetch Goals error:", error);
    throw error;
  }
};

// Update goal progress (optional)
export const updateGoalProgress = async (goalId, progress) => {
  try {
    const response = await axiosClient.patch(`/goals/${goalId}/`, { progress });
    return response.data;
  } catch (error) {
    console.error("Update Goal Progress error:", error);
    throw error;
  }
};
