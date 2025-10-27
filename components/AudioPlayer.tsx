import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, MusicIcon } from './icons';

const AUDIO_URL = 'https://storage.googleapis.com/maker-suite-media/prompter-sounds/lofi-short-loop.mp3';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleCanPlay = () => setIsReady(true);
      const handleError = () => {
        setError("Error al cargar el archivo de audio.");
        setIsReady(false);
      };

      audioElement.addEventListener('canplaythrough', handleCanPlay);
      audioElement.addEventListener('error', handleError);
      
      // Si readyState es 4, significa que tenemos datos suficientes
      if (audioElement.readyState >= 4) {
        handleCanPlay();
      }

      return () => {
        if (audioElement) {
          audioElement.removeEventListener('canplaythrough', handleCanPlay);
          audioElement.removeEventListener('error', handleError);
        }
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current || !isReady) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          setError(null);
        }).catch(err => {
          console.error("Error playing audio:", err);
          setError("No se pudo reproducir. Puede que tu navegador bloquee la reproducción automática.");
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg max-w-sm mx-auto mb-8 flex flex-col border border-gray-100">
      <div className="w-full flex items-center justify-between">
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
          disabled={!isReady}
          aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
          className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-110 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2 text-center w-full">{error}</p>}
      {!isReady && !error && <p className="text-gray-500 text-xs mt-2 text-center w-full">Cargando música...</p>}
    </div>
  );
};

export default AudioPlayer;