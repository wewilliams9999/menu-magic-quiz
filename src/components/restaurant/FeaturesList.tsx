import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizResult } from "@/utils/quiz/types";

interface FeaturesListProps {
  features?: string[];
}

const FeaturesList = ({ features }: FeaturesListProps) => {
  if (!features || features.length === 0) {
    return null;
  }
  
  return (
    <CardContent>
      <div className="flex flex-wrap gap-2" itemProp="keywords">
        {features.map((feature, index) => (
          <Badge key={index} variant="secondary" className="bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300">
            {feature}
          </Badge>
        ))}
      </div>
    </CardContent>
  );
};

export default FeaturesList;
