// motifs.js — flat vector scenes for panels that hold no photo yet.
// Seven little postcards, drawn with plain canvas paths, picked by
// panel index so an empty cover still reads as a finished poster.

function skyWash(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  for (const [at, colour] of stops) g.addColorStop(at, colour);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

function sunDisc(ctx, cx, cy, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

export function drawPalmSilhouette(ctx, baseX, baseY, height, lean, colour) {
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  const topX = baseX + lean * height;
  const topY = baseY - height;
  ctx.lineWidth = Math.max(2, height * 0.055);
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.quadraticCurveTo(baseX + lean * height * 0.3, baseY - height * 0.6, topX, topY);
  ctx.stroke();
  ctx.lineWidth = Math.max(1.5, height * 0.03);
  for (let i = 0; i < 6; i++) {
    const a = Math.PI * (0.08 + i * 0.17);
    const reach = height * 0.34;
    const endX = topX + Math.cos(a) * reach * (i < 3 ? -1 : 1) * (0.6 + 0.4 * Math.sin(a));
    const endY = topY - Math.sin(a) * reach * 0.42 + reach * 0.16;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX + (endX - topX) * 0.5, topY - reach * 0.22, endX, endY);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(topX - 3, topY + 3, height * 0.035, 0, Math.PI * 2);
  ctx.arc(topX + 4, topY + 4, height * 0.03, 0, Math.PI * 2);
  ctx.fill();
}

function heliScene(ctx, x, y, w, h) {
  skyWash(ctx, x, y, w, h, [[0, '#2b1055'], [0.6, '#b83280'], [1, '#ff8a3c']]);
  sunDisc(ctx, x + w * 0.78, y + h * 0.3, w * 0.09, '#ffd98a');
  ctx.fillStyle = '#1c0f38';
  const base = y + h;
  const widths = [0.16, 0.11, 0.2, 0.13, 0.18, 0.12];
  let bx = x;
  for (let i = 0; i < widths.length; i++) {
    const bw = w * widths[i];
    const bh = h * (0.3 + ((i * 37) % 25) / 100);
    ctx.fillRect(bx, base - bh, bw, bh);
    bx += bw;
  }
  ctx.fillStyle = '#ffe9a8';
  for (let i = 0; i < 14; i++) {
    ctx.fillRect(x + ((i * 53) % 90) / 100 * w, y + h * (0.62 + ((i * 29) % 30) / 100), 3, 4);
  }
  const hx = x + w * 0.36, hy = y + h * 0.3, s = w * 0.16;
  ctx.fillStyle = '#12081f';
  ctx.beginPath();
  ctx.ellipse(hx, hy, s * 0.52, s * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(hx + s * 0.4, hy - s * 0.08, s * 0.62, s * 0.1);
  ctx.beginPath();
  ctx.moveTo(hx + s * 1.0, hy - s * 0.04);
  ctx.lineTo(hx + s * 1.12, hy - s * 0.3);
  ctx.lineTo(hx + s * 1.2, hy - s * 0.28);
  ctx.lineTo(hx + s * 1.1, hy + s * 0.02);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#12081f';
  ctx.lineWidth = Math.max(2, s * 0.05);
  ctx.beginPath();
  ctx.moveTo(hx - s * 0.85, hy - s * 0.42);
  ctx.lineTo(hx + s * 0.85, hy - s * 0.42);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(hx - s * 0.3, hy + s * 0.34);
  ctx.lineTo(hx - s * 0.42, hy + s * 0.52);
  ctx.moveTo(hx + s * 0.3, hy + s * 0.34);
  ctx.lineTo(hx + s * 0.42, hy + s * 0.52);
  ctx.moveTo(hx - s * 0.5, hy + s * 0.52);
  ctx.lineTo(hx + s * 0.5, hy + s * 0.52);
  ctx.stroke();
}

function boatScene(ctx, x, y, w, h) {
  skyWash(ctx, x, y, w, h, [[0, '#7fe7ff'], [0.55, '#ffe3f1'], [1, '#ffd98a']]);
  sunDisc(ctx, x + w * 0.2, y + h * 0.24, w * 0.08, '#fff3b0');
  ctx.fillStyle = '#0e7fa8';
  ctx.fillRect(x, y + h * 0.58, w, h * 0.42);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x + w * (0.06 + i * 0.22), y + h * (0.7 + i * 0.07));
    ctx.lineTo(x + w * (0.2 + i * 0.22), y + h * (0.7 + i * 0.07));
    ctx.stroke();
  }
  const bx = x + w * 0.3, by = y + h * 0.6, bw = w * 0.44, bh = h * 0.12;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx + bw, by);
  ctx.lineTo(bx + bw * 0.86, by + bh);
  ctx.lineTo(bx + bw * 0.12, by + bh);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ff3d8a';
  ctx.fillRect(bx + bw * 0.08, by - bh * 0.36, bw * 0.5, bh * 0.36);
  ctx.fillStyle = '#17324a';
  ctx.fillRect(bx + bw * 0.62, by - bh * 0.62, bw * 0.09, bh * 0.62);
  const fx = x + w * 0.82, fy = y + h * 0.66, fs = h * 0.3;
  ctx.strokeStyle = '#ff6fae';
  ctx.lineWidth = Math.max(3, fs * 0.09);
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.lineTo(fx, fy - fs * 0.4);
  ctx.stroke();
  ctx.fillStyle = '#ff8fc0';
  ctx.beginPath();
  ctx.ellipse(fx - fs * 0.06, fy - fs * 0.52, fs * 0.24, fs * 0.15, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ff6fae';
  ctx.lineWidth = Math.max(2, fs * 0.06);
  ctx.beginPath();
  ctx.moveTo(fx + fs * 0.1, fy - fs * 0.58);
  ctx.quadraticCurveTo(fx + fs * 0.34, fy - fs * 0.86, fx + fs * 0.16, fy - fs * 0.98);
  ctx.stroke();
  ctx.fillStyle = '#ffb3d4';
  ctx.beginPath();
  ctx.moveTo(fx + fs * 0.16, fy - fs * 0.98);
  ctx.lineTo(fx + fs * 0.3, fy - fs * 0.9);
  ctx.lineTo(fx + fs * 0.15, fy - fs * 0.86);
  ctx.closePath();
  ctx.fill();
}

function carScene(ctx, x, y, w, h) {
  skyWash(ctx, x, y, w, h, [[0, '#1b2a6b'], [0.65, '#7a2ea0'], [1, '#ff5e78']]);
  ctx.fillStyle = '#140b26';
  ctx.fillRect(x, y + h * 0.78, w, h * 0.22);
  ctx.strokeStyle = '#ffd23c';
  ctx.lineWidth = Math.max(2, h * 0.012);
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.78);
  ctx.lineTo(x + w, y + h * 0.78);
  ctx.stroke();
  const cx = x + w * 0.16, cy = y + h * 0.6, cw = w * 0.68, ch = h * 0.2;
  ctx.fillStyle = '#ffd23c';
  ctx.beginPath();
  ctx.moveTo(cx, cy + ch * 0.5);
  ctx.quadraticCurveTo(cx + cw * 0.06, cy, cx + cw * 0.3, cy - ch * 0.1);
  ctx.lineTo(cx + cw * 0.52, cy - ch * 0.55);
  ctx.quadraticCurveTo(cx + cw * 0.56, cy - ch * 0.72, cx + cw * 0.68, cy - ch * 0.6);
  ctx.lineTo(cx + cw * 0.86, cy - ch * 0.05);
  ctx.quadraticCurveTo(cx + cw, cy + ch * 0.1, cx + cw, cy + ch * 0.5);
  ctx.lineTo(cx + cw, cy + ch);
  ctx.lineTo(cx, cy + ch);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#bfe9ff';
  ctx.beginPath();
  ctx.moveTo(cx + cw * 0.34, cy - ch * 0.12);
  ctx.lineTo(cx + cw * 0.52, cy - ch * 0.5);
  ctx.lineTo(cx + cw * 0.62, cy - ch * 0.48);
  ctx.lineTo(cx + cw * 0.55, cy - ch * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f5b81e';
  ctx.beginPath();
  ctx.moveTo(cx + cw * 0.58, cy - ch * 0.55);
  ctx.lineTo(cx + cw * 0.78, cy - ch * 1.5);
  ctx.lineTo(cx + cw * 0.88, cy - ch * 1.42);
  ctx.lineTo(cx + cw * 0.7, cy - ch * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#14141c';
  for (const wx of [0.22, 0.78]) {
    ctx.beginPath();
    ctx.arc(cx + cw * wx, cy + ch, ch * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cfd6dd';
    ctx.beginPath();
    ctx.arc(cx + cw * wx, cy + ch, ch * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#14141c';
  }
}

function gatorScene(ctx, x, y, w, h) {
  skyWash(ctx, x, y, w, h, [[0, '#0d5c63'], [1, '#12a5a0']]);
  ctx.fillStyle = '#0a4046';
  ctx.fillRect(x, y + h * 0.55, w, h * 0.45);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(x + w * (0.2 + i * 0.16), y + h * (0.68 + (i % 2) * 0.12), w * 0.07, h * 0.02, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  const gx = x + w * 0.2, gy = y + h * 0.52, gw = w * 0.62, gh = h * 0.16;
  ctx.fillStyle = '#2e7d46';
  ctx.beginPath();
  ctx.moveTo(gx, gy + gh * 0.4);
  ctx.quadraticCurveTo(gx + gw * 0.1, gy - gh * 0.3, gx + gw * 0.42, gy - gh * 0.22);
  ctx.lineTo(gx + gw, gy + gh * 0.18);
  ctx.quadraticCurveTo(gx + gw, gy + gh * 0.55, gx + gw * 0.7, gy + gh * 0.6);
  ctx.lineTo(gx + gw * 0.1, gy + gh * 0.72);
  ctx.quadraticCurveTo(gx - gw * 0.02, gy + gh * 0.6, gx, gy + gh * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2e7d46';
  ctx.beginPath();
  ctx.arc(gx + gw * 0.3, gy - gh * 0.28, gh * 0.3, 0, Math.PI * 2);
  ctx.arc(gx + gw * 0.48, gy - gh * 0.3, gh * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(gx + gw * 0.3, gy - gh * 0.3, gh * 0.15, 0, Math.PI * 2);
  ctx.arc(gx + gw * 0.48, gy - gh * 0.32, gh * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0c1a12';
  ctx.beginPath();
  ctx.arc(gx + gw * 0.3, gy - gh * 0.3, gh * 0.07, 0, Math.PI * 2);
  ctx.arc(gx + gw * 0.48, gy - gh * 0.32, gh * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8f5e9';
  for (let i = 0; i < 5; i++) {
    const tx = gx + gw * (0.68 + i * 0.06);
    ctx.beginPath();
    ctx.moveTo(tx, gy + gh * 0.5);
    ctx.lineTo(tx + gw * 0.02, gy + gh * 0.78);
    ctx.lineTo(tx + gw * 0.04, gy + gh * 0.5);
    ctx.closePath();
    ctx.fill();
  }
}

function palmsScene(ctx, x, y, w, h) {
  skyWash(ctx, x, y, w, h, [[0, '#ff9a3c'], [0.55, '#ff5e8a'], [1, '#5b2a86']]);
  const sx = x + w * 0.5, sy = y + h * 0.44, sr = w * 0.21;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sx, sy, sr, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#ffe9a8';
  ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
  ctx.fillStyle = '#ff7a5c';
  for (let i = 0; i < 4; i++) ctx.fillRect(sx - sr, sy - sr + i * sr * 0.5 + sr * 0.22, sr * 2, sr * 0.16);
  ctx.restore();
  ctx.fillStyle = '#160a2a';
  ctx.fillRect(x, y + h * 0.86, w, h * 0.14);
  drawPalmSilhouette(ctx, x + w * 0.18, y + h * 0.92, h * 0.52, 0.16, '#160a2a');
  drawPalmSilhouette(ctx, x + w * 0.84, y + h * 0.94, h * 0.62, -0.13, '#160a2a');
  drawPalmSilhouette(ctx, x + w * 0.62, y + h * 0.9, h * 0.36, 0.1, '#160a2a');
}

function hotelScene(ctx, x, y, w, h) {
  skyWash(ctx, x, y, w, h, [[0, '#101d42'], [1, '#3a1c71']]);
  sunDisc(ctx, x + w * 0.84, y + h * 0.18, w * 0.05, '#f5f0ff');
  const bx = x + w * 0.3, bw = w * 0.4, by = y + h * 0.16, bh = h * 0.84;
  ctx.fillStyle = '#f2e6c9';
  ctx.fillRect(bx, by + bh * 0.14, bw, bh * 0.86);
  ctx.fillRect(bx + bw * 0.18, by + bh * 0.06, bw * 0.64, bh * 0.1);
  ctx.fillRect(bx + bw * 0.36, by, bw * 0.28, bh * 0.08);
  ctx.fillStyle = '#12dec3';
  ctx.fillRect(bx, by + bh * 0.14, bw, 4);
  ctx.fillRect(bx, by + bh * 0.55, bw, 4);
  ctx.fillStyle = '#ff3d8a';
  ctx.fillRect(bx - 3, by + bh * 0.3, bw + 6, 4);
  ctx.fillStyle = '#ffd23c';
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 3; c++) {
      if ((r * 3 + c) % 3 === 1) continue;
      ctx.fillRect(bx + bw * (0.14 + c * 0.28), by + bh * (0.22 + r * 0.12), bw * 0.16, bh * 0.07);
    }
  }
  ctx.fillStyle = '#0a0f24';
  ctx.fillRect(x, y + h * 0.97, w, h * 0.03);
  drawPalmSilhouette(ctx, x + w * 0.16, y + h, h * 0.4, 0.14, '#0a0f24');
  drawPalmSilhouette(ctx, x + w * 0.86, y + h, h * 0.46, -0.12, '#0a0f24');
}

function bayScene(ctx, x, y, w, h) {
  skyWash(ctx, x, y, w, h, [[0, '#8ad8ff'], [0.6, '#ffe9c9'], [1, '#ffb37a']]);
  sunDisc(ctx, x + w * 0.72, y + h * 0.3, w * 0.07, '#fff3b0');
  ctx.fillStyle = '#0e7fa8';
  ctx.fillRect(x, y + h * 0.62, w, h * 0.38);
  ctx.fillStyle = '#0a5d7d';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.62);
  ctx.lineTo(x + w * 0.3, y + h * 0.55);
  ctx.lineTo(x + w * 0.55, y + h * 0.62);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#17324a';
  ctx.lineWidth = Math.max(2, h * 0.008);
  ctx.lineCap = 'round';
  const birds = [[0.24, 0.2, 1], [0.4, 0.13, 0.7], [0.56, 0.24, 0.85], [0.33, 0.32, 0.55], [0.66, 0.12, 0.6]];
  for (const [fx, fy, s] of birds) {
    const bx = x + w * fx, by = y + h * fy, r = w * 0.035 * s;
    ctx.beginPath();
    ctx.arc(bx - r, by, r, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(bx + r, by, r, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
}

const SCENES = [heliScene, boatScene, carScene, gatorScene, palmsScene, hotelScene, bayScene];

export function paintMotif(ctx, rect, panelIndex) {
  const scene = SCENES[panelIndex % SCENES.length];
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  scene(ctx, rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}
