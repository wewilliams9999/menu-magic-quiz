
import React from 'react';
import { CasualIcon, TrendyIcon, ElegantIcon, UniqueIcon } from '@/utils/atmosphere-icons';

interface AtmosphereOptionProps {
  icon?: React.ElementType | null;
  isSelected: boolean;
}

const AtmosphereOption: React.FC<AtmosphereOptionProps> = ({ icon, isSelected }) => {
  const IconComponent = icon || null;
  
  return (
    <div 
      className={`cozy-card flex justify-center items-center h-24 w-24 mx-auto mb-4 transition-all duration-300 transform hover:scale-105
      ${isSelected 
        ? 'text-primary border-primary/50 bg-primary/10 shadow-lg animate-cozy-glow' 
        : 'text-muted-foreground border-border hover:border-primary/30 hover:bg-primary/5'}`}
    >
      {IconComponent && <IconComponent />}
    </div>
  );
};

export default AtmosphereOption;
