
import React from 'react';
import { CasualIcon, TrendyIcon, ElegantIcon, UniqueIcon } from '@/utils/atmosphere-icons';

interface AtmosphereOptionProps {
  icon?: string;
  isSelected: boolean;
}

const AtmosphereOption: React.FC<AtmosphereOptionProps> = ({ icon, isSelected }) => {
  const getIcon = () => {
    switch (icon) {
      case 'CasualIcon':
        return <CasualIcon />;
      case 'TrendyIcon':
        return <TrendyIcon />;
      case 'ElegantIcon':
        return <ElegantIcon />;
      case 'UniqueIcon':
        return <UniqueIcon />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex justify-center items-center h-24 w-24 mx-auto mb-4 transition-colors ${isSelected ? 'text-nashville-accent' : 'text-nashville-500 dark:text-nashville-400'}`}>
      {getIcon()}
    </div>
  );
};

export default AtmosphereOption;
