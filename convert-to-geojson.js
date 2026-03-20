const fs = require("fs");

// ============================================
// CONVERT GEOCODED DATA TO MAPLIBRE GEOJSON
// ============================================

console.log("\n📦 Converting to GeoJSON format...\n");

// Read geocoded spots
const geocoded = JSON.parse(fs.readFileSync("geocoded_spots.json", "utf8"));

// Filter only spots with coordinates
const spotsWithCoords = geocoded.filter(
  (spot) => spot.Latitude && spot.Longitude,
);

console.log(`Total spots: ${geocoded.length}`);
console.log(`With coordinates: ${spotsWithCoords.length}`);
console.log(
  `Without coordinates: ${geocoded.length - spotsWithCoords.length}\n`,
);

// Convert to GeoJSON FeatureCollection
const geojson = {
  type: "FeatureCollection",
  features: spotsWithCoords.map((spot) => ({
    type: "Feature",
    id: spot.Place_ID,
    geometry: {
      type: "Point",
      coordinates: [spot.Longitude, spot.Latitude], // [lng, lat] order!
    },
    properties: {
      Place_ID: spot.Place_ID,
      Name: spot.Name,
      Address: spot.Notes,
      Price_Category: spot.Price_Category || null,
      Vibe_Tags: spot.Vibe_Tags
        ? spot.Vibe_Tags.split(",").map((t) => t.trim())
        : [],
      Operating_Hours: spot.Operating_Hours || null,
      Has_Sockets: spot.Has_Sockets === "TRUE",
      Has_WiFi: spot.Has_WiFi === "TRUE",
      Photo: spot.Photo || null,
      Zone: spot.Zone || null,
    },
  })),
};

// Save GeoJSON
fs.writeFileSync(
  "src/data/ubelt-spots.geojson",
  JSON.stringify(geojson, null, 2),
);

console.log("✅ GeoJSON created!\n");
console.log(`📁 Saved to: src/data/ubelt-spots.geojson`);
console.log(`📊 Features: ${geojson.features.length}\n`);
