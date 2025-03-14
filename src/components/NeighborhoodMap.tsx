
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { QuizOption } from "@/utils/quizData";
import { Info } from "lucide-react";

// Mapbox token - normally this would be in an environment variable
// This is a temporary public token for demonstration
const MAPBOX_TOKEN = "pk.eyJ1IjoiYXNoaXphbmFkaW0iLCJhIjoiY2xiMmZmOGl2MThzOTN1cGVwc2M2ZDZ6YiJ9.A_CX66QqpzNIPRm64-FVOA";

// Nashville neighborhoods with their coordinates
const neighborhoodCoordinates: Record<string, [number, number]> = {
  "downtown": [-86.7816, 36.1627],
  "germantown": [-86.7896, 36.1757],
  "gulch": [-86.7943, 36.1522],
  "music-row": [-86.7923, 36.1509],
  "north-nashville": [-86.8081, 36.1719],
  "east": [-86.7488, 36.1824],
  "west-end": [-86.8088, 36.1495],
  "belle-meade": [-86.8514, 36.1073],
  "bellevue": [-86.9336, 36.0759],
  "bordeaux": [-86.8538, 36.1949],
  "whites-creek": [-86.8269, 36.2309],
  "12south": [-86.7889, 36.1260],
  "berry-hill": [-86.7673, 36.1130],
  "green-hills": [-86.8135, 36.1032],
  "franklin": [-86.8689, 35.9250],
  "brentwood": [-86.7822, 36.0331],
  "opryland": [-86.6922, 36.2143],
  "madison": [-86.7175, 36.2647]
};

interface NeighborhoodMapProps {
  options: QuizOption[];
  selectedValues: string[];
  onSelectionChange: (value: string) => void;
}

const NeighborhoodMap = ({ 
  options, 
  selectedValues, 
  onSelectionChange 
}: NeighborhoodMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initialMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-86.7816, 36.1627], // Downtown Nashville
      zoom: 10.5,
      attributionControl: false
    });
    
    map.current = initialMap;
    
    initialMap.on('load', () => {
      // Add markers for all neighborhoods
      options.forEach(option => {
        const coordinates = neighborhoodCoordinates[option.value];
        if (coordinates) {
          addMarker(option.value, coordinates, option.text);
        }
      });
      
      // Update marker styles for selected values
      updateMarkers();
    });
    
    return () => {
      initialMap.remove();
    };
  }, [options]);
  
  // Update markers when selections change
  useEffect(() => {
    updateMarkers();
  }, [selectedValues]);
  
  const addMarker = (id: string, coordinates: [number, number], text: string) => {
    if (!map.current) return;
    
    // Create a custom element for the marker
    const el = document.createElement('div');
    el.className = 'neighborhood-marker';
    el.id = `marker-${id}`;
    el.innerHTML = `<div class="marker-pin"></div><span class="marker-text">${text}</span>`;
    
    // Add marker to the map
    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(map.current);
    
    // Store the marker reference
    markersRef.current.push(marker);
    
    // Add click event to toggle selection
    el.addEventListener('click', () => {
      onSelectionChange(id);
    });
  };
  
  const updateMarkers = () => {
    // Update all marker styles based on selection state
    options.forEach(option => {
      const markerEl = document.getElementById(`marker-${option.value}`);
      if (markerEl) {
        if (selectedValues.includes(option.value)) {
          markerEl.classList.add('selected');
        } else {
          markerEl.classList.remove('selected');
        }
      }
    });
  };

  // Method to fly to a specific neighborhood
  const flyToNeighborhood = (value: string) => {
    if (!map.current) return;
    
    const coordinates = neighborhoodCoordinates[value];
    if (coordinates) {
      map.current.flyTo({
        center: coordinates,
        zoom: 12,
        duration: 1000
      });
    }
  };

  // If a new neighborhood is selected, fly to it
  useEffect(() => {
    const newSelection = selectedValues[selectedValues.length - 1];
    if (newSelection) {
      flyToNeighborhood(newSelection);
    }
  }, [selectedValues]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-nashville-600 dark:text-nashville-400 bg-nashville-100/50 dark:bg-nashville-800/50 rounded-lg">
        <Info size={14} className="flex-shrink-0" />
        <p>Click on the map markers to select neighborhoods or use the bubbles below. The map will zoom to your selected areas.</p>
      </div>
      <div 
        ref={mapContainer} 
        className="h-[300px] w-full rounded-lg shadow-md overflow-hidden border border-nashville-200 dark:border-nashville-700"
      >
        <style>
          {`
            .neighborhood-marker {
              position: relative;
              cursor: pointer;
            }
            
            .marker-pin {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: white;
              border: 2px solid #ccc;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .marker-text {
              position: absolute;
              white-space: nowrap;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%);
              background-color: rgba(255, 255, 255, 0.9);
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 12px;
              opacity: 0;
              transition: opacity 0.2s ease;
              pointer-events: none;
            }
            
            .neighborhood-marker:hover .marker-text {
              opacity: 1;
            }
            
            .neighborhood-marker.selected .marker-pin {
              background-color: var(--nashville-accent, #f4b400);
              border-color: var(--nashville-accent, #f4b400);
              transform: scale(1.2);
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default NeighborhoodMap;
