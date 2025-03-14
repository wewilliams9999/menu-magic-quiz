
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface NeighborhoodSelectionTagsProps {
  selectedNeighborhoods: string[];
  neighborhoods: { id: string; name: string }[];
  onRemove: (id: string) => void;
}

const NeighborhoodSelectionTags = ({
  selectedNeighborhoods,
  neighborhoods,
  onRemove,
}: NeighborhoodSelectionTagsProps) => {
  if (selectedNeighborhoods.length === 0) {
    return (
      <div className="min-h-[32px] flex items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Select neighborhoods from the map or list
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 min-h-[32px]">
      <AnimatePresence>
        {selectedNeighborhoods.map((id) => {
          const neighborhood = neighborhoods.find((n) => n.id === id);
          if (!neighborhood) return null;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge
                className="px-3 py-1 gap-1 bg-gradient-to-r from-purple-200 to-purple-100 hover:from-purple-300 hover:to-purple-200 text-purple-800 dark:from-purple-800/60 dark:to-purple-700/60 dark:hover:from-purple-700 dark:hover:to-purple-600 dark:text-purple-100 border-0 font-medium"
                variant="secondary"
              >
                {neighborhood.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(id);
                  }}
                  className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center bg-purple-400/30 dark:bg-purple-700/30 hover:bg-purple-500/40 dark:hover:bg-purple-600/40 text-purple-700 dark:text-purple-200 transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NeighborhoodSelectionTags;
