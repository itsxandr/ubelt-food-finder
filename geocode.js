const fs = require("fs");

// ============================================
// SIMPLE GEOCODING SCRIPT
// Reads CSV, geocodes addresses, saves JSON
// ============================================

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const RATE_LIMIT = 1100; // milliseconds between requests
const USER_AGENT = "UbeltFoodFinder/1.0 (contact@ubelt.com)";

// Parse CSV manually
function parseCSV(content) {
  const lines = content.split("\n");
  const headers = lines[0].split(",");

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(",");
    data.push({
      Place_ID: values[0]?.trim(),
      Name: values[1]?.trim(),
      Coordinates: values[2]?.trim() || "",
      Price_Category: values[3]?.trim(),
      Vibe_Tags: values[4]?.trim(),
      Photo: values[5]?.trim(),
      Operating_Hours: values[6]?.trim(),
      Has_Sockets: values[7]?.trim(),
      Has_WiFi: values[8]?.trim(),
      Notes: values[9]?.trim(), // ADDRESS IS HERE
      Zone: values[11]?.trim(),
    });
  }
  return data;
}

// Geocode one address
async function geocodeAddress(address) {
  if (!address || address === "") {
    return null;
  }

  try {
    const query = `${address}, Manila, Philippines`;
    const url = `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(query)}&limit=1`;

    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) return null;

    const results = await response.json();
    if (results && results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon),
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Main function
async function main() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   U-BELT FOOD FINDER - GEOCODER v1.0   ║");
  console.log("╚════════════════════════════════════════╝\n");

  // Read CSV
  console.log("📖 Reading CSV file...");
  const csv = fs.readFileSync("DB_FoodFinder_Production - Sheet1.csv", "utf8");
  const spots = parseCSV(csv);

  console.log(`✅ Found ${spots.length} spots\n`);
  console.log(`🗺️  Starting geocoding...`);
  console.log(`⏱️  Rate limit: 1 request/second\n`);

  const geocoded = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i];
    const address = spot.Notes;

    if (!address) {
      console.log(`⏭️  [${i + 1}/${spots.length}] ${spot.Name} - No address`);
      geocoded.push({
        ...spot,
        Latitude: null,
        Longitude: null,
      });
      failed++;
    } else {
      const coords = await geocodeAddress(address);

      if (coords) {
        console.log(`✅ [${i + 1}/${spots.length}] ${spot.Name}`);
        console.log(`   ${address}`);
        console.log(
          `   → ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}\n`,
        );

        geocoded.push({
          ...spot,
          Latitude: coords.lat,
          Longitude: coords.lng,
        });
        success++;
      } else {
        console.log(`❌ [${i + 1}/${spots.length}] ${spot.Name} - Not found\n`);

        geocoded.push({
          ...spot,
          Latitude: null,
          Longitude: null,
        });
        failed++;
      }
    }

    // Rate limit
    if (i < spots.length - 1) {
      await new Promise((r) => setTimeout(r, RATE_LIMIT));
    }
  }

  // Save results
  fs.writeFileSync("geocoded_spots.json", JSON.stringify(geocoded, null, 2));

  console.log("\n╔════════════════════════════════════════╗");
  console.log("║            COMPLETE!                   ║");
  console.log("╚════════════════════════════════════════╝\n");
  console.log(`✅ Success: ${success}/${geocoded.length}`);
  console.log(`❌ Failed: ${failed}/${geocoded.length}`);
  console.log(`\n📁 Saved to: geocoded_spots.json\n`);
}

main().catch(console.error);
