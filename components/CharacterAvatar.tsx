import React from 'react';
import { CharacterType } from '../types';
import { Cat, Rabbit, PawPrint } from 'lucide-react';

interface Props {
  type: CharacterType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CharacterAvatar: React.FC<Props> = ({ type, size = 'md', selected, onClick, className = '' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    xl: 'w-64 h-64',
  };

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 80,
    xl: 120
  };

  let bgClass = '';
  let Icon = PawPrint; // Default Bear
  
  if (type === CharacterType.BEAR) {
    bgClass = 'bg-blue-400 border-blue-600';
    Icon = PawPrint; 
  } else if (type === CharacterType.RABBIT) {
    bgClass = 'bg-yellow-300 border-yellow-500';
    Icon = Rabbit;
  } else if (type === CharacterType.CAT) {
    bgClass = 'bg-red-400 border-red-600';
    Icon = Cat;
  }

  return (
    <div 
      onClick={onClick}
      className={`
        ${sizeClasses[size]} 
        ${bgClass} 
        rounded-full 
        flex items-center justify-center 
        border-8 
        shadow-xl 
        cursor-pointer
        transition-all duration-300
        ${selected ? 'scale-110 ring-8 ring-white' : 'hover:scale-105'}
        ${className}
      `}
    >
      <Icon size={iconSizes[size]} color="white" strokeWidth={2.5} />
    </div>
  );
};