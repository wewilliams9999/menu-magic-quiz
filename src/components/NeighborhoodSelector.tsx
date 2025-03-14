
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, X, MapPin } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizOption } from "@/utils/quizData";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox token - normally this would be in an environment variable
// This is a temporary public token for demonstration
const MAPBOX_TOKEN = "pk.eyJ1IjoiYXNoaXphbmFkaW0iLCJhIjoiY2xiMmZmOGl2MThzOTN1cGVwc2M2ZDZ6YiJ9.A_CX66QqpzNIPRm64-FVOA";

interface NeighborhoodSelectorProps {
  options: QuizOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

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

const NeighborhoodSelector = ({
  options,
  selectedValues,
  onChange,
}: NeighborhoodSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Filter options based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOptions(options);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredOptions(
        options.filter(option => 
          option.text.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, options]);

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
      handleSelectionChange(id);
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

  // Group neighborhoods by area
  const neighborhoodGroups = {
    "Central Nashville": ["downtown", "germantown", "gulch", "music-row", "north-nashville"],
    "East Nashville": ["east"],
    "West Nashville": ["west-end", "belle-meade", "bellevue", "bordeaux", "whites-creek"],
    "South Nashville": ["12south", "berry-hill", "green-hills"],
    "Surrounding Areas": ["franklin", "brentwood", "opryland", "madison"]
  };

  const getGroupForNeighborhood = (value: string) => {
    for (const [group, neighborhoods] of Object.entries(neighborhoodGroups)) {
      if (neighborhoods.includes(value)) {
        return group;
      }
    }
    return "Other Areas";
  };
  
  // Handle selection changes
  const handleSelectionChange = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);

    // If there's a map and we're selecting a new neighborhood, pan to it
    if (map.current && !selectedValues.includes(value) && newValues.includes(value)) {
      const coordinates = neighborhoodCoordinates[value];
      if (coordinates) {
        map.current.flyTo({
          center: coordinates,
          zoom: 12,
          duration: 1000
        });
      }
    }
  };

  const clearSelections = () => {
    onChange([]);
    
    // Reset map view
    if (map.current) {
      map.current.flyTo({
        center: [-86.7816, 36.1627], // Downtown Nashville
        zoom: 10.5,
        duration: 1000
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <Input
          type="text"
          placeholder="Search neighborhoods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 dark:bg-black/5 backdrop-blur-sm border-nashville-200 dark:border-nashville-700"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            return option ? (
              <motion.div
                key={`selected-${value}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-nashville-accent/20 text-sm"
              >
                <MapPin size={14} className="mr-1 text-nashville-accent" />
                <span className="mr-1">{option.text}</span>
                <button
                  onClick={() => handleSelectionChange(value)}
                  className="ml-1 rounded-full p-0.5 hover:bg-nashville-accent/30"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : null;
          })}
          <button
            onClick={clearSelections}
            className="inline-flex items-center px-3 py-1 rounded-full bg-nashville-200/50 dark:bg-nashville-700/50 text-sm hover:bg-nashville-200 dark:hover:bg-nashville-700 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Map container */}
      <div 
        ref={mapContainer} 
        className="h-[300px] w-full rounded-lg shadow-md mb-4 overflow-hidden border border-nashville-200 dark:border-nashville-700"
      ></div>

      <ScrollArea className="h-[250px] pr-4 rounded-lg">
        <div className="space-y-6">
          {/* If filtering, show flat list */}
          {searchQuery ? (
            <div className="grid grid-cols-2 gap-2">
              {filteredOptions.map((option) => (
                <Toggle
                  key={option.id}
                  pressed={selectedValues.includes(option.value)}
                  onPressedChange={() => handleSelectionChange(option.value)}
                  variant="outline"
                  className={`justify-start px-4 py-3 h-auto border border-nashville-200 dark:border-nashville-700 hover:bg-nashville-50 dark:hover:bg-nashville-800 transition-all ${
                    selectedValues.includes(option.value)
                      ? "bg-nashville-accent/10 dark:bg-nashville-accent/20 border-nashville-accent ring-1 ring-nashville-accent/30"
                      : ""
                  }`}
                >
                  <MapPin size={14} className="mr-2 text-nashville-accent" />
                  {option.text}
                </Toggle>
              ))}
            </div>
          ) : (
            // If not filtering, group by area
            Object.entries(neighborhoodGroups).map(([group, neighborhoods]) => {
              const groupOptions = options.filter(opt => neighborhoods.includes(opt.value));
              if (groupOptions.length === 0) return null;
              
              return (
                <div key={group} className="space-y-2">
                  <h3 className="font-medium text-nashville-800 dark:text-nashville-200">{group}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {groupOptions.map((option) => (
                      <Toggle
                        key={option.id}
                        pressed={selectedValues.includes(option.value)}
                        onPressedChange={() => handleSelectionChange(option.value)}
                        variant="outline"
                        className={`justify-start px-4 py-3 h-auto border border-nashville-200 dark:border-nashville-700 hover:bg-nashville-50 dark:hover:bg-nashville-800 transition-all ${
                          selectedValues.includes(option.value)
                            ? "bg-nashville-accent/10 dark:bg-nashville-accent/20 border-nashville-accent ring-1 ring-nashville-accent/30"
                            : ""
                        }`}
                      >
                        <MapPin size={14} className="mr-2 text-nashville-accent" />
                        {option.text}
                      </Toggle>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

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
        
        .mapboxgl-ctrl-attrib-inner {
          display: none;
        }
      `}
      </style>
    </div>
  );
};

export default NeighborhoodSelector;
