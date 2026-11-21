// Tiny WebAudio sounds, synthesised in code — no audio files, so
// the game stays fully offline. A soft pop when a difference is
// found, a low buzz for a miss, a rising arpeggio for a hint and a
// small fanfare when the last difference falls.

let ctx = null;

function ac() {
  if (ctx === null) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type = 'sine', gain = 0.12) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + at;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  found() {
    tone(660, 0, 0.12);
    tone(880, 0.07, 0.16);
  },
  miss() {
    tone(140, 0, 0.18, 'square', 0.05);
  },
  hint() {
    tone(520, 0, 0.1);
    tone(660, 0.08, 0.1);
    tone(780, 0.16, 0.14);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.13));
  },
  start() {
    tone(440, 0, 0.1);
    tone(587, 0.08, 0.14);
  },
};
