
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NeighborhoodSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const NeighborhoodSearch = ({ searchQuery, onSearchChange }: NeighborhoodSearchProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Search size={18} />
      </div>
      <Input
        type="text"
        placeholder="Search neighborhoods..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-white/5 dark:bg-black/5 backdrop-blur-sm border-nashville-200 dark:border-nashville-700"
      />
      {searchQuery && (
        <button 
          onClick={() => onSearchChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default NeighborhoodSearch;
