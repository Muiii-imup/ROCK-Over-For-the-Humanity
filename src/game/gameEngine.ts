/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { retroAudio } from '../audio/retroAudio';
import { SpriteRenderer } from './sprites';
import {
  CopiumItem,
  CybertruckEntity,
  DialogueNode,
  Direction,
  FloatingPunishment,
  GameWorldState,
  Particle,
  RockClone,
} from './types';
import { DIALOGUES } from './dialogues';

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private tick: number = 0;

  // Key tracking
  public keys: Record<string, boolean> = {};

  // World dimensions
  public width: number = 800;
  public height: number = 600;

  // Callback to update React state
  public onStateUpdate?: (state: GameWorldState) => void;

  public state: GameWorldState;

  constructor(canvas: HTMLCanvasElement, onStateUpdate?: (state: GameWorldState) => void) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D context');
    this.ctx = context;
    this.onStateUpdate = onStateUpdate;

    this.state = {
      playerX: 380,
      playerY: 480,
      playerDirection: 'up',
      playerMoving: false,
      playerMoney: -93000,
      playerOxygen: 95,
      playerCopiumCans: 2,
      maxCopiumCapacity: 10,

      // Oxygen spawns every 1 minute (60s timer)
      oxygenSpawnTimer: 60,
      copiumItems: [
        { id: 'initial-1', x: 260, y: 220, active: true },
        { id: 'initial-2', x: 500, y: 240, active: true },
        { id: 'initial-3', x: 280, y: 480, active: true },
      ],

      rockDepression: 65,
      rockAuraPulse: 0,
      isRockSlammingDuck: false,
      slamPhase: 0,
      slamsDelivered: 0,

      duckX: 130,
      duckY: 170,
      duckSquish: 1.0,
      duckTraumaQuotes: [],
      duckRevengeActive: false,

      elonX: 660,
      elonY: 170,
      elonSpinAngle: 0,
      elonAltitude: 0,
      isElonSpinning: false,
      elonSpeed: 0,
      cybertrucks: [],

      sunState: 'normal',
      sunProgress: 0,

      isKageBunshinActive: false,
      clones: [],

      executiveOrdersPassed: 3,
      billsIssued: 14,
      isPresidentCrumpled: false,
      crumpleTimer: 0,

      isGravityInverted: false,
      invertedGravityTimer: 0,
      floatingPunishments: [],

      screenShake: 0,
      screenFlash: null,
      crtFilterEnabled: true,
      particles: [],

      quests: {
        metTheRock: false,
        sufferedOxygenResignation: false,
        witnessedDuckSlam: false,
        elonStratosphereLaunch: false,
        sunExplodeAndUnexploded: false,
        auditedByPresidentBill: false,
        googleKageBunshinTriggered: false,
      },
      activeDialog: null,
      notifications: [
        {
          id: 'welcome',
          title: 'DEBT NOTICE',
          message: 'Your balance is -$93,000. Oxygen resigned. The Rock is weeping.',
          timeRemaining: 8,
          type: 'debt',
        },
      ],
    };

    this.initEventListeners();
    this.startLoop();
  }

  private initEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      // Quick interact key
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        this.handleInteract();
      }

      // Escape to immediately close any conversation
      if (e.key === 'Escape') {
        this.closeDialog();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  public setDirectionInput(dir: Direction | null, isMoving: boolean) {
    if (dir) {
      this.state.playerDirection = dir;
      this.state.playerMoving = isMoving;
    } else {
      this.state.playerMoving = false;
    }
  }

  public triggerInteract() {
    this.handleInteract();
  }

  public spawnNotification(
    title: string,
    message: string,
    type: 'doom' | 'debt' | 'elon' | 'sun' | 'ninja' | 'duck'
  ) {
    const notif = {
      id: Math.random().toString(),
      title,
      message,
      timeRemaining: 6,
      type,
    };
    this.state.notifications = [notif, ...this.state.notifications.slice(0, 3)];
  }

  public spawnFloatingPunishment(text: string, x: number, y: number, color: string = '#f87171') {
    this.state.floatingPunishments.push({
      id: Math.random().toString(),
      text,
      x,
      y,
      life: 80,
      color,
    });
  }

  // SPAWN OXYGEN DROP (Every 1 minute, max 10)
  public spawnOxygenCan() {
    const activeCansCount = this.state.copiumItems.filter((c) => c.active).length;
    const totalCount = activeCansCount + this.state.playerCopiumCans;

    if (totalCount >= this.state.maxCopiumCapacity) {
      this.spawnNotification(
        'MAX OXYGEN REACHED (10/10)',
        'Periodic Table capacity full! Use your cans before Oxygen delivers more.',
        'doom'
      );
      return;
    }

    // Spawn at a random open spot on map
    const newX = 80 + Math.random() * 640;
    const newY = 160 + Math.random() * 380;
    this.state.copiumItems.push({
      id: Math.random().toString(),
      x: Math.floor(newX),
      y: Math.floor(newY),
      active: true,
    });

    retroAudio.playBlip(720);
    this.spawnNotification(
      'OXYGEN DELIVERY (1 MIN)',
      `Oxygen dropped an emergency Copium canister! (Total: ${totalCount + 1}/${this.state.maxCopiumCapacity} max)`,
      'doom'
    );
  }

  // INTERACTION LOGIC
  private handleInteract() {
    // If dialogue open, advance or close
    if (this.state.activeDialog) {
      if (this.state.activeDialog.options.length > 0) {
        this.selectDialogueOption(0);
      } else {
        this.closeDialog();
      }
      return;
    }

    const px = this.state.playerX;
    const py = this.state.playerY;

    // 1. The Rock (x: 350, y: 280, radius ~ 75)
    const distRock = Math.hypot(px - 380, py - 310);
    if (distRock < 75) {
      this.openDialog(DIALOGUES.rock_intro);
      this.state.quests.metTheRock = true;
      retroAudio.playRockSigh();
      return;
    }

    // 2. The Duck (x: 130, y: 170)
    const distDuck = Math.hypot(px - 146, py - 186);
    if (distDuck < 55) {
      this.openDialog(DIALOGUES.duck_intro);
      retroAudio.playBlip(720);
      return;
    }

    // 3. Elon Musk (x: 660, y: 170)
    const distElon = Math.hypot(px - 672, py - 186);
    if (distElon < 55) {
      this.openDialog(DIALOGUES.elon_intro);
      retroAudio.playBlip(440);
      return;
    }

    // 4. Oxygen (x: 140, y: 440)
    const distOxygen = Math.hypot(px - 152, py - 450);
    if (distOxygen < 55) {
      this.openDialog(DIALOGUES.oxygen_intro);
      this.state.quests.sufferedOxygenResignation = true;
      retroAudio.playOxygenGasp();
      return;
    }

    // 5. President Electric Bill (x: 640, y: 440)
    const distBill = Math.hypot(px - 656, py - 450);
    if (distBill < 55) {
      this.openDialog(DIALOGUES.bill_intro);
      this.state.quests.auditedByPresidentBill = true;
      retroAudio.playDebtDeducted();
      return;
    }

    // 6. Google Drone (x: 380, y: 120)
    const distGoogle = Math.hypot(px - 396, py - 130);
    if (distGoogle < 55) {
      this.openDialog(DIALOGUES.google_intro);
      retroAudio.playBlip(550);
      return;
    }
  }

  public openDialog(node: DialogueNode) {
    this.state.activeDialog = node;
    retroAudio.playBlip(580);
    this.syncState();
  }

  public closeDialog() {
    this.state.activeDialog = null;
    this.syncState();
  }

  public selectDialogueOption(optionIndex: number) {
    if (!this.state.activeDialog) return;
    const option = this.state.activeDialog.options[optionIndex];
    if (!option) return;

    if (option.debtImpact) {
      this.state.playerMoney += option.debtImpact;
      retroAudio.playDebtDeducted();
      this.spawnNotification(
        'FINANCIAL PENALTY',
        `President Bill assessed ${option.debtImpact < 0 ? '-' : '+'}$${Math.abs(option.debtImpact)}! Total: $${this.state.playerMoney.toLocaleString()}`,
        'debt'
      );
      this.spawnFloatingPunishment(
        `${option.debtImpact < 0 ? '-' : '+'}$${Math.abs(option.debtImpact)} PENALTY`,
        this.state.playerX,
        this.state.playerY - 20,
        '#ef4444'
      );
    }

    if (option.depressionImpact) {
      this.state.rockDepression = Math.min(100, this.state.rockDepression + option.depressionImpact);
    }

    if (option.action) {
      option.action();
    }

    // CRUMPLE THE PRESIDENT HANDLER
    if (option.text.includes('CRUMPLE THE PRESIDENT') || option.text.includes('recycling bin')) {
      this.crumplePresident();
    }

    // EXIT TALK HANDLERS
    if (
      option.text.includes('(End talk)') ||
      option.text.includes('(Exit talk)') ||
      option.text.includes('(Exit)') ||
      option.text.includes('Exit meeting immediately') ||
      option.text.includes('Sprints out Oval Office')
    ) {
      this.closeDialog();
      return;
    }

    // Handle special trigger events based on dialogue choice text
    if (option.text.includes('SLAM TRIGGERED') || option.text.includes('Execute another Overdepression Slam') || option.text.includes('FLATTENING')) {
      this.triggerDuckSlam();
    } else if (option.text.includes('TRIGGER SUN SUPERNOVA') || option.text.includes('PARADOXICAL UNEXPLOSION')) {
      this.triggerSunSupernovaAndUnexplode();
    } else if (option.text.includes('KAGE BUNSHIN NO JUTSU') || option.text.includes('50 CLONES')) {
      this.triggerKageBunshin();
    } else if (option.text.includes('ROTOR') || option.text.includes('ascends into high orbit') || option.text.includes('Initiate spinning')) {
      this.triggerElonLaunch();
    } else if (option.text.includes('Chug Copium')) {
      this.state.playerOxygen = 100;
      this.spawnNotification('COPIUM INHALED', 'Lungs saturated with temporary pure delusion! Oxygen restored to 100%.', 'doom');
    }

    if (option.nextDialogId && DIALOGUES[option.nextDialogId]) {
      this.openDialog(DIALOGUES[option.nextDialogId]);
    } else {
      this.closeDialog();
    }
  }

  // CHAOS EVENT 1: Overdepression Duck Slam
  public triggerDuckSlam() {
    if (this.state.isRockSlammingDuck) return;
    this.state.isRockSlammingDuck = true;
    this.state.slamPhase = 0;
    this.state.rockDepression = 100;
    this.state.quests.witnessedDuckSlam = true;

    retroAudio.playRockSigh();
    this.spawnNotification(
      'CRITICAL OVERDEPRESSION',
      'The Rock has exceeded structural sadness limits! Seeking innocent duck to slam repeatedly!',
      'duck'
    );
  }

  // CHAOS EVENT 2: Elon Musk Rotor Spin & Cybertruck Spawner
  public triggerElonLaunch() {
    if (this.state.isElonSpinning) return;
    this.state.isElonSpinning = true;
    this.state.elonSpeed = 0.05;
    this.state.quests.elonStratosphereLaunch = true;

    // Spawn bouncing Cybertrucks!
    this.spawnCybertruckTornado();

    retroAudio.playElonRotor();
    this.spawnNotification(
      'ELON ESCAPE VELOCITY',
      'Elon Musk initiated 3,500 RPM rotor mode and is ascending to Mars for no reason dude!',
      'elon'
    );
  }

  public spawnCybertruckTornado() {
    retroAudio.playCybertruckHonk();
    const newTrucks: CybertruckEntity[] = [];
    for (let i = 0; i < 6; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 4;
      newTrucks.push({
        x: this.state.elonX,
        y: this.state.elonY,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        rot: Math.random() * Math.PI * 2,
      });
    }
    this.state.cybertrucks = [...this.state.cybertrucks, ...newTrucks].slice(0, 14);
    this.spawnNotification('CYBERTRUCK DEBRIS', 'Cybertrucks deployed into orbit for zero reason dude!', 'elon');
  }

  // CHAOS EVENT 3: Sun Supernova & Unexplosion
  public triggerSunSupernovaAndUnexplode() {
    if (this.state.sunState !== 'normal' && this.state.sunState !== 'repaired') return;
    this.state.sunState = 'supernova';
    this.state.sunProgress = 0;
    this.state.screenFlash = 'rgba(239, 68, 68, 0.4)';
    this.state.screenShake = 25;
    retroAudio.playSunExplode();

    this.spawnNotification(
      'SUPERNOVA DISASTER',
      'The Sun could not withstand the existential cringe and has gone supernova!',
      'sun'
    );
  }

  // CHAOS EVENT 4: Google Buyout & Kage Bunshin No Jutsu
  public triggerKageBunshin() {
    this.state.isKageBunshinActive = true;
    this.state.quests.googleKageBunshinTriggered = true;
    retroAudio.playKageBunshin();

    const quotes = [
      'NO ADS ON MY TEARS!',
      'REJECT CLOUD SYNERGY!',
      'I AM NOT AN ENTERPRISE PLAN!',
      'DEPRECATE REALITY!',
      'MY SORROW IS OPEN SOURCE!',
      '4.2 BILLION YEARS OF REGRET!',
      'KAGE BUNSHIN!',
    ];

    const newClones: RockClone[] = [];
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.5 + Math.random() * 3.5;
      newClones.push({
        x: 380,
        y: 310,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        phrase: quotes[Math.floor(Math.random() * quotes.length)],
        color: ['#4b5563', '#374151', '#1f2937', '#6b7280'][Math.floor(Math.random() * 4)],
        scale: 0.35 + Math.random() * 0.4,
      });

      this.spawnParticle(380, 310, '#e2e8f0', 8, 30);
    }
    this.state.clones = newClones;

    this.spawnNotification(
      'NINPO: KAGE BUNSHIN',
      'The Rock rejected Google and summoned 45 existential ninja clones!',
      'ninja'
    );
  }

  // CHAOS EVENT 5: Invert Gravity
  public triggerInvertGravity() {
    this.state.isGravityInverted = !this.state.isGravityInverted;
    this.state.screenShake = 15;
    retroAudio.playDuckMegaQuack();

    this.spawnNotification(
      this.state.isGravityInverted ? 'GRAVITY RENOUNCED' : 'GRAVITY RESTORED',
      this.state.isGravityInverted
        ? 'The Rock was so sad that gravity filed for divorce! Reality is inverted!'
        : 'Gravity reluctantly returned to work after an awkward silence.',
      'doom'
    );
  }

  // CHAOS EVENT 6: Crumple the President
  public crumplePresident() {
    this.state.isPresidentCrumpled = true;
    this.state.crumpleTimer = 18;
    this.state.screenShake = 10;
    retroAudio.playPresidentCrumple();

    this.spawnNotification(
      'PRESIDENT CRUMPLED',
      'You crumpled President Electric Bill into an origami ball! Late fee of -$500 assessed!',
      'debt'
    );
    this.spawnFloatingPunishment('CRUMPLE CRIME: -$500', 656, 420, '#ef4444');
  }

  // CHAOS EVENT 7: Duck Revenge Quack!
  public triggerDuckRevenge() {
    this.state.duckRevengeActive = true;
    this.state.screenShake = 22;
    retroAudio.playDuckMegaQuack();

    // Spawn massive shockwave
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      this.spawnParticle(
        this.state.duckX + 16 + Math.cos(ang) * 40,
        this.state.duckY + 16 + Math.sin(ang) * 40,
        '#facc15',
        6,
        30,
        'QUACK!'
      );
    }

    this.spawnNotification(
      'MEGA REVENGE QUACK',
      'The Duck snapped! A seismic supersonic quack rattled the universe!',
      'duck'
    );
  }

  // CHAOS EVENT 8: "Pay $1 towards debt" scam
  public payDebtScam() {
    this.state.playerMoney -= 4999;
    retroAudio.playDebtDeducted();
    this.state.screenShake = 8;

    this.spawnNotification(
      'PROCESSING SURCHARGE',
      'You paid $1, but President Bill charged a $5,000 processing fee! New Balance: $' +
        this.state.playerMoney.toLocaleString(),
      'debt'
    );
    this.spawnFloatingPunishment('-$4,999 SCAMMED', this.state.playerX, this.state.playerY - 25, '#ef4444');
  }

  // Use Canned Copium
  public useCopium() {
    if (this.state.playerCopiumCans > 0) {
      this.state.playerCopiumCans--;
      this.state.playerOxygen = 100;
      retroAudio.playBlip(600);
      this.spawnNotification('COPIUM INHALED', 'Oxygen saturated! 100% capacity restored.', 'doom');
    }
  }

  // Particle spawner
  private spawnParticle(x: number, y: number, color: string, size: number = 4, life: number = 25, symbol?: string) {
    this.state.particles.push({
      x,
      y,
      vx: (Math.random() * 2 - 1) * 2,
      vy: (Math.random() * 2 - 1) * 2,
      color,
      size,
      life,
      maxLife: life,
      symbol,
    });
  }

  // GAME UPDATE LOOP
  private update() {
    this.tick++;

    // 1. Oxygen 1-minute spawn timer countdown
    if (this.tick % 60 === 0) {
      this.state.oxygenSpawnTimer--;
      if (this.state.oxygenSpawnTimer <= 0) {
        this.spawnOxygenCan();
        this.state.oxygenSpawnTimer = 60; // Reset 1-minute cycle
      }
    }

    // 2. Oxygen consumption (Resigned Oxygen mechanism)
    if (this.tick % 45 === 0) {
      if (this.state.playerOxygen > 0) {
        this.state.playerOxygen = Math.max(0, this.state.playerOxygen - 1);
        if (this.state.playerOxygen === 15) {
          this.spawnNotification('SUFFOCATION WARNING', 'Oxygen is still on strike! Grab canned Copium or hold breath!', 'doom');
          retroAudio.playOxygenGasp();
        }
      } else {
        // Oxygen is 0: mental debt penalty
        if (this.tick % 120 === 0) {
          this.state.playerMoney -= 50;
          this.state.screenShake = 3;
          retroAudio.playDebtDeducted();
          this.spawnFloatingPunishment('O2 DEFAULT TAX: -$50', this.state.playerX, this.state.playerY - 20, '#ef4444');
        }
      }
    }

    // 3. Random Absurd Physical & Mental Punishments
    if (this.tick % 500 === 0) {
      const insults = [
        'PHYSICAL PUNISHMENT: You stubbed your existential toe',
        'MENTAL PUNISHMENT: Remembered an awkward handshake from 2016',
        'ADMIN FEE: Breathed unregistered nitrogen (-$25)',
        'OXYGEN UPDATE: Oxygen seen ordering matcha latte at cafe',
        'DUCK ADVISORY: Duck is plotting unionization',
      ];
      const selected = insults[Math.floor(Math.random() * insults.length)];
      this.spawnNotification('HUMANITY SUFFERING', selected, 'doom');
      this.spawnFloatingPunishment(selected.slice(0, 24), this.state.playerX, this.state.playerY - 25, '#c084fc');
    }

    // 4. Player movement
    if (!this.state.activeDialog) {
      let dx = 0;
      let dy = 0;

      if (this.keys['arrowup'] || this.keys['w']) dy -= 1;
      if (this.keys['arrowdown'] || this.keys['s']) dy += 1;
      if (this.keys['arrowleft'] || this.keys['a']) dx -= 1;
      if (this.keys['arrowright'] || this.keys['d']) dx += 1;

      // Invert controls if gravity is inverted for extra absurd chaos!
      if (this.state.isGravityInverted) {
        dy *= -1;
      }

      if (dx !== 0 || dy !== 0) {
        this.state.playerMoving = true;
        const len = Math.hypot(dx, dy);
        const speed = 2.8;
        this.state.playerX = Math.max(20, Math.min(this.width - 40, this.state.playerX + (dx / len) * speed));
        this.state.playerY = Math.max(40, Math.min(this.height - 40, this.state.playerY + (dy / len) * speed));

        if (Math.abs(dx) > Math.abs(dy)) {
          this.state.playerDirection = dx < 0 ? 'left' : 'right';
        } else {
          this.state.playerDirection = dy < 0 ? 'up' : 'down';
        }

        if (this.tick % 8 === 0) {
          this.spawnParticle(this.state.playerX + 12, this.state.playerY + 28, 'rgba(100, 116, 139, 0.4)', 2, 12);
        }
      } else {
        this.state.playerMoving = false;
      }
    }

    // Check Copium pickups (capped at max 10)
    this.state.copiumItems.forEach((can) => {
      if (can.active) {
        const d = Math.hypot(this.state.playerX - can.x, this.state.playerY - can.y);
        if (d < 24) {
          if (this.state.playerCopiumCans < this.state.maxCopiumCapacity) {
            can.active = false;
            this.state.playerCopiumCans++;
            this.state.playerOxygen = 100;
            retroAudio.playBlip(780);
            this.spawnNotification(
              'COPIUM SECURED',
              `Found Canned Copium! Inventory: ${this.state.playerCopiumCans}/${this.state.maxCopiumCapacity}`,
              'doom'
            );
          } else {
            if (this.tick % 120 === 0) {
              this.spawnNotification('INVENTORY FULL', 'You cannot hold more than 10 Copium cans!', 'doom');
            }
          }
        }
      }
    });

    // 5. Update Rock Slamming Duck sequence
    if (this.state.isRockSlammingDuck) {
      this.state.slamPhase += 0.04;
      const phase = this.state.slamPhase;

      if (phase < 1.0) {
        this.state.screenShake = 4;
      } else if (phase < 3.5) {
        const slamCycle = Math.sin(phase * 12);
        if (slamCycle > 0.85 && this.tick % 6 === 0) {
          this.state.duckSquish = 0.2;
          this.state.screenShake = 14;
          this.state.slamsDelivered++;
          retroAudio.playDuckSlam();

          const sWords = ['SLAM!', 'QUACK!', 'WHY ME?!', 'FLAT!', 'BRUH!'];
          this.spawnParticle(
            this.state.duckX + 10,
            this.state.duckY,
            '#ef4444',
            6,
            20,
            sWords[Math.floor(Math.random() * sWords.length)]
          );
        } else {
          this.state.duckSquish = Math.min(1.0, this.state.duckSquish + 0.05);
        }
      } else {
        this.state.isRockSlammingDuck = false;
        this.state.slamPhase = 0;
        this.state.duckSquish = 0.4;
        this.state.rockDepression = 80;
        retroAudio.playRockSigh();
      }
    } else {
      this.state.duckSquish = Math.min(1.0, this.state.duckSquish + 0.02);
    }

    // 6. Update Elon spinning & Cybertrucks
    if (this.state.isElonSpinning) {
      this.state.elonSpinAngle += this.state.elonSpeed * 18;
      this.state.elonSpeed = Math.min(1.2, this.state.elonSpeed + 0.015);

      if (this.state.elonSpeed > 0.4) {
        this.state.elonAltitude += 3.5;
        this.state.screenShake = 2;

        if (this.tick % 5 === 0) {
          retroAudio.playElonRotor();
          this.spawnParticle(this.state.elonX + 12, this.state.elonY - this.state.elonAltitude + 16, '#38bdf8', 4, 18, '🚀');
        }

        if (this.state.elonAltitude > 450) {
          this.state.elonAltitude = 0;
          this.state.isElonSpinning = false;
          this.state.elonSpeed = 0;
          this.spawnNotification('ORBIT ACHIEVED', 'Elon Musk successfully orbited Earth and returned with zero rationale.', 'elon');
        }
      }
    }

    // Update Cybertrucks
    this.state.cybertrucks.forEach((truck) => {
      truck.x += truck.vx;
      truck.y += truck.vy;
      truck.rot += 0.05;

      if (truck.x < 30 || truck.x > this.width - 30) truck.vx *= -1;
      if (truck.y < 120 || truck.y > this.height - 30) truck.vy *= -1;
    });

    // 7. Update Sun Supernova & Unexplosion
    if (this.state.sunState === 'supernova') {
      this.state.sunProgress += 0.015;
      this.state.screenShake = 8;
      if (this.tick % 8 === 0) {
        this.spawnParticle(720 + (Math.random() * 40 - 20), 60 + (Math.random() * 40 - 20), '#f97316', 5, 20);
      }

      if (this.state.sunProgress >= 1.0) {
        this.state.sunState = 'unexploding';
        this.state.sunProgress = 0;
        this.state.screenFlash = 'rgba(168, 85, 247, 0.4)';
        retroAudio.playRockSigh();
        retroAudio.playSunUnexplode();
        this.spawnNotification(
          'UNLOGICAL UNEXPLOSION',
          'The Rock was so annoyed by the explosion that its pure depression reversed cosmic entropy and unexploded the sun!',
          'sun'
        );
      }
    } else if (this.state.sunState === 'unexploding') {
      this.state.sunProgress += 0.02;
      this.state.screenShake = 3;
      if (this.state.sunProgress >= 1.0) {
        this.state.sunState = 'repaired';
        this.state.sunProgress = 0;
        this.state.quests.sunExplodeAndUnexploded = true;
      }
    }

    // 8. Update Kage Bunshin clones
    if (this.state.isKageBunshinActive) {
      this.state.clones.forEach((clone) => {
        clone.x += clone.vx;
        clone.y += clone.vy;

        if (clone.x < 30 || clone.x > this.width - 50) clone.vx *= -1;
        if (clone.y < 50 || clone.y > this.height - 50) clone.vy *= -1;

        if (this.tick % 30 === 0) {
          this.spawnParticle(clone.x, clone.y, '#9333ea', 2, 10);
        }
      });
    }

    // 9. Update Crumpled President timer
    if (this.state.isPresidentCrumpled) {
      this.state.crumpleTimer -= 1 / 60;
      if (this.state.crumpleTimer <= 0) {
        this.state.isPresidentCrumpled = false;
        this.spawnNotification('PRESIDENT IRONED', 'President Electric Bill was ironed flat and has resumed federal auditing.', 'debt');
      }
    }

    // 10. Update Particles & Floating Punishments
    for (let i = this.state.particles.length - 1; i >= 0; i--) {
      const p = this.state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.state.particles.splice(i, 1);
      }
    }

    for (let i = this.state.floatingPunishments.length - 1; i >= 0; i--) {
      const fp = this.state.floatingPunishments[i];
      fp.y -= 0.6;
      fp.life--;
      if (fp.life <= 0) {
        this.state.floatingPunishments.splice(i, 1);
      }
    }

    // 11. Decay screen shake
    if (this.state.screenShake > 0) {
      this.state.screenShake *= 0.88;
      if (this.state.screenShake < 0.2) this.state.screenShake = 0;
    }

    if (this.state.screenFlash) {
      this.state.screenFlash = null;
    }

    // Notifications decay
    this.state.notifications = this.state.notifications
      .map((n) => ({ ...n, timeRemaining: n.timeRemaining - 1 / 60 }))
      .filter((n) => n.timeRemaining > 0);

    // Sync state to UI every 4 frames
    if (this.tick % 4 === 0 && this.onStateUpdate) {
      this.onStateUpdate({ ...this.state });
    }
  }

  // RENDER THE CHAOTIC 8-BIT UNIVERSE
  public render() {
    const ctx = this.ctx;
    ctx.save();

    // Gravity Inversion effect
    if (this.state.isGravityInverted) {
      ctx.translate(0, this.height);
      ctx.scale(1, -1);
    }

    // Screen shake transform
    if (this.state.screenShake > 0) {
      const sx = (Math.random() * 2 - 1) * this.state.screenShake;
      const sy = (Math.random() * 2 - 1) * this.state.screenShake;
      ctx.translate(sx, sy);
    }

    // 1. Sky & Ground background
    const groundGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    groundGrad.addColorStop(0, '#090a0f');
    groundGrad.addColorStop(0.35, '#1e1b2e');
    groundGrad.addColorStop(0.36, '#26241e');
    groundGrad.addColorStop(1, '#18181b');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Tile grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 210);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 210; y < this.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Sky stars
    ctx.fillStyle = '#f8fafc';
    for (let i = 0; i < 20; i++) {
      const sx = (i * 47) % this.width;
      const sy = (i * 29) % 180;
      if (Math.sin(this.tick * 0.05 + i) > 0.2) {
        ctx.fillRect(sx, sy, 2, 2);
      }
    }

    // 2. The Sun in the sky
    SpriteRenderer.drawSun(
      ctx,
      710,
      75,
      this.state.sunState,
      this.state.sunProgress,
      this.tick
    );

    // 3. Environmental Landmarks
    // Duck Pond
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(145, 185, 45, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // SpaceX Silo
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(630, 160, 75, 45);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(632, 162, 71, 41);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px monospace';
    ctx.fillText('SPACEX SILO', 636, 175);
    ctx.fillText('ALT: ' + Math.floor(this.state.elonAltitude * 100) + ' KM', 636, 190);

    // Unemployment Bench (Oxygen)
    ctx.fillStyle = '#334155';
    ctx.fillRect(115, 430, 70, 50);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '6px monospace';
    ctx.fillText('UNEMPLOYMENT', 119, 442);
    ctx.fillText('BENCH (O2)', 122, 452);

    // Oval Office (President Bill)
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(610, 420, 95, 65);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(612, 422, 91, 61);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(635, 445, 45, 40);
    ctx.fillStyle = '#fef08a';
    ctx.font = '6px monospace';
    ctx.fillText('OVAL OFFICE', 625, 434);

    // Google HQ
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(340, 90, 110, 45);
    ctx.strokeStyle = '#4285f4';
    ctx.lineWidth = 2;
    ctx.strokeRect(342, 92, 106, 41);
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px monospace';
    ctx.fillText('GOOGLE VENTURES', 350, 104);
    ctx.fillText('BUYOUT TENT $420B', 346, 118);

    // Gloom Crater
    ctx.fillStyle = 'rgba(88, 28, 135, 0.3)';
    ctx.beginPath();
    ctx.ellipse(386, 346, 65, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw Canned Copium Pickups on ground
    this.state.copiumItems.forEach((can) => {
      if (can.active) {
        SpriteRenderer.drawCopiumCan(ctx, can.x, can.y, this.tick);
      }
    });

    // 4. Draw Characters & NPCs
    // The Duck
    SpriteRenderer.drawDuck(
      ctx,
      this.state.duckX,
      this.state.duckY,
      this.state.duckSquish,
      this.tick
    );

    // Elon Musk
    SpriteRenderer.drawElon(
      ctx,
      this.state.elonX,
      this.state.elonY,
      this.state.elonSpinAngle,
      this.state.elonAltitude,
      this.state.isElonSpinning,
      this.tick
    );

    // Cybertrucks
    this.state.cybertrucks.forEach((truck) => {
      SpriteRenderer.drawCybertruck(ctx, truck.x, truck.y, truck.rot);
    });

    // Oxygen
    SpriteRenderer.drawOxygen(
      ctx,
      140,
      440,
      this.tick
    );

    // President Bill (with crumpled state support)
    SpriteRenderer.drawPresidentBill(
      ctx,
      640,
      430,
      this.tick,
      this.state.isPresidentCrumpled
    );

    // Google Drone
    SpriteRenderer.drawGoogleDrone(
      ctx,
      380,
      115,
      this.tick
    );

    // The Rock (Normal or Mid-Air Slam)
    let rockRenderX = 350;
    let rockRenderY = 280;

    if (this.state.isRockSlammingDuck) {
      const phase = this.state.slamPhase;
      if (phase < 1.0) {
        rockRenderX = 350 + (this.state.duckX - 350) * phase;
        rockRenderY = 280 - Math.sin(phase * Math.PI) * 120 + (this.state.duckY - 280) * phase;
      } else if (phase < 3.5) {
        const slamHop = Math.abs(Math.sin(phase * 12)) * 40;
        rockRenderX = this.state.duckX - 18;
        rockRenderY = this.state.duckY - 50 + (40 - slamHop);
      } else {
        const returnProgress = (phase - 3.5) / 0.5;
        rockRenderX = this.state.duckX - 18 + (350 - (this.state.duckX - 18)) * returnProgress;
        rockRenderY = this.state.duckY - 20 + (280 - (this.state.duckY - 20)) * returnProgress;
      }
    }

    SpriteRenderer.drawRock(
      ctx,
      rockRenderX,
      rockRenderY,
      this.state.rockDepression,
      this.tick,
      this.state.isRockSlammingDuck
    );

    // Draw Kage Bunshin Clones
    if (this.state.isKageBunshinActive) {
      this.state.clones.forEach((clone) => {
        ctx.save();
        ctx.translate(clone.x, clone.y);
        ctx.scale(clone.scale, clone.scale);
        ctx.fillStyle = clone.color;
        ctx.fillRect(-12, -10, 24, 20);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-6, -4, 3, 3);
        ctx.fillRect(3, -4, 3, 3);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-6, 0, 2, 4);
        ctx.fillRect(4, 0, 2, 4);
        ctx.restore();

        if (Math.sin(this.tick * 0.1 + clone.x) > 0.6) {
          ctx.fillStyle = '#f43f5e';
          ctx.font = '5px monospace';
          ctx.fillText(clone.phrase, clone.x - 16, clone.y - 12);
        }
      });
    }

    // Draw Player
    SpriteRenderer.drawPlayer(
      ctx,
      this.state.playerX,
      this.state.playerY,
      this.state.playerDirection,
      this.state.playerMoving,
      this.tick
    );

    // 5. Particles
    this.state.particles.forEach((p) => {
      ctx.fillStyle = p.color;
      if (p.symbol) {
        ctx.font = '8px monospace';
        ctx.fillText(p.symbol, p.x, p.y);
      } else {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });

    // 6. Floating Punishments
    this.state.floatingPunishments.forEach((fp) => {
      ctx.fillStyle = fp.color;
      ctx.font = 'bold 8px monospace';
      ctx.fillText(fp.text, fp.x - 30, fp.y);
    });

    // 7. Overhead Interaction Prompts
    const px = this.state.playerX;
    const py = this.state.playerY;

    const drawPrompt = (x: number, y: number, text: string) => {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x - 28, y - 18, 56, 14);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 7px monospace';
      ctx.fillText(text, x - 25, y - 8);
    };

    if (Math.hypot(px - 380, py - 310) < 75) drawPrompt(380, 280, '[E] THE ROCK');
    if (Math.hypot(px - 146, py - 186) < 55) drawPrompt(146, 160, '[E] THE DUCK');
    if (Math.hypot(px - 672, py - 186) < 55) drawPrompt(672, 160, '[E] ELON MUSK');
    if (Math.hypot(px - 152, py - 450) < 55) drawPrompt(152, 430, '[E] OXYGEN (O2)');
    if (Math.hypot(px - 656, py - 450) < 55) drawPrompt(656, 420, '[E] PRES. BILL');
    if (Math.hypot(px - 396, py - 130) < 55) drawPrompt(396, 110, '[E] GOOGLE CORP');

    // 8. Full Screen Flash
    if (this.state.screenFlash) {
      ctx.fillStyle = this.state.screenFlash;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    ctx.restore();
  }

  private startLoop() {
    const loop = () => {
      this.update();
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  private syncState() {
    if (this.onStateUpdate) {
      this.onStateUpdate({ ...this.state });
    }
  }
}
