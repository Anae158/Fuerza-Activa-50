import React, { useState } from 'react';
import type { HistoryEntry } from '../types';
import { CalendarIcon, ChevronDownIcon, TrophyIcon } from './icons';

interface WorkoutHistoryProps {
  history: HistoryEntry[];
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Adding timezone offset to get the correct local date
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return localDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 focus:outline-none"
          aria-expanded={isOpen}
          aria-controls="history-panel"
        >
          <div className="flex items-center">
            <TrophyIcon className="h-6 w-6 text-yellow-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Historial de Entrenamientos</h3>
          </div>
          <ChevronDownIcon
            className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div id="history-panel" className="p-4 sm:p-6 border-t border-gray-200 animate-fade-in-down">
             <style>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
            `}</style>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aún no has completado ningún entrenamiento. ¡A por ello!</p>
            ) : (
              <ul className="space-y-4">
                {history.map((entry, index) => (
                  <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CalendarIcon className="h-5 w-5 text-indigo-500 mr-4 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{formatDate(entry.date)}</p>
                      <p className="text-sm text-gray-600">{entry.level}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
