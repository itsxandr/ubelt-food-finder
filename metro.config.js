const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Remove the line where we pushed 'geojson'
module.exports = config;
