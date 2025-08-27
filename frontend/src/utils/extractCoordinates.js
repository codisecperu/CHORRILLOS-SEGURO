export const extractCoordinates = (url) => {
  const regex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)|@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = url.match(regex);

  if (match) {
    if (match[1] && match[2]) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
      };
    } else if (match[3] && match[4]) {
      return {
        lat: parseFloat(match[3]),
        lng: parseFloat(match[4]),
      };
    }
  }

  return null;
};