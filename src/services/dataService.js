import ubeltData from '../data/ubeltSpots.json';

// This function "fetches" the data. 
// When you're ready for a real DB, you only change this one file!
export const getUbeltSpots = async () => {
  try {
    // Simulating a tiny delay so the app feels realistic
    return new Promise((resolve) => {
      setTimeout(() => resolve(ubeltData), 300);
    });
  } catch (error) {
    console.error("Error loading U-Belt data:", error);
    return [];
  }
};