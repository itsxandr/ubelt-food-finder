import ubeltData from "@/src/data/ubelt-spots.json";

export const getUbeltSpots = async () => {
  try {
    return new Promise((resolve) => {
      // Map the GeoJSON "features" into a flat format
      const formattedSpots = ubeltData.features.map((feature) => ({
        id: feature.properties.Place_ID || feature.id,
        name: feature.properties.Name,
        address: feature.properties.Address,
        // CRITICAL: GeoJSON is [Long, Lat], we need to extract them correctly
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        vibe_tags: feature.properties.Vibe_Tags || [],
        price_category: feature.properties.Price_Category,
      }));

      setTimeout(() => resolve(formattedSpots), 300);
    });
  } catch (error) {
    console.error("Error loading U-Belt data:", error);
    return [];
  }
};
