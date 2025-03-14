
import React from 'react';
import { CasualIcon, TrendyIcon, ElegantIcon, UniqueIcon } from '@/utils/atmosphere-icons';

interface AtmosphereOptionProps {
  icon?: React.ElementType | null;
  isSelected: boolean;
}

const AtmosphereOption: React.FC<AtmosphereOptionProps> = ({ icon, isSelected }) => {
  const IconComponent = icon || null;
  
  return (
    <div className={`flex justify-center items-center h-24 w-24 mx-auto mb-4 transition-colors ${isSelected ? 'text-nashville-accent' : 'text-nashville-500 dark:text-nashville-400'}`}>
      {IconComponent && <IconComponent />}
    </div>
  );
};

export default AtmosphereOption;
