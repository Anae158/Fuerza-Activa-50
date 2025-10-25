import React from 'react';
import { DumbbellIcon, SparklesIcon } from './icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <div className="text-center animate-fade-in-up">
        <div className="flex justify-center items-center mb-4">
          <DumbbellIcon className="h-16 w-16" />
          <SparklesIcon className="h-8 w-8 -ml-4 -mt-8 text-yellow-300" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">Fuerza Activa 50+</h1>
        <p className="mt-4 text-lg md:text-xl text-indigo-100">Preparando tu rutina personalizada...</p>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
