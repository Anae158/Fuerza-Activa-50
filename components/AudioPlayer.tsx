import React, { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, MusicIcon } from './icons';

const AUDIO_URL = 'https://archive.org/download/cinematic-background-music-for-video-and-vlogs-by-tunestogo/Music%20For%20Video%20Library.mp3';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (!audioRef.current) {
      return;
    }

    const nextIsPlaying = !isPlaying;
    
    // Actualizamos el estado de la UI de forma optimista
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      // El método play() devuelve una promesa que puede ser rechazada
      // si el navegador bloquea la reproducción automática.
      audioRef.current.play().catch(error => {
        console.error("Error al reproducir el audio:", error);
        // Si falla la reproducción, revertimos el estado para que la UI sea correcta.
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg max-w-sm mx-auto mb-8 flex items-center justify-between border border-gray-100">
      <div className="flex items-center">
        <MusicIcon className="h-8 w-8 text-indigo-500 mr-3" />
        <div>
          <p className="font-semibold text-gray-800">Música de fondo</p>
          <p className="text-sm text-gray-500">Relajante y motivadora</p>
        </div>
      </div>
      
      <audio 
        ref={audioRef} 
        src={AUDIO_URL} 
        loop 
        preload="auto" 
      />
      
      <button
        onClick={togglePlayPause}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-110"
      >
        {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default AudioPlayer;