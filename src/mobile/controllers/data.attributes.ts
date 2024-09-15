interface Coordinate {
  latitude: number;
  longitude: number;
}

const getCoordinateRange = (center: Coordinate) => {
  const range = Number(process.env.RANGE || 10);
  const latRange = range / 111;
  const lonRange = range / (111 * Math.cos(center.latitude * (Math.PI / 180)));
  return {
    minLatitude: center.latitude - latRange,
    maxLatitude: center.latitude + latRange,
    minLongitude: center.longitude - lonRange,
    maxLongitude: center.longitude + lonRange,
  };
};
export { Coordinate, getCoordinateRange };
