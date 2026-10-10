/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameWorldState } from '../game/types';

interface AbsurdityTrackerProps {
  state: GameWorldState;
  onTriggerDuckSlam: () => void;
  onTriggerElonLaunch: () => void;
  onTriggerSunSupernova: () => void;
  onTriggerKageBunshin: () => void;
  onTriggerInvertGravity: () => void;
  onTriggerCrumplePresident: () => void;
  onTriggerDuckRevenge: () => void;
  onPayDebtScam: () => void;
  onForceSpawnOxygen: () => void;
  onUseCopium: () => void;
}

export const AbsurdityTracker: React.FC<AbsurdityTrackerProps> = ({
  state,
  onTriggerDuckSlam,
  onTriggerElonLaunch,
  onTriggerSunSupernova,
  onTriggerKageBunshin,
  onTriggerInvertGravity,
  onTriggerCrumplePresident,
  onTriggerDuckRevenge,
  onPayDebtScam,
  onForceSpawnOxygen,
  onUseCopium,
}) => {
  const quests = state.quests;
  const completedCount = Object.values(quests).filter(Boolean).length;
  const activeGroundCans = state.copiumItems.filter((c) => c.active).length;
  const totalCans = activeGroundCans + state.playerCopiumCans;

  return (
    <div className="bg-slate-950 border-4 border-slate-700 p-3 md:p-4 text-xs font-retro text-slate-200 shadow-2xl flex flex-col gap-4">
      {/* SECTION 1: TOP STATUS GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* PLAYER BALANCE */}
        <div className="bg-slate-900 border-2 border-red-500/80 p-2.5">
          <div className="flex justify-between items-center text-[10px] text-red-400 font-pixel">
            <span>BANK BALANCE</span>
            <span className="text-[9px] bg-red-950 px-1 py-0.5 border border-red-700 text-red-300">
              AUDITED
            </span>
          </div>
          <div className="text-sm sm:text-base font-pixel text-red-400 mt-1.5 tracking-tight font-bold">
            ${state.playerMoney.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Pres. Bill: Overdue $420.69</span>
            <button
              onClick={onPayDebtScam}
              title="Pay $1 towards debt (Adds $4,999 processing fee)"
              className="text-[9px] text-yellow-400 hover:text-white underline cursor-pointer"
            >
              PAY $1 (SCAM)
            </button>
          </div>
        </div>

        {/* OXYGEN 1-MINUTE CYCLE & RESERVES */}
        <div className="bg-slate-900 border-2 border-sky-500/80 p-2.5">
          <div className="flex justify-between items-center text-[10px] text-sky-400 font-pixel">
            <span>O2 RESIGNATION</span>
            <span className="text-[9px] bg-sky-950 px-1 py-0.5 border border-sky-700 text-sky-300">
              {totalCans >= state.maxCopiumCapacity ? 'MAX 10 CANS' : `DROP: ${state.oxygenSpawnTimer}s`}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-950 h-3 border border-sky-700/50 relative overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                state.playerOxygen < 25 ? 'bg-red-500 animate-pulse' : 'bg-sky-400'
              }`}
              style={{ width: `${state.playerOxygen}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
            <span>Hold: {state.playerCopiumCans}/10 | Ground: {activeGroundCans}</span>
            <button
              onClick={onUseCopium}
              disabled={state.playerCopiumCans <= 0}
              className={`text-[9px] font-pixel px-1.5 py-0.5 border ${
                state.playerCopiumCans > 0
                  ? 'bg-sky-800 hover:bg-sky-700 text-white border-sky-400 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              }`}
            >
              CHUG COPIUM
            </button>
          </div>
        </div>

        {/* ROCK DEPRESSION METER */}
        <div className="bg-slate-900 border-2 border-purple-500/80 p-2.5">
          <div className="flex justify-between items-center text-[10px] text-purple-400 font-pixel">
            <span>ROCK GLOOM</span>
            <span className="text-[9px] bg-purple-950 px-1 py-0.5 border border-purple-700 text-purple-300">
              {state.rockDepression >= 100 ? 'OVERDEPRESSED' : 'WEEPING'}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-950 h-3 border border-purple-700/50 relative overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${state.rockDepression}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
            <span>Slams: {state.slamsDelivered}</span>
            <span>{state.isGravityInverted ? 'GRAVITY: DIVORCED' : '4.2B Yrs Sadness'}</span>
          </div>
        </div>

        {/* COSMIC ENTROPY & PRESIDENT STATUS */}
        <div className="bg-slate-900 border-2 border-amber-500/80 p-2.5">
          <div className="flex justify-between items-center text-[10px] text-amber-400 font-pixel">
            <span>COSMIC REALITY</span>
            <span className="text-[9px] bg-amber-950 px-1 py-0.5 border border-amber-700 text-amber-300">
              {state.isPresidentCrumpled ? 'PRES. CRUMPLED' : state.sunState.toUpperCase()}
            </span>
          </div>
          <div className="text-xs font-pixel text-amber-300 mt-1.5 truncate">
            {state.isPresidentCrumpled
              ? '🧾 BILL FOLDED INTO CRIME'
              : state.sunState === 'normal'
              ? '☀️ SHINING SUSPICIOUSLY'
              : state.sunState === 'supernova'
              ? '🔥 SUPERNOVA COLLAPSE!'
              : state.sunState === 'unexploding'
              ? '⏪ REVERSING PHYSICS...'
              : '🩹 BAND-AID ON SUN'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Elon Alt: {Math.floor(state.elonAltitude * 100)} km</span>
            <span>Trucks: {state.cybertrucks.length}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: 1,000,000X CHAOS TRIGGER DECK */}
      <div className="bg-slate-900 border-2 border-slate-700 p-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-pixel text-[10px] text-yellow-400 tracking-wider">
            ⚡ 1,000,000x CHAOS & ABSURDITY DECK
          </span>
          <span className="text-[10px] text-slate-400 font-retro">
            Full Nonsense Controls
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* TRIGGER 1: SLAM DUCK */}
          <button
            onClick={onTriggerDuckSlam}
            className="p-2 bg-red-950/80 hover:bg-red-900 border-2 border-red-600 hover:border-red-400 text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm">🦆💥</div>
            <div className="font-pixel text-[9px] text-red-300 mt-1 group-hover:text-white">
              SLAM DUCK
            </div>
            <div className="text-[8px] text-red-400/80 mt-0.5">
              Piledriver flatbread
            </div>
          </button>

          {/* TRIGGER 2: ELON HELICOPTER SPIN */}
          <button
            onClick={onTriggerElonLaunch}
            className="p-2 bg-sky-950/80 hover:bg-sky-900 border-2 border-sky-600 hover:border-sky-400 text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm">🚁🚀</div>
            <div className="font-pixel text-[9px] text-sky-300 mt-1 group-hover:text-white">
              ELON ROTOR
            </div>
            <div className="text-[8px] text-sky-400/80 mt-0.5">
              Fly to sky + trucks
            </div>
          </button>

          {/* TRIGGER 3: SUN UNEXPLODE */}
          <button
            onClick={onTriggerSunSupernova}
            className="p-2 bg-amber-950/80 hover:bg-amber-900 border-2 border-amber-600 hover:border-amber-400 text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm">☀️💥⏪</div>
            <div className="font-pixel text-[9px] text-amber-300 mt-1 group-hover:text-white">
              SUN UNEXPLODE
            </div>
            <div className="text-[8px] text-amber-400/80 mt-0.5">
              Reverse supernova
            </div>
          </button>

          {/* TRIGGER 4: GOOGLE KAGE BUNSHIN */}
          <button
            onClick={onTriggerKageBunshin}
            className="p-2 bg-purple-950/80 hover:bg-purple-900 border-2 border-purple-600 hover:border-purple-400 text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm">🥷🪨</div>
            <div className="font-pixel text-[9px] text-purple-300 mt-1 group-hover:text-white">
              KAGE BUNSHIN
            </div>
            <div className="text-[8px] text-purple-400/80 mt-0.5">
              45 weeping clones
            </div>
          </button>

          {/* TRIGGER 5: CRUMPLE PRESIDENT BILL */}
          <button
            onClick={onTriggerCrumplePresident}
            className="p-2 bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-600 hover:border-emerald-400 text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm">🧾🗑️</div>
            <div className="font-pixel text-[9px] text-emerald-300 mt-1 group-hover:text-white">
              CRUMPLE POTUS
            </div>
            <div className="text-[8px] text-emerald-400/80 mt-0.5">
              Origami audit ball
            </div>
          </button>

          {/* TRIGGER 6: INVERT REALITY GRAVITY */}
          <button
            onClick={onTriggerInvertGravity}
            className="p-2 bg-fuchsia-950/80 hover:bg-fuchsia-900 border-2 border-fuchsia-600 hover:border-fuchsia-400 text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm">🙃🌌</div>
            <div className="font-pixel text-[9px] text-fuchsia-300 mt-1 group-hover:text-white">
              INVERT GRAVITY
            </div>
            <div className="text-[8px] text-fuchsia-400/80 mt-0.5">
              Flip world upside down
            </div>
          </button>
        </div>

        {/* SECOND ROW OF ABSURD QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800">
          <button
            onClick={onTriggerDuckRevenge}
            className="px-2.5 py-1.5 bg-yellow-950/60 hover:bg-yellow-900 border border-yellow-500/80 text-yellow-300 font-pixel text-[9px] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🦆⚡ MEGA REVENGE QUACK</span>
          </button>

          <button
            onClick={onForceSpawnOxygen}
            className="px-2.5 py-1.5 bg-sky-950/60 hover:bg-sky-900 border border-sky-500/80 text-sky-300 font-pixel text-[9px] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>💨 DROP OXYGEN CAN (MAX 10)</span>
          </button>

          <button
            onClick={onPayDebtScam}
            className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/80 text-red-300 font-pixel text-[9px] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>💸 PAY $1 TOWARDS DEBT (-$5,000 FEE)</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: MASTERPIECE LORE CHECKLIST */}
      <div className="bg-slate-900 border-2 border-slate-700 p-2.5">
        <div className="flex justify-between items-center mb-2">
          <span className="font-pixel text-[10px] text-slate-300">
            MASTERPIECE CHECKLIST: {completedCount}/7 COMPLETED
          </span>
          <span className="text-[10px] text-emerald-400 font-pixel">
            {completedCount === 7 ? '★ REALITY COLLAPSED ★' : 'IN PROGRESS'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className={quests.metTheRock ? 'text-emerald-400' : 'text-slate-600'}>
              {quests.metTheRock ? '☑' : '☐'}
            </span>
            <span className={quests.metTheRock ? 'line-through text-slate-500' : ''}>
              Meet the Depressed Rock
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className={quests.sufferedOxygenResignation ? 'text-emerald-400' : 'text-slate-600'}>
              {quests.sufferedOxygenResignation ? '☑' : '☐'}
            </span>
            <span className={quests.sufferedOxygenResignation ? 'line-through text-slate-500' : ''}>
              Oxygen quits his job (HR notice)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className={quests.witnessedDuckSlam ? 'text-emerald-400' : 'text-slate-600'}>
              {quests.witnessedDuckSlam ? '☑' : '☐'}
            </span>
            <span className={quests.witnessedDuckSlam ? 'line-through text-slate-500' : ''}>
              Overdepressed Rock slams duck
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className={quests.elonStratosphereLaunch ? 'text-emerald-400' : 'text-slate-600'}>
              {quests.elonStratosphereLaunch ? '☑' : '☐'}
            </span>
            <span className={quests.elonStratosphereLaunch ? 'line-through text-slate-500' : ''}>
              Elon spins & flies to the sky
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className={quests.sunExplodeAndUnexploded ? 'text-emerald-400' : 'text-slate-600'}>
              {quests.sunExplodeAndUnexploded ? '☑' : '☐'}
            </span>
            <span className={quests.sunExplodeAndUnexploded ? 'line-through text-slate-500' : ''}>
              Sun explodes & Rock unexplodes it
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className={quests.auditedByPresidentBill ? 'text-emerald-400' : 'text-slate-600'}>
              {quests.auditedByPresidentBill ? '☑' : '☐'}
            </span>
            <span className={quests.auditedByPresidentBill ? 'line-through text-slate-500' : ''}>
              President is an unpaid utility bill
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className={quests.googleKageBunshinTriggered ? 'text-emerald-400' : 'text-slate-600'}>
              {quests.googleKageBunshinTriggered ? '☑' : '☐'}
            </span>
            <span className={quests.googleKageBunshinTriggered ? 'line-through text-slate-500' : ''}>
              Google buyout & Kage Bunshin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
