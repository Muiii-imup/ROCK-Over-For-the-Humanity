/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Tv, HelpCircle, SkipForward, Music } from 'lucide-react';
import { retroAudio, TRACK_LIST, TrackMetadata } from '../audio/retroAudio';

interface RetroGameHeaderProps {
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onOpenHowToPlay: () => void;
}

export const RetroGameHeader: React.FC<RetroGameHeaderProps> = ({
  crtEnabled,
  onToggleCrt,
  onOpenHowToPlay,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata>(TRACK_LIST[0]);
  const [levels, setLevels] = useState<[number, number, number, number]>([0, 0, 0, 0]);

  // Animated visualizer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setLevels([...retroAudio.channelLevels]);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const muted = retroAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      retroAudio.startBGM(currentTrack.id);
    }
  };

  const handleNextTrack = () => {
    const next = retroAudio.nextTrack();
    setCurrentTrack(next);
    if (isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <header className="w-full flex items-center justify-between gap-2 px-2.5 sm:px-4 py-2 bg-slate-950 border-b-2 border-slate-800 text-slate-200 overflow-x-hidden">
      {/* Zone 1: Brand Wordmark (Compact on mobile so it never pushes controls off-screen) */}
      <div className="flex items-center gap-1.5 shrink min-w-0">
        <span className="font-pixel text-[11px] sm:hidden text-yellow-400 tracking-tight whitespace-nowrap">
          ROCK 🪨
        </span>
        <span className="font-pixel hidden sm:inline text-xs md:text-sm text-yellow-400 tracking-wider whitespace-nowrap">
          ROCK: Over For the World
        </span>
      </div>

      {/* Zone 2: PEAK CHIPTUNE JUKEBOX & 8-BIT LED EQUALIZER (Desktop / Tablet) */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-slate-900 border border-slate-700/80 rounded-none shrink-0 max-w-sm">
        <div className="flex items-center gap-1.5 text-yellow-400 shrink-0">
          <Music className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-pixel text-[9px] text-yellow-300 truncate max-w-[170px]">
            {currentTrack.emoji} {currentTrack.title}
          </span>
        </div>

        {/* 4-Channel 8-bit LED Equalizer Bars */}
        <div className="flex items-end gap-1 h-4 px-1.5 py-0.5 bg-black border border-slate-800 shrink-0">
          {levels.map((lvl, idx) => {
            const h = Math.max(2, Math.round(lvl * 12));
            const barColors = ['bg-emerald-400', 'bg-cyan-400', 'bg-amber-400', 'bg-rose-400'];
            return (
              <div
                key={idx}
                className={`w-1 transition-all duration-75 ${barColors[idx]}`}
                style={{ height: `${h}px` }}
                title={`Channel ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Next Track button */}
        <button
          onClick={handleNextTrack}
          title="Switch to next PEAK Chiptune track"
          className="px-1.5 py-0.5 bg-yellow-950 hover:bg-yellow-900 border border-yellow-500 text-yellow-300 font-pixel text-[8px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <SkipForward className="w-2.5 h-2.5" />
          <span>NEXT</span>
        </button>
      </div>

      {/* Zone 3: Primary Actions (Guaranteed 100% visible on all mobile screens!) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Next Track Button (Mobile Icon Only) */}
        <button
          onClick={handleNextTrack}
          title={`Next Track: ${currentTrack.title}`}
          className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 border-2 border-yellow-600/80 bg-amber-950/60 hover:bg-amber-900 text-yellow-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Mute / Unmute Button */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute 8-bit Audio' : 'Mute Audio'}
          className={`h-8 sm:h-9 px-2 sm:px-2.5 border-2 text-[10px] font-pixel flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            isMuted
              ? 'border-red-600 bg-red-950/70 text-red-300'
              : 'border-yellow-500 bg-amber-950/70 text-yellow-300'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
          <span className="hidden md:inline">{isMuted ? 'MUTED' : 'CHIPTUNE'}</span>
        </button>

        {/* CRT Scanline Toggle */}
        <button
          onClick={onToggleCrt}
          title="Toggle CRT Scanline Overlay"
          className={`h-8 sm:h-9 px-2 sm:px-2.5 border-2 text-[10px] font-pixel flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            crtEnabled
              ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300'
              : 'border-slate-600 bg-slate-900 text-slate-400'
          }`}
        >
          <Tv className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden md:inline">CRT {crtEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Help / Lore Modal */}
        <button
          onClick={onOpenHowToPlay}
          title="Story & Lore Guide"
          className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-slate-700 hover:border-yellow-400 bg-slate-900 text-slate-300 hover:text-yellow-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
