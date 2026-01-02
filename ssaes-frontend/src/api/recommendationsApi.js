import axiosClient from "./axiosClient";

export const getRecommendations = async () => {
  const response = await axiosClient.get("/recommendations/");
  return response.data;
};

export const applyRecommendation = async (id) => {
  const response = await axiosClient.post("/recommendations/apply/", {
    recommendation_id: id,
  });
  return response.data;
};
