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

/**
 * Calculates the geographic center of an array of spots by finding the
 * midpoint of the bounding box formed by all their coordinates.
 *
 * @param {Array<{latitude: number, longitude: number}>} spots
 * @returns {[number, number]} Center as [latitude, longitude]
 */
export const calculateMapCenter = (spots) => {
  if (!spots || spots.length === 0) {
    return [14.6041, 120.9882];
  }

  const bounds = spots.reduce(
    (acc, s) => ({
      minLat: s.latitude < acc.minLat ? s.latitude : acc.minLat,
      maxLat: s.latitude > acc.maxLat ? s.latitude : acc.maxLat,
      minLon: s.longitude < acc.minLon ? s.longitude : acc.minLon,
      maxLon: s.longitude > acc.maxLon ? s.longitude : acc.maxLon,
    }),
    {
      minLat: spots[0].latitude,
      maxLat: spots[0].latitude,
      minLon: spots[0].longitude,
      maxLon: spots[0].longitude,
    },
  );

  return [
    (bounds.minLat + bounds.maxLat) / 2,
    (bounds.minLon + bounds.maxLon) / 2,
  ];
};
