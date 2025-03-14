
import React from 'react';
import AtmosphereOption from './AtmosphereOption';
import { QuizOption } from '@/utils/quizData';

interface AtmosphereCardProps {
  option: QuizOption;
  isSelected: boolean;
  onClick: () => void;
}

const AtmosphereCard: React.FC<AtmosphereCardProps> = ({ option, isSelected, onClick }) => {
  return (
    <div
      className={`option-card flex flex-col ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <AtmosphereOption icon={option.icon} isSelected={isSelected} />
      <div className="mt-2 text-center">
        <h3 className="font-medium">{option.text}</h3>
      </div>
    </div>
  );
};

export default AtmosphereCard;
