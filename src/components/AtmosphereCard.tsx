import React from 'react';
import AtmosphereOption from './AtmosphereOption';
import { QuizOption } from '@/utils/quiz/types';

interface AtmosphereCardProps {
  option: QuizOption;
  isSelected: boolean;
  onClick: () => void;
}

const AtmosphereCard: React.FC<AtmosphereCardProps> = ({ option, isSelected, onClick }) => {
  return (
    <div
      className={`cozy-card p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-xl animate-cozy-glow' : 'hover:shadow-lg'
      }`}
      onClick={onClick}
    >
      <AtmosphereOption icon={option.icon} isSelected={isSelected} />
      <div className="mt-2 text-center">
        <h3 className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
          {option.text}
        </h3>
      </div>
    </div>
  );
};

export default AtmosphereCard;
