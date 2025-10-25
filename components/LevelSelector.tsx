
import React from 'react';
import type { Nivel } from '../types';

interface LevelSelectorProps {
  selectedLevel: Nivel;
  onSelectLevel: (level: Nivel) => void;
}

const levels: Nivel[] = ['Nivel 1: Iniciación', 'Nivel 2: Medio', 'Nivel 3: Avanzado'];

const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onSelectLevel }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-xl shadow-md max-w-lg mx-auto border border-gray-100">
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => onSelectLevel(level)}
          className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            selectedLevel === level
              ? 'bg-indigo-600 text-white shadow-lg transform sm:scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
