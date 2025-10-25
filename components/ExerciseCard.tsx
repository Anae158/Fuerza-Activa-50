import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Ejercicio } from '../types';
import { ClockIcon, CheckCircleIcon, PlayCircleIcon, PauseCircleIcon, ResetIcon } from './icons';

interface ExerciseCardProps {
  ejercicio: Ejercicio;
}

const parseDurationToSeconds = (duration: string): number | null => {
  const match = duration.match(/(\d+)\s*segundos?/i);
  if (match && match[1]) {
    const seconds = parseInt(match[1], 10);
    return isNaN(seconds) ? null : seconds;
  }
  return null;
};

const CircularProgress: React.FC<{ progress: number; timeLeft: number; isCompleted: boolean }> = ({ progress, timeLeft, isCompleted }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const progressColor = isCompleted ? 'stroke-green-500' : 'stroke-indigo-600';

  return (
    <div className="relative w-32 h-32">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`transition-all duration-300 ${progressColor}`}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        {isCompleted ? (
          <CheckCircleIcon className="w-12 h-12 text-green-500" />
        ) : (
          <span className="text-3xl font-bold text-gray-700">{timeLeft}</span>
        )}
      </div>
    </div>
  );
};


const ExerciseCard: React.FC<ExerciseCardProps> = ({ ejercicio }) => {
  const totalSeconds = useMemo(() => parseDurationToSeconds(ejercicio.duracion), [ejercicio.duracion]);

  const [timeLeft, setTimeLeft] = useState(totalSeconds || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (totalSeconds) {
      setTimeLeft(totalSeconds);
      setIsRunning(false);
      setIsCompleted(false);
    }
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && totalSeconds && !isCompleted) {
        setIsCompleted(true);
        setIsRunning(false);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, totalSeconds, isCompleted]);


  const toggleTimer = useCallback(() => {
    if (isCompleted) return;
    setIsRunning(!isRunning);
  }, [isRunning, isCompleted]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsCompleted(false);
    if(totalSeconds) {
       setTimeLeft(totalSeconds);
    }
  }, [totalSeconds]);

  // Render original card if duration is not in seconds (e.g., reps-based)
  if (totalSeconds === null) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full flex flex-col justify-between hover:border-indigo-300 transition-colors">
        <div>
          <h4 className="font-semibold text-lg text-gray-800">{ejercicio.nombre}</h4>
          <p className="text-gray-600 text-sm mt-1">{ejercicio.descripcion}</p>
        </div>
        <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
          <ClockIcon className="h-5 w-5 mr-2" />
          <span>{ejercicio.duracion}</span>
        </div>
      </div>
    );
  }

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  // Render timer card
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full flex flex-col items-center justify-between text-center">
      <h4 className="font-semibold text-lg text-gray-800 h-12">{ejercicio.nombre}</h4>
      <p className="text-gray-600 text-sm my-2">{ejercicio.descripcion}</p>
      
      <div className="my-4">
        <CircularProgress progress={progress} timeLeft={timeLeft} isCompleted={isCompleted} />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={resetTimer}
          aria-label="Reiniciar temporizador"
          className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          disabled={isRunning}
        >
          <ResetIcon className="w-7 h-7" />
        </button>
        <button
          onClick={toggleTimer}
          aria-label={isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'}
          className="text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
          disabled={isCompleted}
        >
          {isRunning ? <PauseCircleIcon className="w-12 h-12" /> : <PlayCircleIcon className="w-12 h-12" />}
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;