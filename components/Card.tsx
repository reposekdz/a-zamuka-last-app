
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cursorClass = onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : '';
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
