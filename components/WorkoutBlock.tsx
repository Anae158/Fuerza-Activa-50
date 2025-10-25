
import React from 'react';
import type { Bloque } from '../types';
import ExerciseCard from './ExerciseCard';
import { QuoteIcon } from './icons';

interface WorkoutBlockProps {
  bloque: Bloque;
}

const WorkoutBlock: React.FC<WorkoutBlockProps> = ({ bloque }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-shadow hover:shadow-xl">
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h3 className="text-2xl font-bold">{bloque.titulo}</h3>
      </div>
      <div className="p-6">
        <div className="mb-6 flex items-start p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
          <QuoteIcon className="h-8 w-8 text-indigo-400 flex-shrink-0 mr-4 mt-1" />
          <p className="text-gray-700 italic">"{bloque.frase_motivadora}"</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bloque.ejercicios.map((ejercicio, index) => (
            <ExerciseCard key={index} ejercicio={ejercicio} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutBlock;
