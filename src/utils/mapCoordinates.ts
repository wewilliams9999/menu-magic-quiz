
// Nashville's approximate coordinates and neighborhood positions

export const NASHVILLE_CENTER = {
  lat: 36.1627,
  lng: -86.7816
};

export const neighborhoodPositions: Record<string, {
  left: string;
  top: string;
}> = {
  "downtown": {
    left: "50%",
    top: "45%"
  },
  "germantown": {
    left: "48%",
    top: "35%"
  },
  "gulch": {
    left: "45%",
    top: "50%"
  },
  "music-row": {
    left: "40%",
    top: "55%"
  },
  "north-nashville": {
    left: "35%",
    top: "25%"
  },
  "east": {
    left: "68%",
    top: "40%"
  },
  "west-end": {
    left: "30%",
    top: "50%"
  },
  "belle-meade": {
    left: "20%",
    top: "45%"
  },
  "bellevue": {
    left: "12%",
    top: "65%"
  },
  "bordeaux": {
    left: "25%",
    top: "20%"
  },
  "whites-creek": {
    left: "38%",
    top: "10%"
  },
  "12south": {
    left: "42%",
    top: "63%"
  },
  "berry-hill": {
    left: "50%",
    top: "68%"
  },
  "green-hills": {
    left: "34%",
    top: "68%"
  },
  "franklin": {
    left: "38%",
    top: "85%"
  },
  "brentwood": {
    left: "48%",
    top: "78%"
  },
  "opryland": {
    left: "80%",
    top: "25%"
  },
  "madison": {
    left: "62%",
    top: "15%"
  },
  "crieve-hall": {
    left: "45%",
    top: "73%"
  },
  "woodbine": {
    left: "60%",
    top: "60%"
  }
};

export interface UserLocation {
  latitude: number;
  longitude: number;
  mapX: string;
  mapY: string;
}

/**
 * Converts geographic coordinates to map position percentages
 */
export const convertCoordsToMapPosition = (lat: number, lng: number): { mapX: string, mapY: string } => {
  // Nashville's geographic bounds
  const nashvilleBounds = {
    north: 36.4,    // Northern boundary
    south: 35.9,    // Southern boundary
    east: -86.5,    // Eastern boundary
    west: -87.1     // Western boundary
  };
  
  // Calculate position as percentage within Nashville bounds
  const latRange = nashvilleBounds.north - nashvilleBounds.south;
  const lngRange = nashvilleBounds.east - nashvilleBounds.west;
  
  const latPercent = ((lat - nashvilleBounds.south) / latRange) * 100;
  const lngPercent = ((lng - nashvilleBounds.west) / lngRange) * 100;
  
  // Invert Y axis since map coordinates go from top to bottom
  const mapY = `${100 - latPercent}%`;
  const mapX = `${lngPercent}%`;
  
  console.log("Converting coordinates:", { lat, lng, mapX, mapY });
  
  return { mapX, mapY };
};
