
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
      className={`flex justify-center items-center h-24 w-24 mx-auto mb-4 transition-colors rounded-lg border-2 
      ${isSelected 
        ? 'text-nashville-accent border-nashville-accent bg-nashville-accent/10' 
        : 'text-nashville-500 dark:text-nashville-400 border-nashville-200 dark:border-nashville-700'}`}
    >
      {IconComponent && <IconComponent />}
    </div>
  );
};

export default AtmosphereOption;
