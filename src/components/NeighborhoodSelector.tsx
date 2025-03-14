
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NeighborhoodMap from "./NeighborhoodMap";
import NeighborhoodList from "./NeighborhoodList";
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Map Side - Now expanded */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-2 md:order-1 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 md:col-span-8"
        >
          <div className="p-4">
            <div className="aspect-square md:aspect-[4/3] overflow-hidden rounded-lg">
              <NeighborhoodMap 
                selectedNeighborhoods={selectedNeighborhoods} 
                onSelect={toggleNeighborhood}
                options={neighborhoodOptions}
                useUserLocation={true}
              />
            </div>
          </div>
        </motion.div>

        {/* Selection Side - Now smaller */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-1 md:order-2 flex flex-col md:col-span-4"
        >
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 bg-white dark:bg-gray-900">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Map size={18} className="text-nashville-accent" />
                Nashville Neighborhoods
              </h3>
              
              <Separator className="bg-gray-200 dark:bg-gray-700" />
              
              <NeighborhoodSelectionTags 
                selectedNeighborhoods={selectedNeighborhoods}
                neighborhoods={neighborhoods}
                onRemove={(id) => toggleNeighborhood(id)}
              />
              
              <ScrollArea className="h-[240px] pr-4">
                <NeighborhoodList 
                  neighborhoods={neighborhoods}
                  selectedNeighborhoods={selectedNeighborhoods}
                  onToggle={toggleNeighborhood}
                />
              </ScrollArea>
              
              {selectedNeighborhoods.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-gray-500 font-medium tracking-wide"
                >
                  {selectedNeighborhoods.length} {selectedNeighborhoods.length === 1 ? 'neighborhood' : 'neighborhoods'} selected
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NeighborhoodSelector;
