import React, { useState, useEffect, useCallback } from 'react';
import type { Plan, Nivel, HistoryEntry } from './types';
import { generateWorkoutPlan } from './services/geminiService';
import * as historyService from './services/historyService';
import LevelSelector from './components/LevelSelector';
import WorkoutPlan from './components/WorkoutPlan';
import LoadingSpinner from './components/LoadingSpinner';
import { RefreshIcon, TrashIcon, CheckCircleIcon, TrophyIcon } from './components/icons';
import AudioPlayer from './components/AudioPlayer';
import SplashScreen from './components/SplashScreen';
import WorkoutHistory from './components/WorkoutHistory';
import Logo from './components/Logo';


const App: React.FC = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [nivel, setNivel] = useState<Nivel>('Nivel 1: Iniciación');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isTodayCompleted, setIsTodayCompleted] = useState<boolean>(false);

  const getTodayDateString = () => {
    // This creates a date string in YYYY-MM-DD format based on the user's local timezone,
    // which is more reliable than toISOString() for this use case.
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
  }

  const fetchPlan = useCallback(async (selectedNivel: Nivel) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);
    try {
      const newPlan = await generateWorkoutPlan(selectedNivel);
      setPlan(newPlan);
      localStorage.setItem('workoutPlan', JSON.stringify(newPlan));
      localStorage.setItem('workoutLevel', selectedNivel);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // Display splash screen for 3.5 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSplash) return; 

    // Load history on initial mount after splash
    const loadedHistory = historyService.getHistory();
    setHistory(loadedHistory);
    const today = getTodayDateString();
    setIsTodayCompleted(loadedHistory.some(entry => entry.date === today));

    try {
      const savedPlanJSON = localStorage.getItem('workoutPlan');
      
      if (savedPlanJSON) {
        const savedPlan = JSON.parse(savedPlanJSON);
        const savedLevel = localStorage.getItem('workoutLevel') as Nivel | null;

        setPlan(savedPlan);
        setNivel(savedLevel || 'Nivel 1: Iniciación');
        setIsLoading(false);
      } else {
        fetchPlan('Nivel 1: Iniciación');
      }
    } catch (e) {
      console.error("Fallo al leer el plan desde localStorage", e);
      localStorage.removeItem('workoutPlan');
      localStorage.removeItem('workoutLevel');
      fetchPlan('Nivel 1: Iniciación');
    }
  }, [showSplash, fetchPlan]);


  const handleLevelChange = (newNivel: Nivel) => {
    setNivel(newNivel);
    fetchPlan(newNivel);
  };

  const handleGenerateNewPlan = () => {
    if (window.confirm('¿Seguro que quieres generar un nuevo plan? Se reemplazará el plan actual.')) {
      fetchPlan(nivel);
    }
  };

  const handleClearPlan = () => {
    if (window.confirm('¿Estás segura de que quieres borrar el plan guardado y el historial? Se generará uno nuevo de iniciación.')) {
      localStorage.removeItem('workoutPlan');
      localStorage.removeItem('workoutLevel');
      localStorage.removeItem('workoutHistory');
      window.location.reload();
    }
  };

  const handleMarkDayAsComplete = () => {
    const today = getTodayDateString();
    if (isTodayCompleted) return;

    const newEntry: HistoryEntry = {
      date: today,
      level: nivel,
    };
    const updatedHistory = historyService.addHistoryEntry(newEntry);
    setHistory(updatedHistory);
    setIsTodayCompleted(true);
  };

  const renderMainApp = () => (
    <div style={{ animation: 'fadeIn 1s ease-in-out' }}>
       <style>
        {`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}
      </style>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center text-center">
          <Logo size="small" />
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <AudioPlayer />
        <LevelSelector selectedLevel={nivel} onSelectLevel={handleLevelChange} />

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
          <button
            onClick={handleGenerateNewPlan}
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
            aria-label="Generar un nuevo plan de ejercicios"
          >
            <RefreshIcon className="h-5 w-5 mr-2" />
            Generar Nuevo Plan
          </button>
          <button
            onClick={handleClearPlan}
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-105"
            aria-label="Borrar el plan de ejercicios guardado y el historial"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Borrar Datos
          </button>
        </div>

        <WorkoutHistory history={history} />

        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
          {plan && !isLoading && (
            <>
              <WorkoutPlan plan={plan} />
              <div className="mt-10 text-center">
                <button
                  onClick={handleMarkDayAsComplete}
                  disabled={isTodayCompleted}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                  aria-label="Marcar el día como completado"
                >
                  {isTodayCompleted ? (
                    <>
                      <CheckCircleIcon className="h-6 w-6 mr-3" />
                      ¡Día Completado!
                    </>
                  ) : (
                    <>
                      <TrophyIcon className="h-6 w-6 mr-3" />
                       Marcar Día como Completado
                    </>
                  )}
                </button>
                {isTodayCompleted && (
                    <p className="text-gray-600 mt-3 animate-fade-in-up">¡Felicidades! Vuelve mañana por tu siguiente rutina.</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="text-center py-6 mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Fuerza Activa 50+. Creado con ❤️ para mujeres imparables.</p>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
       {showSplash ? <SplashScreen /> : renderMainApp()}
    </div>
  );
};

export default App;