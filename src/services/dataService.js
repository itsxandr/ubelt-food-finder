import ubeltData from "@/src/data/ubelt-spots.json";

export const getUbeltSpots = async () => {
  try {
    return new Promise((resolve) => {
      // Return the features array from the JSON
      setTimeout(() => resolve(ubeltData.features || []), 300);
    });
  } catch (error) {
    console.error("Error loading U-Belt data:", error);
    return [];
  }
};
