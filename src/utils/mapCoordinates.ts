
// Nashville's approximate coordinates and neighborhood positions

export const NASHVILLE_CENTER = {
  lat: 36.1627,
  lng: -86.7816
};

export const neighborhoodPositions: Record<string, {
  left: string;
  top: string;
  mobileLeft?: string;  // Mobile-specific positioning
  mobileTop?: string;   // Mobile-specific positioning
}> = {
  "downtown": {
    left: "50%",
    top: "45%",
    mobileLeft: "50%",
    mobileTop: "45%"
  },
  "germantown": {
    left: "48%",
    top: "35%",
    mobileLeft: "45%",
    mobileTop: "35%"
  },
  "gulch": {
    left: "45%",
    top: "50%",
    mobileLeft: "42%",
    mobileTop: "52%"
  },
  "music-row": {
    left: "40%",
    top: "55%",
    mobileLeft: "38%",
    mobileTop: "58%"
  },
  "north-nashville": {
    left: "35%",
    top: "25%",
    mobileLeft: "30%",
    mobileTop: "22%"
  },
  "east": {
    left: "68%",
    top: "40%",
    mobileLeft: "75%",
    mobileTop: "40%"
  },
  "west-end": {
    left: "30%",
    top: "50%",
    mobileLeft: "25%",
    mobileTop: "48%"
  },
  "belle-meade": {
    left: "20%",
    top: "45%",
    mobileLeft: "15%",
    mobileTop: "42%"
  },
  "bellevue": {
    left: "12%",
    top: "65%",
    mobileLeft: "10%",
    mobileTop: "70%"
  },
  "bordeaux": {
    left: "25%",
    top: "20%",
    mobileLeft: "20%",
    mobileTop: "15%"
  },
  "whites-creek": {
    left: "38%",
    top: "10%",
    mobileLeft: "35%",
    mobileTop: "8%"
  },
  "12south": {
    left: "42%",
    top: "63%",
    mobileLeft: "42%",
    mobileTop: "68%"
  },
  "berry-hill": {
    left: "50%",
    top: "68%",
    mobileLeft: "55%",
    mobileTop: "72%"
  },
  "green-hills": {
    left: "34%",
    top: "68%",
    mobileLeft: "28%",
    mobileTop: "72%"
  },
  "franklin": {
    left: "38%",
    top: "85%",
    mobileLeft: "35%",
    mobileTop: "90%"
  },
  "brentwood": {
    left: "48%",
    top: "78%",
    mobileLeft: "52%",
    mobileTop: "85%"
  },
  "opryland": {
    left: "80%",
    top: "25%",
    mobileLeft: "85%",
    mobileTop: "20%"
  },
  "madison": {
    left: "62%",
    top: "15%",
    mobileLeft: "65%",
    mobileTop: "15%"
  },
  "crieve-hall": {
    left: "45%",
    top: "73%",
    mobileLeft: "45%",
    mobileTop: "78%"
  },
  "woodbine": {
    left: "60%",
    top: "60%",
    mobileLeft: "65%",
    mobileTop: "62%"
  },
  "inglewood": {
    left: "65%",
    top: "30%",
    mobileLeft: "68%",
    mobileTop: "28%"
  },
  "antioch": {
    left: "68%",
    top: "75%",
    mobileLeft: "72%",
    mobileTop: "80%"
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
