import React, { useState, useEffect, useCallback, useRef } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "DATA_STREAM_01",
    artist: "AI_CORE_ALPHA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "MEMORY_LEAK",
    artist: "AI_CORE_BETA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "SYSTEM_OVERRIDE",
    artist: "AI_CORE_GAMMA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={playNext}
      />
      
      <div className="w-full border-2 border-[#00ffff] p-3 mb-6 bg-black">
        <p className="text-[#ff00ff] text-lg mb-2">&gt; CURRENT_TRACK:</p>
        <h3 className="text-[#00ffff] font-pixel text-xs md:text-sm uppercase truncate glitch-text" data-text={currentTrack.title}>
          {currentTrack.title}
        </h3>
        <p className="text-[#00ffff]/70 text-lg mt-2">SRC: {currentTrack.artist}</p>
      </div>

      <div className="flex w-full gap-2 mb-6">
        <button 
          onClick={playPrev}
          className="flex-1 border-2 border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black py-3 font-pixel text-xs transition-none"
        >
          &lt;&lt; PRV
        </button>
        
        <button 
          onClick={togglePlay}
          className="flex-[2] border-2 border-[#00ffff] bg-[#00ffff] text-black hover:bg-black hover:text-[#00ffff] py-3 font-pixel text-xs transition-none"
        >
          {isPlaying ? 'HALT' : 'EXECUTE'}
        </button>
        
        <button 
          onClick={playNext}
          className="flex-1 border-2 border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black py-3 font-pixel text-xs transition-none"
        >
          NXT &gt;&gt;
        </button>
      </div>

      <div className="w-full border-2 border-[#00ffff] p-3 flex flex-col bg-black">
        <label className="text-[#ff00ff] text-lg mb-3">&gt; AUDIO_LEVEL: {Math.round(volume * 100)}%</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full appearance-none bg-black border-2 border-[#ff00ff] h-6 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#00ffff]"
        />
      </div>
    </div>
  );
}
