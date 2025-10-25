import React, { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, MusicIcon } from './icons';

const AUDIO_URL = 'https://cdn.pixabay.com/download/audio/2022/10/19/audio_b299e71569.mp3'; // Relaxing Lo-fi track

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => console.error("Error playing audio:", error));
        }
        setIsPlaying(!isPlaying);
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
      <audio ref={audioRef} src={AUDIO_URL} loop />
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
