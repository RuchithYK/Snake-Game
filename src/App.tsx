import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-terminal overflow-hidden relative selection:bg-[#ff00ff] selection:text-black">
      {/* Glitch Effects */}
      <div className="scanlines"></div>
      <div className="static-noise"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col items-center justify-center mb-8 border-b-4 border-[#ff00ff] pb-4">
          <h1 className="text-2xl md:text-4xl font-pixel tracking-tighter text-[#00ffff] glitch-text" data-text="SYS.OP.TERMINAL">
            SYS.OP.TERMINAL
          </h1>
          <p className="text-[#ff00ff] font-terminal text-xl mt-2 animate-pulse">
            [STATUS: ONLINE] // NEURAL_LINK_ESTABLISHED
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-6xl mx-auto">
          
          {/* Left/Top: Game Area */}
          <div className="w-full lg:w-2/3 border-2 border-[#00ffff] bg-black p-1 shadow-[8px_8px_0px_#ff00ff]">
            <div className="bg-[#ff00ff] text-black px-2 py-1 font-pixel text-[10px] md:text-xs mb-2 flex justify-between items-center">
              <span>MODULE: SERPENT_PROTOCOL</span>
              <span>PID: 0x8F3A</span>
            </div>
            <SnakeGame />
          </div>

          {/* Right/Bottom: Music Player */}
          <div className="w-full lg:w-1/3 border-2 border-[#ff00ff] bg-black p-1 shadow-[8px_8px_0px_#00ffff]">
            <div className="bg-[#00ffff] text-black px-2 py-1 font-pixel text-[10px] md:text-xs mb-2 flex justify-between items-center">
              <span>MODULE: AUDIO_SUBSYSTEM</span>
              <span>PID: 0x1A4B</span>
            </div>
            <MusicPlayer />
          </div>

        </main>

        {/* Footer */}
        <footer className="mt-8 border-t-2 border-[#00ffff] pt-2 flex justify-between text-[#ff00ff] text-xl">
          <span>&gt; AWAITING_INPUT...</span>
          <span className="animate-pulse">_</span>
        </footer>
      </div>
    </div>
  );
}

