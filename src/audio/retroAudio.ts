/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Multi-Channel 8-Bit Chiptune Sound Tracker & Synthesizer
// Features 4 concurrent NES sound channels:
// 1. Pulse 1 (Lead Melody with vibrato & envelope)
// 2. Pulse 2 (High-speed 16th note arpeggiator chord harmony)
// 3. Triangle (Punchy staccato bassline)
// 4. Noise (Procedural Kick, Snare, Hi-Hat drum channel)

export type TrackId = 'despair_140' | 'boss_overdepression' | 'elon_rave' | 'oxygen_jazz';

export interface TrackMetadata {
  id: TrackId;
  title: string;
  bpm: number;
  genre: string;
  emoji: string;
}

export const TRACK_LIST: TrackMetadata[] = [
  {
    id: 'despair_140',
    title: 'DESPAIR IN 140 BPM',
    bpm: 140,
    genre: 'Heroic Tragic Chiptune',
    emoji: '🔥',
  },
  {
    id: 'boss_overdepression',
    title: 'OVERDEPRESSION BOSSFIGHT',
    bpm: 152,
    genre: 'NES Speed Metal',
    emoji: '⚔️',
  },
  {
    id: 'elon_rave',
    title: 'ELON STRATOSPHERE RAVE',
    bpm: 160,
    genre: 'Orbital Eurobeat',
    emoji: '🚀',
  },
  {
    id: 'oxygen_jazz',
    title: "OXYGEN'S RESIGNATION JAZZ",
    bpm: 115,
    genre: '8-Bit City Pop',
    emoji: '🎷',
  },
];

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.35;
  private masterGain: GainNode | null = null;

  // Tracker state
  private activeTrackId: TrackId = 'despair_140';
  private stepInterval: number | null = null;
  private stepIndex: number = 0;

  // Live visualizer levels for 4 channels [lead, arp, bass, drums]
  public channelLevels: [number, number, number, number] = [0, 0, 0, 0];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startBGM(this.activeTrackId);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getActiveTrack(): TrackId {
    return this.activeTrackId;
  }

  // --- SOUND EFFECTS (SFX) ---
  public playBlip(freq: number = 440) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  public playRockSigh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch {}
  }

  public playDuckSlam() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // 1. Crunch/Thud (Noise buffer)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(900, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(70, now + 0.22);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      whiteNoise.start(now);

      // 2. Comical Duck Quack
      const quackOsc = this.ctx.createOscillator();
      const quackGain = this.ctx.createGain();
      quackOsc.type = 'triangle';
      quackOsc.frequency.setValueAtTime(950, now);
      quackOsc.frequency.linearRampToValueAtTime(580, now + 0.1);
      quackOsc.frequency.linearRampToValueAtTime(820, now + 0.26);

      quackGain.gain.setValueAtTime(0.3, now);
      quackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      quackOsc.connect(quackGain);
      quackGain.connect(this.masterGain);
      quackOsc.start(now);
      quackOsc.stop(now + 0.3);
    } catch {}
  }

  public playDuckMegaQuack() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(520, now + 0.15);
      osc.frequency.linearRampToValueAtTime(160, now + 0.45);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  public playElonRotor() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(70, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.85);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.85);
    } catch {}
  }

  public playSunExplode() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.6);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.45));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(45, now + 1.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    } catch {}
  }

  public playSunUnexplode() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 1.3);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.95);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.35);
    } catch {}
  }

  public playKageBunshin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [330, 440, 554, 660, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.12, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.25);
      });
    } catch {}
  }

  public playDebtDeducted() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(105, now + 0.1);
      osc.frequency.setValueAtTime(75, now + 0.2);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.38);
    } catch {}
  }

  public playPresidentCrumple() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1300 + Math.random() * 900, now + i * 0.035);
        gain.gain.setValueAtTime(0.1, now + i * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.035 + 0.035);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.035);
        osc.stop(now + i * 0.035 + 0.04);
      }
    } catch {}
  }

  public playCybertruckHonk() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      [392, 440].forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {}
  }

  public playOxygenGasp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.35);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // --- MULTI-CHANNEL CHIPTUNE MUSIC COMPOSITIONS ---

  // Play a single 8-bit note on Pulse channel with envelope
  private playLeadNote(freq: number, durationSec: number) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle 8-bit vibrato
    const vib = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();
    vib.frequency.setValueAtTime(6.5, now);
    vibGain.gain.setValueAtTime(freq * 0.015, now);
    vib.connect(osc.frequency);
    vib.start(now);
    vib.stop(now + durationSec);

    // Punchy attack & sustain envelope
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.95);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationSec);
    this.channelLevels[0] = 1.0;
  }

  // Play fast C64-style 16th note arpeggiator chord burst on Pulse 2
  private playArpBurst(notes: number[], durationSec: number) {
    if (!this.ctx || !this.masterGain || notes.length === 0) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    const subStep = durationSec / notes.length;
    notes.forEach((freq, i) => {
      osc.frequency.setValueAtTime(freq, now + i * subStep);
    });

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationSec);
    this.channelLevels[1] = 0.8;
  }

  // Play punchy Triangle bass note
  private playBassNote(freq: number, durationSec: number) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationSec);
    this.channelLevels[2] = 0.9;
  }

  // Play 8-bit Noise Drums (Kick, Snare, Hi-Hat)
  private playDrumHit(type: 'kick' | 'snare' | 'hihat' | 'snare_heavy') {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (type === 'kick') {
      // 8-bit punchy pitch sweep kick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'snare' || type === 'snare_heavy') {
      // Noise burst snare
      const bufLen = Math.floor(this.ctx.sampleRate * 0.12);
      const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(type === 'snare_heavy' ? 0.35 : 0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    } else if (type === 'hihat') {
      // Ultra-short crisp metallic tick
      const bufLen = Math.floor(this.ctx.sampleRate * 0.035);
      const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    }
    this.channelLevels[3] = 1.0;
  }

  // --- TRACK DEFINITIONS ---
  public startBGM(track: TrackId = 'despair_140') {
    this.activeTrackId = track;
    if (this.isMuted) return;
    this.stopBGM();
    this.initCtx();

    // Frequencies in Hz
    // C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, Bb3: 233.08, B3: 246.94
    // C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88
    // C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00

    const D3 = 146.83, Eb3 = 155.56, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, Bb3 = 233.08, C4 = 261.63;
    const D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, Ab4 = 415.30, A4 = 440.00, Bb4 = 466.16, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, Eb5 = 622.25, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, Bb5 = 932.33;

    // Track 1: DESPAIR IN 140 BPM (Heroic Tragic Megaman/Touhou Banger)
    // 32-step loop (16th notes = 4 bars)
    const despairLeadNotes = [
      D4, 0, D4, F4, G4, A4, 0, D5, C5, A4, F4, G4, A4, 0, F4, E4,
      D4, 0, F4, G4, A4, C5, D5, F5, E5, D5, C5, A4, Bb4, A4, G4, E4,
    ];
    const despairArpChords = [
      [D4, F4, A4, D5], [D4, F4, A4, D5], [F4, A4, C5, F5], [F4, A4, C5, F5],
      [G4, Bb4, D5, G5], [G4, Bb4, D5, G5], [A4, C5, E5, A5], [A4, C5, E5, A5],
      [Bb4, D5, F5, Bb5], [Bb4, D5, F5, Bb5], [C5, E5, G5, C5], [C5, E5, G5, C5],
      [D4, F4, A4, D5], [D4, F4, A4, D5], [A4, C5, E5, A5], [A4, C5, E5, A5],
    ];
    const despairBassNotes = [
      D3, D3, D4, D3, F3, F3, F4, F3, G3, G3, G4, G3, A3, A3, A4, A3,
      Bb3, Bb3, Bb4, Bb3, C4, C4, C4, C4, D3, D3, D4, D3, A3, A3, A4, A3,
    ];

    // Track 2: OVERDEPRESSION BOSSFIGHT (152 BPM Metal Rush)
    const bossLeadNotes = [
      D4, D4, F4, D4, G4, D4, Ab4, G4, F4, D4, C4, D4, F4, G4, A4, C5,
      D5, D5, F5, D5, Eb5, D5, C5, A4, Bb4, A4, G4, F4, E4, F4, G4, A4,
    ];
    const bossBassNotes = [
      D3, D3, D3, D3, D3, D3, D3, D3, Eb3, Eb3, Eb3, Eb3, D3, D3, D3, D3,
      D3, D3, D3, D3, G3, G3, G3, G3, Bb3, Bb3, Bb3, Bb3, A3, A3, A3, A3,
    ];

    // Track 3: ELON'S STRATOSPHERE RAVE (160 BPM Eurobeat)
    const elonLeadNotes = [
      A4, 0, C5, 0, E5, 0, D5, 0, C5, 0, B4, 0, A4, 0, G4, 0,
      A4, 0, C5, 0, D5, 0, E5, 0, G5, 0, F5, 0, E5, 0, D5, 0,
    ];
    const elonBassNotes = [
      A3, A3, A4, A3, F3, F3, F4, F3, C4, C4, C4, C4, G3, G3, G4, G3,
      A3, A3, A4, A3, F3, F3, F4, F3, D3, D3, D4, D3, E3, E3, E4, E3,
    ];

    // Track 4: OXYGEN'S CITY POP JAZZ (115 BPM)
    const jazzLeadNotes = [
      C5, 0, B4, A4, 0, G4, 0, E4, F4, 0, G4, A4, 0, G4, 0, 0,
      D5, 0, C5, B4, 0, A4, 0, F4, G4, 0, A4, C5, 0, D5, 0, 0,
    ];
    const jazzBassNotes = [
      F3, 0, F3, F4, 0, E3, 0, A3, D3, 0, D3, D4, 0, G3, 0, C4,
      F3, 0, F3, F4, 0, E3, 0, A3, D3, 0, D3, G3, 0, C4, 0, 0,
    ];

    // Select BPM & notes based on track
    let bpm = 140;
    if (track === 'boss_overdepression') bpm = 152;
    if (track === 'elon_rave') bpm = 160;
    if (track === 'oxygen_jazz') bpm = 115;

    // 16th note step duration in ms
    const stepDurationMs = (60000 / bpm) / 4;
    const stepDurationSec = stepDurationMs / 1000;

    this.stepIndex = 0;

    this.stepInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;

      const step = this.stepIndex % 32;
      const beat16 = step % 4;
      const beat4 = Math.floor(step / 4) % 4;

      try {
        if (track === 'despair_140') {
          // Channel 1: Lead Melody
          const leadFreq = despairLeadNotes[step];
          if (leadFreq > 0) this.playLeadNote(leadFreq, stepDurationSec * 1.8);

          // Channel 2: 16th note arpeggios
          const arpChord = despairArpChords[Math.floor(step / 2) % despairArpChords.length];
          this.playArpBurst(arpChord, stepDurationSec * 0.95);

          // Channel 3: Triangle Bass
          const bassFreq = despairBassNotes[step];
          if (bassFreq > 0) this.playBassNote(bassFreq, stepDurationSec * 0.9);

          // Channel 4: Drums (Kick on 0 & 8, Snare on 4 & 12, Hi-Hat on every 16th!)
          if (step % 8 === 0) {
            this.playDrumHit('kick');
          } else if (step % 8 === 4) {
            this.playDrumHit('snare_heavy');
          } else if (step % 2 === 0) {
            this.playDrumHit('hihat');
          }
        } else if (track === 'boss_overdepression') {
          // Heavy Speed Metal Boss
          const leadFreq = (bossLeadNotes as Record<number, number>)[step] || D4;
          if (leadFreq > 0) this.playLeadNote(leadFreq, stepDurationSec * 1.2);

          const bassFreq = (bossBassNotes as Record<number, number>)[step] || D3;
          if (bassFreq > 0) this.playBassNote(bassFreq, stepDurationSec * 0.9);

          // Double kick pattern!
          if (step % 4 === 0 || step % 4 === 2) {
            this.playDrumHit('kick');
          } else if (step % 4 === 1) {
            this.playDrumHit('snare_heavy');
          } else {
            this.playDrumHit('hihat');
          }
        } else if (track === 'elon_rave') {
          // Eurobeat Rave
          const leadFreq = (elonLeadNotes as Record<number, number>)[step] || 0;
          if (leadFreq > 0) this.playLeadNote(leadFreq, stepDurationSec * 1.5);

          const bassFreq = (elonBassNotes as Record<number, number>)[step] || A3;
          this.playBassNote(bassFreq, stepDurationSec * 0.85);

          // Four on the floor kick
          if (step % 4 === 0) {
            this.playDrumHit('kick');
          } else if (step % 8 === 4) {
            this.playDrumHit('snare');
          } else {
            this.playDrumHit('hihat');
          }
        } else {
          // Oxygen Jazz City Pop
          const leadFreq = (jazzLeadNotes as Record<number, number>)[step] || 0;
          if (leadFreq > 0) this.playLeadNote(leadFreq, stepDurationSec * 2.2);

          const bassFreq = (jazzBassNotes as Record<number, number>)[step] || 0;
          if (bassFreq > 0) this.playBassNote(bassFreq, stepDurationSec * 1.2);

          if (step % 8 === 0) {
            this.playDrumHit('kick');
          } else if (step % 8 === 4) {
            this.playDrumHit('snare');
          } else if (step % 2 === 1) {
            this.playDrumHit('hihat');
          }
        }

        // Decay visualizer levels
        this.channelLevels = this.channelLevels.map((lvl) => Math.max(0, lvl * 0.78)) as [
          number,
          number,
          number,
          number
        ];
      } catch {}

      this.stepIndex++;
    }, stepDurationMs);
  }

  public nextTrack(): TrackMetadata {
    const currentIndex = TRACK_LIST.findIndex((t) => t.id === this.activeTrackId);
    const nextIndex = (currentIndex + 1) % TRACK_LIST.length;
    const nextTrack = TRACK_LIST[nextIndex];
    this.startBGM(nextTrack.id);
    return nextTrack;
  }

  public setTrack(trackId: TrackId): TrackMetadata {
    const found = TRACK_LIST.find((t) => t.id === trackId) || TRACK_LIST[0];
    this.startBGM(found.id);
    return found;
  }

  public stopBGM() {
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    }
  }
}

export const retroAudio = new RetroAudioEngine();
