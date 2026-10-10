/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface DialogueOption {
  text: string;
  action?: () => void;
  nextDialogId?: string;
  debtImpact?: number;
  depressionImpact?: number;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerTitle: string;
  speakerAvatar: 'rock' | 'oxygen' | 'duck' | 'elon' | 'bill' | 'google' | 'sun';
  text: string;
  options: DialogueOption[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  symbol?: string;
}

export interface RockClone {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phrase: string;
  color: string;
  scale: number;
}

export interface CybertruckEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
}

export interface CopiumItem {
  id: string;
  x: number;
  y: number;
  active: boolean;
}

export interface AbsurdEventNotification {
  id: string;
  title: string;
  message: string;
  timeRemaining: number;
  type: 'doom' | 'debt' | 'elon' | 'sun' | 'ninja' | 'duck';
}

export interface FloatingPunishment {
  id: string;
  text: string;
  x: number;
  y: number;
  life: number;
  color: string;
}

export interface GameQuestProgress {
  metTheRock: boolean;
  sufferedOxygenResignation: boolean;
  witnessedDuckSlam: boolean;
  elonStratosphereLaunch: boolean;
  sunExplodeAndUnexploded: boolean;
  auditedByPresidentBill: boolean;
  googleKageBunshinTriggered: boolean;
}

export interface GameWorldState {
  // Player stats
  playerX: number;
  playerY: number;
  playerDirection: Direction;
  playerMoving: boolean;
  playerMoney: number; // Always around -93000
  playerOxygen: number; // 0 to 100
  playerCopiumCans: number; // Max 10
  maxCopiumCapacity: number; // 10

  // Oxygen 1-minute spawn cycle
  oxygenSpawnTimer: number; // 60s countdown
  copiumItems: CopiumItem[];

  // Rock & Reality state
  rockDepression: number; // 0 to 100
  rockAuraPulse: number;
  isRockSlammingDuck: boolean;
  slamPhase: number;
  slamsDelivered: number;

  // Duck state
  duckX: number;
  duckY: number;
  duckSquish: number; // 1 = normal, 0.2 = flattened flatbread
  duckTraumaQuotes: string[];
  duckRevengeActive: boolean;

  // Elon state
  elonX: number;
  elonY: number;
  elonSpinAngle: number;
  elonAltitude: number;
  isElonSpinning: boolean;
  elonSpeed: number;
  cybertrucks: CybertruckEntity[];

  // Sun state
  sunState: 'normal' | 'supernova' | 'unexploding' | 'repaired';
  sunProgress: number; // 0 to 1

  // Google & Kage Bunshin state
  isKageBunshinActive: boolean;
  clones: RockClone[];

  // President Bill stats
  executiveOrdersPassed: number;
  billsIssued: number;
  isPresidentCrumpled: boolean;
  crumpleTimer: number;

  // Reality distortion & Punishments
  isGravityInverted: boolean;
  invertedGravityTimer: number;
  floatingPunishments: FloatingPunishment[];

  // Audio / visual FX
  screenShake: number;
  screenFlash: string | null;
  crtFilterEnabled: boolean;
  particles: Particle[];

  // Quests & Logs
  quests: GameQuestProgress;
  activeDialog: DialogueNode | null;
  notifications: AbsurdEventNotification[];
}
