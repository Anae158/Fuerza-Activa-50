import React from 'react';
import Logo from './Logo';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <div className="text-center animate-fade-in-up">
        <div className="mb-4">
          <Logo className="h-40" />
        </div>
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