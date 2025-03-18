
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Map, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NeighborhoodMap from "./NeighborhoodMap";
import NeighborhoodList from "./NeighborhoodList";
import NeighborhoodSelectionTags from "./NeighborhoodSelectionTags";
import NeighborhoodSearch from "./NeighborhoodSearch";

interface NeighborhoodSelectorProps {
  onSelect: (neighborhoods: string[]) => void;
  selectedNeighborhoods: string[];
  neighborhoods: { id: string; name: string }[];
  useUserLocation?: boolean;
}

const NeighborhoodSelector = ({
  onSelect,
  selectedNeighborhoods,
  neighborhoods,
  useUserLocation = false,
}: NeighborhoodSelectorProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  
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

  const filteredNeighborhoods = neighborhoods.filter((neighborhood) =>
    neighborhood.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
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
      
      <Tabs defaultValue="map" value={activeTab} onValueChange={(val) => setActiveTab(val as "map" | "list")} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-2 w-40">
            <TabsTrigger value="map" className="flex items-center gap-1.5">
              <Map className="h-3.5 w-3.5" />
              <span>Map</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1.5">
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "list" && (
            <div className="w-1/2">
              <NeighborhoodSearch 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
            </div>
          )}
        </div>
        
        <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
          <TabsContent value="map" className="mt-0">
            <div className="p-4">
              <div className="overflow-hidden rounded-lg">
                <NeighborhoodMap 
                  selectedNeighborhoods={selectedNeighborhoods} 
                  onSelect={toggleNeighborhood}
                  options={neighborhoodOptions}
                  useUserLocation={useUserLocation}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <NeighborhoodList 
                neighborhoods={filteredNeighborhoods}
                selectedNeighborhoods={selectedNeighborhoods}
                onToggle={toggleNeighborhood}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default NeighborhoodSelector;
