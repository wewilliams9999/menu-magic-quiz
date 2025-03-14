
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NeighborhoodSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const NeighborhoodSearch = ({ searchQuery, setSearchQuery }: NeighborhoodSearchProps) => {
  return (
    <div className="relative group">
      <Input
        type="text"
        placeholder="Search neighborhoods..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 py-2 bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30 rounded-xl focus-visible:ring-purple-200 dark:focus-visible:ring-purple-700 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-600 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" />
    </div>
  );
};

export default NeighborhoodSearch;
