
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NeighborhoodMap from "./NeighborhoodMap";
import NeighborhoodSelectionTags from "./NeighborhoodSelectionTags";

interface NeighborhoodSelectorProps {
  onSelect: (neighborhoods: string[]) => void;
  selectedNeighborhoods: string[];
  neighborhoods: { id: string; name: string }[];
}

const NeighborhoodSelector = ({
  onSelect,
  selectedNeighborhoods,
  neighborhoods,
}: NeighborhoodSelectorProps) => {
  const isMobile = useIsMobile();
  
  // Convert neighborhoods to the format expected by NeighborhoodMap
  const neighborhoodOptions = neighborhoods.map(neighborhood => ({
    id: neighborhood.id,
    text: neighborhood.name,
    value: neighborhood.id
  }));

  const toggleNeighborhood = (neighborhoodId: string) => {
    if (selectedNeighborhoods.includes(neighborhoodId)) {
      onSelect(selectedNeighborhoods.filter((id) => id !== neighborhoodId));
    } else {
      onSelect([...selectedNeighborhoods, neighborhoodId]);
    }
  };

  return (
    <div className="w-full">
      {/* Selected neighborhood tags appear above the map */}
      {selectedNeighborhoods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <NeighborhoodSelectionTags 
            selectedNeighborhoods={selectedNeighborhoods}
            neighborhoods={neighborhoods}
            onRemove={(id) => toggleNeighborhood(id)}
          />
          <div className="mt-2 text-xs text-gray-500 font-medium tracking-wide">
            {selectedNeighborhoods.length} {selectedNeighborhoods.length === 1 ? 'neighborhood' : 'neighborhoods'} selected
          </div>
        </motion.div>
      )}
      
      {/* Full-width map */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <div className="p-4">
          <div className="aspect-[16/9] overflow-hidden rounded-lg">
            <NeighborhoodMap 
              selectedNeighborhoods={selectedNeighborhoods} 
              onSelect={toggleNeighborhood}
              options={neighborhoodOptions}
              useUserLocation={true}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NeighborhoodSelector;
