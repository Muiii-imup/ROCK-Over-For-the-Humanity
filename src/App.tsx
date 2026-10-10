/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/gameEngine';
import { GameWorldState, Direction } from './game/types';
import { RetroGameHeader } from './components/RetroGameHeader';
import { AbsurdityTracker } from './components/AbsurdityTracker';
import { DialogueBox } from './components/DialogueBox';
import { TouchController } from './components/TouchController';
import { HowToPlayModal } from './components/HowToPlayModal';
import { retroAudio } from './audio/retroAudio';
import { AlertCircle, Flame, ShieldAlert } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameWorldState | null>(null);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  // Initialize game engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, (updatedState) => {
      setGameState(updatedState);
    });
    engineRef.current = engine;
    setGameState(engine.state);

    return () => {
      engine.destroy();
      retroAudio.stopBGM();
    };
  }, []);

  // Handle user interaction to unlock browser Web Audio policy
  const handleFirstInteraction = () => {
    if (!hasStartedAudio) {
      retroAudio.startBGM('despair_140');
      setHasStartedAudio(true);
    }
  };

  // Chaos Trigger handlers
  const handleTriggerDuckSlam = () => {
    handleFirstInteraction();
    retroAudio.setTrack('boss_overdepression');
    engineRef.current?.triggerDuckSlam();
  };

  const handleTriggerElonLaunch = () => {
    handleFirstInteraction();
    retroAudio.setTrack('elon_rave');
    engineRef.current?.triggerElonLaunch();
  };

  const handleTriggerSunSupernova = () => {
    handleFirstInteraction();
    retroAudio.setTrack('boss_overdepression');
    engineRef.current?.triggerSunSupernovaAndUnexplode();
  };

  const handleTriggerKageBunshin = () => {
    handleFirstInteraction();
    engineRef.current?.triggerKageBunshin();
  };

  const handleTriggerInvertGravity = () => {
    handleFirstInteraction();
    engineRef.current?.triggerInvertGravity();
  };

  const handleTriggerCrumplePresident = () => {
    handleFirstInteraction();
    engineRef.current?.crumplePresident();
  };

  const handleTriggerDuckRevenge = () => {
    handleFirstInteraction();
    engineRef.current?.triggerDuckRevenge();
  };

  const handlePayDebtScam = () => {
    handleFirstInteraction();
    engineRef.current?.payDebtScam();
  };

  const handleForceSpawnOxygen = () => {
    handleFirstInteraction();
    engineRef.current?.spawnOxygenCan();
  };

  const handleUseCopium = () => {
    handleFirstInteraction();
    engineRef.current?.useCopium();
  };

  // Dialogue actions
  const handleSelectOption = (idx: number) => {
    handleFirstInteraction();
    engineRef.current?.selectDialogueOption(idx);
  };

  const handleCloseDialog = () => {
    engineRef.current?.closeDialog();
  };

  // Touch Controller inputs
  const handleDirectionPress = (dir: Direction | null, isMoving: boolean) => {
    handleFirstInteraction();
    engineRef.current?.setDirectionInput(dir, isMoving);
  };

  const handleActionPress = () => {
    handleFirstInteraction();
    engineRef.current?.triggerInteract();
  };

  return (
    <div
      onClick={handleFirstInteraction}
      className="min-h-screen bg-[#07080b] text-slate-100 font-retro flex flex-col selection:bg-yellow-400 selection:text-black overflow-x-hidden w-full max-w-full"
    >
      {/* 1. RETRO TOP BAR */}
      <RetroGameHeader
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled(!crtEnabled)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
      />

      {/* 2. MAIN RETRO GAME CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 max-w-6xl mx-auto w-full gap-4">
        {/* RUNNING BANNER FOR ABSURD HEADLINES */}
        <div className="w-full bg-red-950/60 border-2 border-red-600/80 px-3 py-1.5 flex items-center justify-between text-[11px] text-red-300 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0 font-pixel text-[10px] text-red-400">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>BREAKING DISASTER:</span>
          </div>
          <div className="truncate font-retro text-slate-300 ml-2">
            {gameState?.sunState === 'supernova'
              ? 'THE SUN HAS EXPLODED! THE ROCK THINKS IT IS TOO DRAMATIC AND PREPARES TO REVERSE ENTROPY!'
              : gameState?.isKageBunshinActive
              ? '45 CRYING CLONES OF THE ROCK FLOOD THE CONTINENT TO EVADE CORPORATE MONETIZATION!'
              : gameState?.isElonSpinning
              ? 'ELON MUSK IS ROTATING AT 3,500 RPM AND EXCEEDING EARTH ESCAPE VELOCITY DUDE!'
              : gameState?.isRockSlammingDuck
              ? 'THE ROCK OVERDEPRESSED AND IS CURRENTLY PILEDRIVING THE INNOCENT DUCK!'
              : 'OXYGEN CONFIRMS HE QUIT HIS JOB. YOUR DEBT IS -$93,000. THE ROCK CONTINUES WEEPING.'}
          </div>
        </div>

        {/* SCREEN & CANVAS FRAME */}
        <div className="relative w-full max-w-[840px] bg-black border-4 border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Internal CRT Scanline and curvature filters */}
          {crtEnabled && (
            <div className="absolute inset-0 pointer-events-none z-20 crt-overlay crt-curvature animate-crt" />
          )}

          {/* Canvas Rendering 800x600 8-bit game world */}
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full aspect-[4/3] block bg-slate-950 pixelated"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Floating In-Game Toast Notifications */}
          {gameState && gameState.notifications.length > 0 && (
            <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 max-w-xs pointer-events-none">
              {gameState.notifications.map((n) => (
                <div
                  key={n.id}
                  className="bg-black/90 border-2 border-amber-400 p-2 shadow-md animate-fade-in text-[10px]"
                >
                  <div className="font-pixel text-yellow-300 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-red-400" />
                    <span>{n.title}</span>
                  </div>
                  <div className="text-slate-300 font-retro mt-0.5 leading-snug">
                    {n.message}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Floating Instructions Pill when starting */}
          {!hasStartedAudio && (
            <div className="absolute bottom-3 right-3 z-30 bg-black/85 border border-yellow-400 px-2.5 py-1 text-[10px] text-yellow-300 font-pixel pointer-events-none animate-pulse">
              CLICK CANVAS TO ACTIVATE 8-BIT CHIPTUNE
            </div>
          )}

          {/* DIALOGUE BOX MODAL OVERLAY */}
          {gameState?.activeDialog && (
            <DialogueBox
              dialog={gameState.activeDialog}
              onSelectOption={handleSelectOption}
              onClose={handleCloseDialog}
            />
          )}
        </div>

        {/* 3. TOUCH CONTROLS (Displayed on Mobile & Tablet) */}
        <div className="w-full max-w-[840px] md:hidden">
          <TouchController
            onDirectionPress={handleDirectionPress}
            onActionPress={handleActionPress}
            onCopiumPress={handleUseCopium}
          />
        </div>

        {/* 4. ABSURDITY TRACKER HUD & CHAOS CONTROLLER */}
        {gameState && (
          <div className="w-full max-w-[840px]">
            <AbsurdityTracker
              state={gameState}
              onTriggerDuckSlam={handleTriggerDuckSlam}
              onTriggerElonLaunch={handleTriggerElonLaunch}
              onTriggerSunSupernova={handleTriggerSunSupernova}
              onTriggerKageBunshin={handleTriggerKageBunshin}
              onTriggerInvertGravity={handleTriggerInvertGravity}
              onTriggerCrumplePresident={handleTriggerCrumplePresident}
              onTriggerDuckRevenge={handleTriggerDuckRevenge}
              onPayDebtScam={handlePayDebtScam}
              onForceSpawnOxygen={handleForceSpawnOxygen}
              onUseCopium={handleUseCopium}
            />
          </div>
        )}

        {/* 5. BOTTOM FOOTER */}
        <footer className="w-full max-w-[840px] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-retro pt-2 pb-6 border-t border-slate-900 gap-2">
          <div className="flex items-center gap-2">
            <span>ROCK: Over For the World</span>
            <span>·</span>
            <span>Unpaid Debt: -$93,000.00</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">Pure Nonsense 8-Bit Architecture</span>
            <span>·</span>
            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="text-yellow-400 hover:underline cursor-pointer"
            >
              Lore Codex
            </button>
          </div>
        </footer>
      </main>

      {/* HOW TO PLAY & LORE MODAL */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
