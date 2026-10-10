/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, AlertTriangle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-slate-950 border-4 border-amber-400 max-w-2xl w-full p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-slate-200 font-retro max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="font-pixel text-xs sm:text-sm text-yellow-400">
              ROCK: OVER FOR THE WORLD (THE MASTERPIECE)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Summary */}
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="bg-purple-950/40 border-2 border-purple-800 p-3">
            <h3 className="font-pixel text-[11px] text-purple-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> THE UNHINGED LORE
            </h3>
            <p className="text-slate-300">
              A single ancient rock is so overwhelmingly, profoundly depressed that reality itself is breaking down. Humanity is punished physically and mentally by its sheer gravity of despair.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="bg-slate-900 border border-slate-800 p-2.5">
              <span className="font-pixel text-sky-400 block mb-1">💨 OXYGEN RESIGNED (1 MIN SPAWN)</span>
              <p className="text-slate-400">
                Oxygen quit his job! Fresh Canned Copium spawns every 1 minute across the map (max 10 cans capacity). Chug cans to keep breathing!
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2.5">
              <span className="font-pixel text-yellow-400 block mb-1">🦆 THE DUCK SLAM & REVENGE</span>
              <p className="text-slate-400">
                The Rock repeatedly slams the duck into flatbread, but the duck can retaliate with a supersonic MEGA REVENGE QUACK!
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2.5">
              <span className="font-pixel text-cyan-400 block mb-1">🚁 ELON ROTOR & CYBERTRUCKS</span>
              <p className="text-slate-400">
                Elon Musk spins at 3,500 RPM into the stratosphere and deploys bouncing low-poly Cybertrucks for zero reason dude.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2.5">
              <span className="font-pixel text-amber-400 block mb-1">☀️ SUN UNEXPLOSION</span>
              <p className="text-slate-400">
                The Sun goes supernova, but the Rock sighs so loudly that his unlogical nonsense depression reverses entropy and unexplodes it!
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2.5">
              <span className="font-pixel text-emerald-400 block mb-1">🧾 PRESIDENT BILL & ESCAPE</span>
              <p className="text-slate-400">
                President is an unpaid utility invoice (-$93,000 debt). End talks via [X] END TALK, crumple the President into an origami wad, or show an expired coupon!
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2.5">
              <span className="font-pixel text-purple-400 block mb-1">🥷 KAGE BUNSHIN & INVERT GRAVITY</span>
              <p className="text-slate-400">
                Google buyout spawns 45 weeping ninja clones. Plus you can invert gravity of reality upside down at any time!
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-900 border-2 border-amber-500/50 p-3">
            <h4 className="font-pixel text-[10px] text-yellow-300 mb-2">CONTROLS & SHORTCUTS:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <li>• <span className="text-yellow-400">WASD / Arrow Keys</span>: Move character</li>
              <li>• <span className="text-yellow-400">E / Space</span>: Interact / Talk with NPCs</li>
              <li>• <span className="text-yellow-400">ESC / [X] button</span>: Instantly end any conversation</li>
              <li>• <span className="text-yellow-400">1 - 5</span>: Choose dialogue response</li>
              <li>• <span className="text-yellow-400">Chaos Deck Buttons</span>: Trigger absurd events on demand</li>
              <li>• <span className="text-yellow-400">Oxygen Drop</span>: Spawns every 60s (max 10 cans)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-pixel text-xs transition-colors cursor-pointer"
          >
            ENTER THE DESPAIR
          </button>
        </div>
      </div>
    </div>
  );
};
