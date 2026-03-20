import ubeltGeoJSON from "../data/ubelt-spots.geojson";

// Convert GeoJSON features to app format
function convertGeoJSONToSpots(geojson) {
  if (!geojson || !geojson.features) return [];

  return geojson.features.map((feature) => ({
    id: feature.id,
    name: feature.properties.Name,
    address: feature.properties.Address,
    latitude: feature.geometry.coordinates[1], // [lng, lat] → lat
    longitude: feature.geometry.coordinates[0], // [lng, lat] → lng
    price_category: feature.properties.Price_Category,
    vibe_tags: feature.properties.Vibe_Tags || [],
    operating_hours: feature.properties.Operating_Hours,
    has_sockets: feature.properties.Has_Sockets,
    has_wifi: feature.properties.Has_WiFi,
    photo: feature.properties.Photo,
    zone: feature.properties.Zone,
  }));
}

// This function "fetches" the data.
// When you're ready for a real DB, you only change this one file!
export const getUbeltSpots = async () => {
  try {
    // Simulating a tiny delay so the app feels realistic
    return new Promise((resolve) => {
      const spots = convertGeoJSONToSpots(ubeltGeoJSON);
      setTimeout(() => resolve(spots), 300);
    });
  } catch (error) {
    console.error("Error loading U-Belt data:", error);
    return [];
  }
};
