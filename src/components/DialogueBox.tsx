/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { retroAudio } from '../audio/retroAudio';
import { DialogueNode } from '../game/types';

interface DialogueBoxProps {
  dialog: DialogueNode;
  onSelectOption: (index: number) => void;
  onClose: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialog,
  onSelectOption,
  onClose,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);

    let charIndex = 0;
    const fullText = dialog.text;
    const interval = window.setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));

      if (charIndex % 3 === 0) {
        retroAudio.playBlip(520 + (charIndex % 4) * 40);
      }

      if (charIndex >= fullText.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [dialog.text]);

  // Keyboard shortcut listener (1-4 keys to pick options, Space/Enter to skip or select 1)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (dialog.options[idx]) {
          onSelectOption(idx);
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (!isTypingComplete) {
          // Skip typewriter
          setDisplayedText(dialog.text);
          setIsTypingComplete(true);
        } else if (dialog.options.length === 1) {
          onSelectOption(0);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog, isTypingComplete, onSelectOption, onClose]);

  // Avatar icon representation
  const renderAvatar = () => {
    switch (dialog.speakerAvatar) {
      case 'rock':
        return (
          <div className="w-14 h-14 bg-slate-800 border-2 border-purple-500 rounded flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-10 h-8 bg-slate-600 rounded-t flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full" />
              <span className="w-2 h-2 bg-black rounded-full" />
            </div>
            <div className="text-[10px] text-cyan-400 font-pixel">💧💧</div>
          </div>
        );
      case 'duck':
        return (
          <div className="w-14 h-14 bg-amber-950 border-2 border-yellow-400 rounded flex items-center justify-center text-2xl">
            🦆
          </div>
        );
      case 'elon':
        return (
          <div className="w-14 h-14 bg-zinc-900 border-2 border-cyan-400 rounded flex items-center justify-center text-2xl animate-spin">
            🚁
          </div>
        );
      case 'oxygen':
        return (
          <div className="w-14 h-14 bg-sky-950 border-2 border-sky-400 rounded flex items-center justify-center text-2xl">
            💨
          </div>
        );
      case 'bill':
        return (
          <div className="w-14 h-14 bg-emerald-950 border-2 border-emerald-400 rounded flex items-center justify-center text-2xl">
            🧾
          </div>
        );
      case 'google':
        return (
          <div className="w-14 h-14 bg-blue-950 border-2 border-blue-400 rounded flex items-center justify-center text-2xl">
            🤖
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 bg-neutral-900 border-2 border-white rounded flex items-center justify-center text-2xl">
            💬
          </div>
        );
    }
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto">
      <div className="bg-slate-950/95 border-4 border-amber-400 p-4 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] backdrop-blur-sm">
        {/* Header zone with Speaker Name, Subtitle, and End Talk Button */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-3">
            {renderAvatar()}
            <div>
              <h3 className="font-pixel text-xs md:text-sm text-yellow-300 tracking-wider">
                {dialog.speaker}
              </h3>
              <p className="text-[11px] text-purple-400 font-retro">
                {dialog.speakerTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="End conversation (ESC)"
            className="px-2 py-1 bg-red-950/80 hover:bg-red-800 border-2 border-red-500 hover:border-red-300 text-red-200 hover:text-white font-pixel text-[9px] transition-colors cursor-pointer shrink-0"
          >
            [X] END TALK (ESC)
          </button>
        </div>

        {/* Text body */}
        <div
          onClick={() => {
            if (!isTypingComplete) {
              setDisplayedText(dialog.text);
              setIsTypingComplete(true);
            }
          }}
          className="text-xs md:text-sm leading-relaxed text-slate-100 font-retro min-h-[4rem] cursor-pointer"
        >
          {displayedText}
          {!isTypingComplete && (
            <span className="inline-block w-2 h-4 bg-yellow-400 ml-1 animate-pulse" />
          )}
        </div>

        {/* Action Options */}
        <div className="mt-4 pt-3 border-t-2 border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-2">
          {dialog.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onSelectOption(idx)}
              className="text-left p-2.5 bg-slate-900 hover:bg-amber-950/80 border-2 border-slate-700 hover:border-yellow-400 transition-colors flex items-start gap-2 group cursor-pointer"
            >
              <span className="font-pixel text-[10px] text-yellow-400 px-1.5 py-0.5 bg-black border border-yellow-500/50 shrink-0">
                [{idx + 1}]
              </span>
              <span className="text-xs font-retro text-slate-200 group-hover:text-yellow-300">
                {option.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
