/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 8-bit pixel art renderer functions for canvas
export class SpriteRenderer {
  // Helper to draw pixel grid rect
  private static pixelRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  // Draw Player Character (8-bit adventurer)
  public static drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    facing: 'up' | 'down' | 'left' | 'right',
    isMoving: boolean,
    tick: number
  ) {
    const walkOffset = isMoving ? Math.sin(tick * 0.25) * 2 : 0;
    const px = Math.floor(x);
    const py = Math.floor(y + walkOffset);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(px + 12, py + 26, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body & Pants (Indigo/Grey)
    this.pixelRect(ctx, px + 7, py + 14, 10, 10, '#334155');
    // Legs
    const legL = isMoving ? Math.sin(tick * 0.3) * 3 : 0;
    const legR = isMoving ? -Math.sin(tick * 0.3) * 3 : 0;
    this.pixelRect(ctx, px + 8, py + 22 + legL, 3, 5, '#1e293b');
    this.pixelRect(ctx, px + 13, py + 22 + legR, 3, 5, '#1e293b');
    // Shoes (Red sneakers)
    this.pixelRect(ctx, px + 7, py + 26 + legL, 4, 2, '#ef4444');
    this.pixelRect(ctx, px + 13, py + 26 + legR, 4, 2, '#ef4444');

    // Shirt / Hoodie (Cyan retro jacket)
    this.pixelRect(ctx, px + 6, py + 12, 12, 8, '#06b6d4');
    this.pixelRect(ctx, px + 9, py + 12, 6, 8, '#0891b2');

    // Empty Pockets turned inside out (absurd detail for -$93,000!)
    this.pixelRect(ctx, px + 4, py + 16, 2, 3, '#e2e8f0');
    this.pixelRect(ctx, px + 18, py + 16, 2, 3, '#e2e8f0');

    // Head
    this.pixelRect(ctx, px + 7, py + 4, 10, 8, '#fcd34d'); // Face skin
    // Hair (Brown retro cap/hair)
    this.pixelRect(ctx, px + 6, py + 2, 12, 4, '#78350f');
    this.pixelRect(ctx, px + 5, py + 3, 3, 4, '#78350f');

    // Face features depending on direction
    if (facing === 'down') {
      // Worried sweat drop
      this.pixelRect(ctx, px + 16, py + 5, 2, 3, '#60a5fa');
      // Depressed tired eyes
      this.pixelRect(ctx, px + 9, py + 7, 2, 2, '#0f172a');
      this.pixelRect(ctx, px + 13, py + 7, 2, 2, '#0f172a');
      // Purple bags under eyes
      this.pixelRect(ctx, px + 9, py + 9, 2, 1, '#a855f7');
      this.pixelRect(ctx, px + 13, py + 9, 2, 1, '#a855f7');
      // Frown
      this.pixelRect(ctx, px + 10, py + 11, 4, 1, '#78350f');
    } else if (facing === 'up') {
      // Back of head
      this.pixelRect(ctx, px + 6, py + 3, 12, 7, '#78350f');
    } else if (facing === 'left') {
      this.pixelRect(ctx, px + 7, py + 7, 2, 2, '#0f172a');
      this.pixelRect(ctx, px + 6, py + 9, 2, 1, '#a855f7');
      this.pixelRect(ctx, px + 7, py + 11, 3, 1, '#78350f');
    } else {
      // Right
      this.pixelRect(ctx, px + 15, py + 7, 2, 2, '#0f172a');
      this.pixelRect(ctx, px + 16, py + 9, 2, 1, '#a855f7');
      this.pixelRect(ctx, px + 14, py + 11, 3, 1, '#78350f');
    }
  }

  // Draw The Depressed Rock (monumental, weeping, reality-bending)
  public static drawRock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    depression: number,
    tick: number,
    isSlamming: boolean
  ) {
    const rx = Math.floor(x);
    const ry = Math.floor(y);

    // Existential gloom aura
    const pulse = Math.sin(tick * 0.1) * 8 + (depression * 0.3);
    const gradient = ctx.createRadialGradient(
      rx + 36, ry + 36, 10,
      rx + 36, ry + 36, 45 + pulse
    );
    gradient.addColorStop(0, 'rgba(147, 51, 234, 0.4)');
    gradient.addColorStop(0.5, 'rgba(59, 7, 100, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(rx - 20, ry - 20, 112, 112);

    // Ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(rx + 36, ry + 66, 38, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rock Main Body (8-bit boulder shape)
    const baseColor = depression > 80 ? '#374151' : '#4b5563';
    const darkEdge = '#1f2937';
    const lightHighlight = '#6b7280';

    // Boulder Outline & Mass
    this.pixelRect(ctx, rx + 12, ry + 8, 48, 56, baseColor);
    this.pixelRect(ctx, rx + 6, ry + 16, 60, 44, baseColor);
    this.pixelRect(ctx, rx + 2, ry + 24, 68, 32, baseColor);

    // Chiseled highlights & shadows
    this.pixelRect(ctx, rx + 14, ry + 10, 20, 6, lightHighlight);
    this.pixelRect(ctx, rx + 8, ry + 20, 8, 20, lightHighlight);
    this.pixelRect(ctx, rx + 52, ry + 28, 16, 26, darkEdge);
    this.pixelRect(ctx, rx + 16, ry + 56, 46, 8, darkEdge);

    // Cracks of cosmic despair
    this.pixelRect(ctx, rx + 24, ry + 14, 2, 10, '#111827');
    this.pixelRect(ctx, rx + 26, ry + 24, 6, 2, '#111827');
    this.pixelRect(ctx, rx + 32, ry + 26, 2, 8, '#111827');
    this.pixelRect(ctx, rx + 44, ry + 42, 2, 12, '#111827');

    // Deeply Depressed Eyes (Droopy, soulless)
    const eyeY = ry + 30;
    // Eye sockets
    this.pixelRect(ctx, rx + 20, eyeY, 10, 8, '#111827');
    this.pixelRect(ctx, rx + 42, eyeY, 10, 8, '#111827');

    // Tiny dead white pupils staring into the void
    const pupilShift = Math.sin(tick * 0.05) * 1;
    this.pixelRect(ctx, rx + 24 + pupilShift, eyeY + 3, 3, 3, '#f8fafc');
    this.pixelRect(ctx, rx + 46 + pupilShift, eyeY + 3, 3, 3, '#f8fafc');

    // Heavy dark circles under eyes
    this.pixelRect(ctx, rx + 18, eyeY + 8, 14, 3, '#581c87');
    this.pixelRect(ctx, rx + 40, eyeY + 8, 14, 3, '#581c87');

    // Tear cascades (streaming down constantly)
    const tearAnim = (tick * 2) % 24;
    this.pixelRect(ctx, rx + 24, eyeY + 11 + (tearAnim % 16), 3, 5, '#38bdf8');
    this.pixelRect(ctx, rx + 46, eyeY + 11 + ((tearAnim + 8) % 16), 3, 5, '#38bdf8');
    // Tear puddles at the base
    this.pixelRect(ctx, rx + 20, ry + 64, 12, 3, '#0284c7');
    this.pixelRect(ctx, rx + 42, ry + 64, 12, 3, '#0284c7');

    // Utterly defeated mouth
    this.pixelRect(ctx, rx + 30, ry + 48, 12, 2, '#111827');
    this.pixelRect(ctx, rx + 28, ry + 50, 2, 3, '#111827');
    this.pixelRect(ctx, rx + 42, ry + 50, 2, 3, '#111827');

    // Sign staked next to the rock
    this.pixelRect(ctx, rx - 10, ry + 36, 2, 24, '#78350f');
    this.pixelRect(ctx, rx - 20, ry + 24, 22, 12, '#fef08a');
    ctx.fillStyle = '#0f172a';
    ctx.font = '6px monospace';
    ctx.fillText('DO NOT', rx - 19, ry + 30);
    ctx.fillText('EXIST', rx - 18, ry + 34);

    if (isSlamming) {
      // Speed lines during duck assault!
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(rx + 10, ry - 14, 4, 10);
      ctx.fillRect(rx + 36, ry - 20, 5, 14);
      ctx.fillRect(rx + 58, ry - 16, 4, 12);
    }
  }

  // Draw The Duck (Innocent victim of Overdepression)
  public static drawDuck(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    squish: number,
    tick: number
  ) {
    const dx = Math.floor(x);
    const dy = Math.floor(y);

    ctx.save();
    ctx.translate(dx + 16, dy + 16);
    ctx.scale(1 / Math.max(0.2, squish), squish);
    ctx.translate(-(dx + 16), -(dy + 16));

    // Water ripple
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.ellipse(dx + 16, dy + 22, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Yellow Body
    this.pixelRect(ctx, dx + 6, dy + 12, 18, 10, '#facc15');
    this.pixelRect(ctx, dx + 10, dy + 8, 14, 10, '#fde047');
    this.pixelRect(ctx, dx + 2, dy + 14, 5, 5, '#eab308'); // Tail

    // Head
    this.pixelRect(ctx, dx + 18, dy + 4, 10, 10, '#facc15');

    // Orange Bill
    this.pixelRect(ctx, dx + 26, dy + 9, 6, 4, '#f97316');

    // Eye
    if (squish < 0.6) {
      // Dazed spiral/cross eye after slam
      this.pixelRect(ctx, dx + 21, dy + 6, 4, 1, '#1e293b');
      this.pixelRect(ctx, dx + 22, dy + 5, 1, 4, '#1e293b');
    } else {
      // Innocent bead eye
      this.pixelRect(ctx, dx + 22, dy + 6, 2, 3, '#0f172a');
      this.pixelRect(ctx, dx + 23, dy + 6, 1, 1, '#ffffff');
    }

    ctx.restore();

    // Floating text if squashed
    if (squish < 0.5) {
      ctx.fillStyle = '#ef4444';
      ctx.font = '8px monospace';
      ctx.fillText('*FLAT*', dx + 4, dy - 2);
    } else {
      // Idle quack bob
      if (Math.sin(tick * 0.1) > 0.8) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '6px monospace';
        ctx.fillText('quack?', dx + 20, dy - 2);
      }
    }
  }

  // Draw Elon Musk (Spinning into orbit)
  public static drawElon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    altitude: number,
    isSpinning: boolean,
    tick: number
  ) {
    const ex = Math.floor(x);
    const ey = Math.floor(y - altitude);

    ctx.save();
    ctx.translate(ex + 12, ey + 16);
    if (isSpinning) {
      ctx.rotate(angle);
    }

    // Helicopter blur lines when spinning fast
    if (isSpinning) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Body (Black suit / SpaceX bomber jacket)
    this.pixelRect(ctx, -6, -2, 12, 14, '#18181b');
    // SpaceX 'X' logo on jacket
    this.pixelRect(ctx, -2, 2, 4, 4, '#ffffff');

    // Arms out like helicopter rotors!
    this.pixelRect(ctx, -14, 0, 8, 4, '#18181b');
    this.pixelRect(ctx, 6, 0, 8, 4, '#18181b');

    // Head
    this.pixelRect(ctx, -5, -12, 10, 10, '#fcd34d');
    // Signature hair
    this.pixelRect(ctx, -6, -14, 12, 4, '#57534e');
    this.pixelRect(ctx, -6, -12, 3, 5, '#57534e');

    // Confident smirk
    this.pixelRect(ctx, -2, -6, 2, 2, '#0f172a');
    this.pixelRect(ctx, 2, -6, 2, 2, '#0f172a');
    this.pixelRect(ctx, -1, -3, 4, 1, '#991b1b');

    // Legs
    this.pixelRect(ctx, -5, 12, 4, 8, '#27272a');
    this.pixelRect(ctx, 1, 12, 4, 8, '#27272a');

    ctx.restore();

    // Rocket thruster sparks or spin sparks
    if (isSpinning) {
      ctx.fillStyle = '#f97316';
      for (let i = 0; i < 4; i++) {
        const sx = ex + 12 + Math.cos(tick + i) * 16;
        const sy = ey + 16 + Math.sin(tick + i) * 16;
        ctx.fillRect(sx, sy, 3, 3);
      }

      ctx.fillStyle = '#38bdf8';
      ctx.font = '7px monospace';
      ctx.fillText('TO MARS! 🚀', ex - 10, ey - 18);
    }
  }

  // Draw The President Bill (Wrinkled unpaid utility invoice at podium, or crumpled origami ball!)
  public static drawPresidentBill(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    tick: number,
    isCrumpled: boolean = false
  ) {
    const bx = Math.floor(x);
    const by = Math.floor(y);

    // Presidential Podium (Wood finish)
    this.pixelRect(ctx, bx + 2, by + 18, 28, 22, '#78350f');
    this.pixelRect(ctx, bx + 4, by + 16, 24, 4, '#92400e');
    this.pixelRect(ctx, bx + 10, by + 24, 12, 12, '#451a03'); // Podium recess

    // Microphones on flexible goose-necks
    this.pixelRect(ctx, bx + 6, by + 12, 2, 6, '#64748b');
    this.pixelRect(ctx, bx + 5, by + 10, 4, 3, '#0f172a');
    this.pixelRect(ctx, bx + 24, by + 12, 2, 6, '#64748b');
    this.pixelRect(ctx, bx + 23, by + 10, 4, 3, '#0f172a');

    if (isCrumpled) {
      // Hilarious crumpled origami paper wad vibrating angrily!
      const px = bx + 10 + (Math.random() * 2 - 1);
      const py = by + 6 + (Math.random() * 2 - 1);

      this.pixelRect(ctx, px, py, 12, 10, '#fef08a');
      this.pixelRect(ctx, px + 2, py + 1, 8, 8, '#fef9c3');
      this.pixelRect(ctx, px - 2, py + 3, 4, 4, '#ca8a04');
      this.pixelRect(ctx, px + 10, py + 2, 4, 5, '#ca8a04');
      // Angry tiny eyes
      this.pixelRect(ctx, px + 3, py + 3, 2, 2, '#ef4444');
      this.pixelRect(ctx, px + 7, py + 3, 2, 2, '#ef4444');

      ctx.fillStyle = '#ef4444';
      ctx.font = '6px monospace';
      ctx.fillText('*CRUMPLED*', bx + 2, by - 2);
    } else {
      // The President Himself: A Wrinkled Overdue Utility Bill!
      const billWiggle = Math.sin(tick * 0.15) * 1.5;
      const px = bx + 7 + billWiggle;
      const py = by;

      // Paper Bill Body (Off-white folded paper)
      this.pixelRect(ctx, px, py, 18, 18, '#fef08a');
      this.pixelRect(ctx, px + 2, py + 2, 14, 14, '#fef9c3');

      // Barcode on top
      this.pixelRect(ctx, px + 3, py + 3, 2, 3, '#0f172a');
      this.pixelRect(ctx, px + 6, py + 3, 1, 3, '#0f172a');
      this.pixelRect(ctx, px + 8, py + 3, 2, 3, '#0f172a');
      this.pixelRect(ctx, px + 12, py + 3, 3, 3, '#0f172a');

      // Angry eyes stamped on the bill
      this.pixelRect(ctx, px + 4, py + 7, 3, 2, '#ef4444');
      this.pixelRect(ctx, px + 11, py + 7, 3, 2, '#ef4444');

      // "OVERDUE $420.69" text
      this.pixelRect(ctx, px + 3, py + 11, 12, 3, '#dc2626');

      // Gold Presidential Seal pin on the bill
      this.pixelRect(ctx, px + 7, py + 13, 4, 4, '#eab308');
    }

    // Red banner on podium
    this.pixelRect(ctx, bx + 6, by + 30, 20, 6, '#b91c1c');
    ctx.fillStyle = '#ffffff';
    ctx.font = '5px monospace';
    ctx.fillText('POTUS', bx + 9, by + 35);
  }

  // Draw 8-bit Low-Poly Cybertruck
  public static drawCybertruck(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rot: number
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // Stainless steel angular wedge body
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(-16, 6);
    ctx.lineTo(-8, -4);
    ctx.lineTo(8, -6);
    ctx.lineTo(16, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Shattered window Easter egg
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -3, 12, 4);
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-2, -2);
    ctx.lineTo(2, 0);
    ctx.stroke();

    // Black rugged wheels
    this.pixelRect(ctx, -12, 6, 6, 4, '#0f172a');
    this.pixelRect(ctx, 6, 6, 6, 4, '#0f172a');

    ctx.restore();
  }

  // Draw Oxygen (Former gas, resigned employee in a tie with moving box)
  public static drawOxygen(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    tick: number
  ) {
    const ox = Math.floor(x);
    const oy = Math.floor(y + Math.sin(tick * 0.08) * 2);

    // Park bench he sits on
    this.pixelRect(ctx, ox - 6, oy + 20, 36, 4, '#78350f');
    this.pixelRect(ctx, ox - 4, oy + 24, 4, 8, '#451a03');
    this.pixelRect(ctx, ox + 24, oy + 24, 4, 8, '#451a03');

    // Translucent cyan gas cloud body
    ctx.fillStyle = 'rgba(125, 211, 252, 0.85)';
    ctx.beginPath();
    ctx.arc(ox + 12, oy + 10, 10, 0, Math.PI * 2);
    ctx.arc(ox + 6, oy + 14, 7, 0, Math.PI * 2);
    ctx.arc(ox + 18, oy + 14, 7, 0, Math.PI * 2);
    ctx.fill();

    // Red necktie (ironic corporate detail)
    this.pixelRect(ctx, ox + 11, oy + 12, 3, 7, '#ef4444');
    this.pixelRect(ctx, ox + 10, oy + 18, 5, 4, '#b91c1c');

    // Exhausted resigned eyes
    this.pixelRect(ctx, ox + 9, oy + 8, 2, 2, '#0f172a');
    this.pixelRect(ctx, ox + 14, oy + 8, 2, 2, '#0f172a');
    // Downwards sigh mouth
    this.pixelRect(ctx, ox + 10, oy + 11, 5, 1, '#0f172a');

    // Cardboard box labeled "MY DESK"
    this.pixelRect(ctx, ox + 22, oy + 10, 12, 10, '#d97706');
    this.pixelRect(ctx, ox + 23, oy + 11, 10, 8, '#b45309');
    // Cactus plant in the box
    this.pixelRect(ctx, ox + 26, oy + 6, 4, 6, '#22c55e');

    // Floating sigh
    ctx.fillStyle = '#94a3b8';
    ctx.font = '6px monospace';
    ctx.fillText('I QUIT', ox + 8, oy - 2);
  }

  // Draw Google Corporate Acquisition Drone
  public static drawGoogleDrone(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    tick: number
  ) {
    const gx = Math.floor(x);
    const gy = Math.floor(y + Math.sin(tick * 0.12) * 3);

    // Quadcopter arms
    this.pixelRect(ctx, gx + 2, gy + 8, 28, 2, '#94a3b8');
    this.pixelRect(ctx, gx + 8, gy + 2, 2, 14, '#94a3b8');
    this.pixelRect(ctx, gx + 22, gy + 2, 2, 14, '#94a3b8');

    // Spinning rotors (4 Google Colors)
    const rotorOffset = Math.sin(tick * 0.5) * 4;
    this.pixelRect(ctx, gx + 1 + rotorOffset, gy, 8, 2, '#4285F4'); // Blue
    this.pixelRect(ctx, gx + 21 + rotorOffset, gy, 8, 2, '#EA4335'); // Red
    this.pixelRect(ctx, gx + 1 - rotorOffset, gy + 16, 8, 2, '#FBBC05'); // Yellow
    this.pixelRect(ctx, gx + 21 - rotorOffset, gy + 16, 8, 2, '#34A853'); // Green

    // Central chassis with Google G logo
    this.pixelRect(ctx, gx + 10, gy + 6, 12, 10, '#ffffff');
    this.pixelRect(ctx, gx + 12, gy + 8, 8, 2, '#4285F4');
    this.pixelRect(ctx, gx + 12, gy + 10, 2, 4, '#EA4335');
    this.pixelRect(ctx, gx + 12, gy + 13, 8, 2, '#34A853');
    this.pixelRect(ctx, gx + 18, gy + 10, 2, 3, '#FBBC05');
    this.pixelRect(ctx, gx + 15, gy + 10, 4, 2, '#4285F4');

    // Contract hanging underneath
    this.pixelRect(ctx, gx + 12, gy + 17, 8, 8, '#f8fafc');
    this.pixelRect(ctx, gx + 13, gy + 19, 6, 1, '#dc2626');
    this.pixelRect(ctx, gx + 13, gy + 21, 6, 1, '#1e293b');
  }

  // Draw The Sun in the Sky (Supernova & Unexplosion)
  public static drawSun(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    state: 'normal' | 'supernova' | 'unexploding' | 'repaired',
    progress: number,
    tick: number
  ) {
    const sx = Math.floor(x);
    const sy = Math.floor(y);

    if (state === 'normal') {
      // Normal happy retro sun
      const pulse = Math.sin(tick * 0.05) * 2;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sx, sy, 22 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Inner core
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(sx, sy, 17, 0, Math.PI * 2);
      ctx.fill();

      // Sunglasses on the sun
      this.pixelRect(ctx, sx - 10, sy - 3, 8, 5, '#0f172a');
      this.pixelRect(ctx, sx + 2, sy - 3, 8, 5, '#0f172a');
      this.pixelRect(ctx, sx - 2, sy - 1, 4, 2, '#0f172a');
      // Grin
      this.pixelRect(ctx, sx - 6, sy + 6, 12, 2, '#b45309');
    } else if (state === 'supernova') {
      // Apocalyptic exploding supernova!
      const radius = 24 + progress * 90;
      const grad = ctx.createRadialGradient(sx, sy, 10, sx, sy, radius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, '#fde047');
      grad.addColorStop(0.5, '#ea580c');
      grad.addColorStop(0.8, '#dc2626');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Solar flare lightning
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2 + tick * 0.1;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(
          sx + Math.cos(ang) * (radius * 1.2),
          sy + Math.sin(ang) * (radius * 1.2)
        );
        ctx.stroke();
      }
    } else if (state === 'unexploding') {
      // Reversing physics: imploding shockwaves!
      const radius = Math.max(16, 114 - progress * 90);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(sx, sy, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      ctx.fillText('« REWINDING «', sx - 32, sy + 32);
    } else {
      // Repaired sun with a cartoon band-aid!
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sx, sy, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(sx, sy, 17, 0, Math.PI * 2);
      ctx.fill();

      // Band-aid
      this.pixelRect(ctx, sx - 12, sy - 4, 24, 8, '#fed7aa');
      this.pixelRect(ctx, sx - 4, sy - 4, 8, 8, '#ffedd5');

      // Sad traumatized face
      this.pixelRect(ctx, sx - 8, sy - 8, 3, 3, '#0f172a');
      this.pixelRect(ctx, sx + 5, sy - 8, 3, 3, '#0f172a');
      this.pixelRect(ctx, sx - 4, sy + 8, 8, 2, '#78350f');
    }
  }

  // Draw Copium Canister (Restores breathing)
  public static drawCopiumCan(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
    const cx = Math.floor(x);
    const cy = Math.floor(y + Math.sin(tick * 0.1) * 2);

    this.pixelRect(ctx, cx + 2, cy + 2, 10, 14, '#0284c7');
    this.pixelRect(ctx, cx + 4, cy, 6, 2, '#94a3b8');
    this.pixelRect(ctx, cx + 3, cy + 5, 8, 6, '#38bdf8');
    ctx.fillStyle = '#ffffff';
    ctx.font = '5px monospace';
    ctx.fillText('O2', cx + 4, cy + 10);
  }
}
