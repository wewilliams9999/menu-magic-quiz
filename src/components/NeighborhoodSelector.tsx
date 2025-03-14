
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NeighborhoodMap from "./NeighborhoodMap";
import NeighborhoodSearch from "./NeighborhoodSearch";
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
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  const filteredNeighborhoods = neighborhoods.filter((neighborhood) =>
    neighborhood.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map Side */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-2 md:order-1 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-md"
        >
          <div className="p-4 md:p-6">
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl">
              <NeighborhoodMap 
                selectedNeighborhoods={selectedNeighborhoods} 
                onSelect={toggleNeighborhood}
                options={neighborhoodOptions}
              />
            </div>
          </div>
        </motion.div>

        {/* Selection Side */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-1 md:order-2 flex flex-col"
        >
          <div className="backdrop-blur-sm rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-sm p-5 bg-white/80 dark:bg-gray-900/80">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Nashville Neighborhoods
              </h3>
              
              <div className="relative">
                <NeighborhoodSearch 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>

              <Separator className="bg-purple-100 dark:bg-purple-900/30" />
              
              <NeighborhoodSelectionTags 
                selectedNeighborhoods={selectedNeighborhoods}
                neighborhoods={neighborhoods}
                onRemove={(id) => toggleNeighborhood(id)}
              />
              
              <ScrollArea className="h-[240px] pr-4">
                <NeighborhoodList 
                  neighborhoods={filteredNeighborhoods}
                  selectedNeighborhoods={selectedNeighborhoods}
                  onToggle={toggleNeighborhood}
                />
              </ScrollArea>
              
              {selectedNeighborhoods.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-purple-500 font-medium tracking-wide"
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
