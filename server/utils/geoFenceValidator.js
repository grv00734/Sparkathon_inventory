const haversine = require('haversine-distance');

exports.isWithinGeofence = (center, point) => {
  const distance = haversine(center, point); // in meters
  return distance <= parseInt(process.env.GEOFENCE_RADIUS);
};
