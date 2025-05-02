
import { Skeleton } from "@/components/ui/skeleton";

const ResultLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
          <Skeleton className="h-48 w-full bg-zinc-800/50" />
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4 bg-zinc-800/50" />
            <Skeleton className="h-4 w-1/2 mb-2 bg-zinc-800/50" />
            <Skeleton className="h-4 w-3/4 mb-8 bg-zinc-800/50" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 bg-zinc-800/50" />
              <Skeleton className="h-8 w-20 bg-zinc-800/50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultLoadingSkeleton;
