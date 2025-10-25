import React, { useState, useEffect, useCallback } from 'react';
import type { Plan, Nivel } from './types';
import { generateWorkoutPlan } from './services/geminiService';
import LevelSelector from './components/LevelSelector';
import WorkoutPlan from './components/WorkoutPlan';
import LoadingSpinner from './components/LoadingSpinner';
import { DumbbellIcon, SparklesIcon, RefreshIcon, TrashIcon } from './components/icons';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [nivel, setNivel] = useState<Nivel>('Nivel 1: Iniciación');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      setError('No se pudo generar el plan de ejercicios. Por favor, inténtalo de nuevo más tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const savedPlanJSON = localStorage.getItem('workoutPlan');
      
      if (savedPlanJSON) {
        const savedPlan = JSON.parse(savedPlanJSON);
        const savedLevel = localStorage.getItem('workoutLevel') as Nivel | null;

        setPlan(savedPlan);
        // Si se guarda un nivel, úsalo. De lo contrario, usa el de iniciación por defecto.
        setNivel(savedLevel || 'Nivel 1: Iniciación');
        setIsLoading(false);
      } else {
        // No se encontró ningún plan, genera uno nuevo.
        fetchPlan('Nivel 1: Iniciación');
      }
    } catch (e) {
      console.error("Fallo al leer el plan desde localStorage", e);
      // Borra los datos potencialmente corruptos y busca un plan nuevo
      localStorage.removeItem('workoutPlan');
      localStorage.removeItem('workoutLevel');
      fetchPlan('Nivel 1: Iniciación');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
    if (window.confirm('¿Estás segura de que quieres borrar el plan guardado? Se generará uno nuevo de iniciación.')) {
      localStorage.removeItem('workoutPlan');
      localStorage.removeItem('workoutLevel');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-center text-center">
           <DumbbellIcon className="h-8 w-8 text-indigo-500 mr-3"/>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Fuerza Activa 50+
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto mb-8 text-center border border-gray-100">
          <SparklesIcon className="h-10 w-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl md:text-2xl font-semibold text-indigo-600 mb-2">¡Tu guía de bienestar diario!</h2>
          <p className="text-gray-600">
            Selecciona tu nivel y descubre una rutina de fuerza diseñada para ti. Cuatro bloques cortos para mantenerte activa, fuerte y llena de energía durante todo el día.
          </p>
        </div>

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
            aria-label="Borrar el plan de ejercicios guardado"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Borrar Plan Guardado
          </button>
        </div>

        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
          {plan && !isLoading && <WorkoutPlan plan={plan} />}
        </div>
      </main>

      <footer className="text-center py-6 mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Fuerza Activa 50+. Creado con ❤️ para mujeres imparables.</p>
      </footer>
    </div>
  );
};

export default App;