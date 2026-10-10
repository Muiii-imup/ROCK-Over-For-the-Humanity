/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Direction } from '../game/types';

interface TouchControllerProps {
  onDirectionPress: (dir: Direction | null, isMoving: boolean) => void;
  onActionPress: () => void;
  onCopiumPress: () => void;
}

export const TouchController: React.FC<TouchControllerProps> = ({
  onDirectionPress,
  onActionPress,
  onCopiumPress,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-slate-950/80 border-t-2 border-slate-800 select-none md:hidden">
      {/* RETRO D-PAD */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* UP */}
        <button
          onTouchStart={() => onDirectionPress('up', true)}
          onTouchEnd={() => onDirectionPress(null, false)}
          onMouseDown={() => onDirectionPress('up', true)}
          onMouseUp={() => onDirectionPress(null, false)}
          className="absolute top-0 w-10 h-11 bg-slate-800 active:bg-amber-500 border-2 border-slate-600 rounded-t flex items-center justify-center text-xs text-slate-300 font-pixel"
        >
          ▲
        </button>

        {/* DOWN */}
        <button
          onTouchStart={() => onDirectionPress('down', true)}
          onTouchEnd={() => onDirectionPress(null, false)}
          onMouseDown={() => onDirectionPress('down', true)}
          onMouseUp={() => onDirectionPress(null, false)}
          className="absolute bottom-0 w-10 h-11 bg-slate-800 active:bg-amber-500 border-2 border-slate-600 rounded-b flex items-center justify-center text-xs text-slate-300 font-pixel"
        >
          ▼
        </button>

        {/* LEFT */}
        <button
          onTouchStart={() => onDirectionPress('left', true)}
          onTouchEnd={() => onDirectionPress(null, false)}
          onMouseDown={() => onDirectionPress('left', true)}
          onMouseUp={() => onDirectionPress(null, false)}
          className="absolute left-0 w-11 h-10 bg-slate-800 active:bg-amber-500 border-2 border-slate-600 rounded-l flex items-center justify-center text-xs text-slate-300 font-pixel"
        >
          ◀
        </button>

        {/* RIGHT */}
        <button
          onTouchStart={() => onDirectionPress('right', true)}
          onTouchEnd={() => onDirectionPress(null, false)}
          onMouseDown={() => onDirectionPress('right', true)}
          onMouseUp={() => onDirectionPress(null, false)}
          className="absolute right-0 w-11 h-10 bg-slate-800 active:bg-amber-500 border-2 border-slate-600 rounded-r flex items-center justify-center text-xs text-slate-300 font-pixel"
        >
          ▶
        </button>

        {/* Center hub */}
        <div className="w-10 h-10 bg-slate-900 border border-slate-700" />
      </div>

      {/* ACTION BUTTONS (A & B) */}
      <div className="flex items-center gap-4">
        {/* B BUTTON: COPIUM */}
        <button
          onClick={onCopiumPress}
          className="w-14 h-14 bg-sky-900 active:bg-sky-600 border-4 border-sky-500 rounded-full flex flex-col items-center justify-center text-white font-pixel shadow-lg cursor-pointer"
        >
          <span className="text-xs">B</span>
          <span className="text-[7px]">O2</span>
        </button>

        {/* A BUTTON: TALK / INTERACT */}
        <button
          onClick={onActionPress}
          className="w-16 h-16 bg-red-700 active:bg-red-500 border-4 border-amber-400 rounded-full flex flex-col items-center justify-center text-white font-pixel shadow-lg cursor-pointer"
        >
          <span className="text-sm">A</span>
          <span className="text-[8px]">TALK</span>
        </button>
      </div>
    </div>
  );
};
