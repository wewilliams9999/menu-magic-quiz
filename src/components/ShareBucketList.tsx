import React, { useRef } from 'react';
import { Utensils, MapPin } from 'lucide-react';
import { QuizResult } from '@/utils/quiz/types';

interface ShareBucketListProps {
  restaurants: QuizResult[];
  className?: string;
  [key: string]: any; // Allow additional props like data-share-card
}

const ShareBucketList: React.FC<ShareBucketListProps> = ({ restaurants, className = '', ...props }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Take top 3 restaurants for the bucket list
  const topThree = restaurants.slice(0, 3);

  return (
    <div
      ref={cardRef}
      className={`bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 rounded-3xl shadow-2xl border border-border/20 w-96 ${className}`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      {...props}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-3">
          <Utensils className="w-5 h-5 text-primary" />
          <span className="text-primary font-semibold text-sm">Nashville Eats</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          My Nashville Restaurant
        </h1>
        <h2 className="text-xl font-bold text-primary">
          Picks 🍽️
        </h2>
      </div>

      {/* Restaurant List */}
      <div className="space-y-4 mb-6">
        {topThree.map((restaurant, index) => (
          <div key={restaurant.id} className="flex items-start gap-3 p-3 bg-card/50 rounded-xl border border-border/30">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-sm leading-tight">
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {restaurant.cuisine}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {restaurant.neighborhood}
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-accent">
              {restaurant.priceRange}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          These are my top 3 Nashville restaurant picks. What are yours? 🤔
        </p>
        <p className="text-sm font-semibold text-primary">
          See if we match up!
        </p>
        
        {/* App Branding */}
        <div className="pt-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Find your perfect Nashville restaurant at
          </p>
          <p className="text-xs font-semibold text-primary">
            lovable.dev/nashville-eats
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareBucketList;