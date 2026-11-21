// Lantern Harbour — a spot-the-difference game.
//
// Two panels show the same harbour at dusk; the right one hides
// ten small changes. Click a change on either panel to ring it on
// both, and the counter of what remains ticks down. Three hints,
// a running clock, and a miss counter keep it honest. The game is
// plain DOM and SVG: no network, no libraries, mouse and keyboard
// alike (arrow keys move the ring, Enter taps it, H hints, R
// restarts).
//
// The ?shot= states render fixed frames for the entry's
// screenshots: start (the welcome card), play (four differences
// already ringed, six to go) and end (the win card). They freeze
// the clock so every render is the same picture.

import { buildScene, DIFFS } from './scene.js';
import { sfx } from './audio.js';

const TOTAL = DIFFS.length;
const params = new URLSearchParams(location.search);
const shot = params.get('shot');

const els = {
  a: document.getElementById('sceneA'),
  b: document.getElementById('sceneB'),
  marksA: document.getElementById('marksA'),
  marksB: document.getElementById('marksB'),
  left: document.getElementById('left'),
  found: document.getElementById('found'),
  time: document.getElementById('time'),
  misses: document.getElementById('misses'),
  hints: document.getElementById('hints'),
  msg: document.getElementById('msg'),
  card: document.getElementById('card'),
  cardTitle: document.getElementById('cardTitle'),
  cardText: document.getElementById('cardText'),
  cardBtn: document.getElementById('cardBtn'),
  cursor: document.getElementById('cursor'),
  status: document.getElementById('status'),
};

const state = {
  found: new Set(),
  misses: 0,
  hints: 3,
  seconds: 0,
  timer: null,
  started: false,
  won: false,
  cursor: { x: 400, y: 280 },
};

els.a.innerHTML = buildScene('');
els.b.innerHTML = buildScene('all');

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function announce(text) {
  els.status.textContent = text;
}

function render() {
  els.left.textContent = String(TOTAL - state.found.size);
  els.found.textContent = String(state.found.size);
  els.misses.textContent = String(state.misses);
  els.hints.textContent = String(state.hints);
  els.time.textContent = fmt(state.seconds);
  const draw = (svg) => {
    const parts = [];
    let n = 0;
    for (const [id, x, y] of DIFFS) {
      if (!state.found.has(id)) continue;
      n += 1;
      parts.push(
        `<circle cx="${x}" cy="${y}" r="24" class="ring"/>` +
        `<circle cx="${x + 17}" cy="${y - 17}" r="10" class="badge"/>` +
        `<text x="${x + 17}" y="${y - 13}" class="badgeText">${n}</text>`,
      );
    }
    svg.innerHTML = parts.join('');
  };
  draw(els.marksA);
  draw(els.marksB);
}

function startClock() {
  if (state.timer !== null || shot) return;
  state.timer = setInterval(() => {
    state.seconds += 1;
    els.time.textContent = fmt(state.seconds);
  }, 1000);
}

function showCard(title, text, btn) {
  els.cardTitle.textContent = title;
  els.cardText.textContent = text;
  els.cardBtn.textContent = btn;
  els.card.hidden = false;
}

function hideCard() {
  els.card.hidden = true;
}

function win() {
  state.won = true;
  if (state.timer !== null) clearInterval(state.timer);
  sfx.win();
  showCard(
    'Harbour complete!',
    `All ${TOTAL} differences found in ${fmt(state.seconds)} with ${state.misses} miss${state.misses === 1 ? '' : 'es'}. The lanterns approve.`,
    'Play again',
  );
  announce('You found every difference. Well played.');
}

function ripple(svg, x, y, cls) {
  const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  c.setAttribute('cx', String(x));
  c.setAttribute('cy', String(y));
  c.setAttribute('r', '10');
  c.setAttribute('class', cls);
  svg.appendChild(c);
  setTimeout(() => c.remove(), 650);
}

function tap(x, y, panel) {
  if (state.won || !els.card.hidden) return;
  if (!state.started) {
    state.started = true;
    startClock();
  }
  for (const [id, dx, dy, r] of DIFFS) {
    if (state.found.has(id)) continue;
    if ((x - dx) ** 2 + (y - dy) ** 2 <= r * r) {
      state.found.add(id);
      sfx.found();
      els.msg.textContent = `Found: ${DIFFS.find((d) => d[0] === id)[4]}.`;
      announce(`Found ${state.found.size} of ${TOTAL}.`);
      render();
      if (state.found.size === TOTAL) win();
      return;
    }
  }
  state.misses += 1;
  sfx.miss();
  els.msg.textContent = 'Not a difference — the harbour keeps its secrets.';
  ripple(panel === 'A' ? els.marksA : els.marksB, x, y, 'missRipple');
  document.getElementById(panel === 'A' ? 'panelA' : 'panelB').classList.add('shake');
  setTimeout(() => document.getElementById(panel === 'A' ? 'panelA' : 'panelB').classList.remove('shake'), 300);
  render();
}

function toScene(evt, svg) {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / rect.width) * 800,
    y: ((evt.clientY - rect.top) / rect.height) * 560,
  };
}

for (const [svgEl, marksEl, name] of [[els.a, els.marksA, 'A'], [els.b, els.marksB, 'B']]) {
  svgEl.addEventListener('click', (evt) => {
    const p = toScene(evt, svgEl.querySelector('svg'));
    tap(p.x, p.y, name);
  });
  marksEl.addEventListener('click', (evt) => {
    const p = toScene(evt, marksEl);
    tap(p.x, p.y, name);
  });
}

function hint() {
  if (state.won || state.hints <= 0 || !els.card.hidden) return;
  const open = DIFFS.filter((d) => !state.found.has(d[0]));
  if (open.length === 0) return;
  state.hints -= 1;
  sfx.hint();
  const [, x, y] = open[Math.floor(Math.random() * open.length)];
  ripple(els.marksA, x, y, 'hintRipple');
  ripple(els.marksB, x, y, 'hintRipple');
  els.msg.textContent = 'A lantern flickers somewhere…';
  render();
}

function restart() {
  state.found.clear();
  state.misses = 0;
  state.hints = 3;
  state.seconds = 0;
  state.won = false;
  state.started = false;
  if (state.timer !== null) {
    clearInterval(state.timer);
    state.timer = null;
  }
  els.msg.textContent = 'Find all ten differences between the two harbours.';
  hideCard();
  render();
}

document.getElementById('hintBtn').addEventListener('click', hint);
document.getElementById('restartBtn').addEventListener('click', restart);
els.cardBtn.addEventListener('click', () => {
  hideCard();
  if (state.won) restart();
  else {
    state.started = true;
    sfx.start();
    startClock();
  }
});

// Keyboard play: a ring cursor over the right panel.
function moveCursor() {
  const panel = document.getElementById('panelB').getBoundingClientRect();
  els.cursor.style.left = `${panel.left + (state.cursor.x / 800) * panel.width}px`;
  els.cursor.style.top = `${panel.top + (state.cursor.y / 560) * panel.height}px`;
}
window.addEventListener('resize', moveCursor);
document.addEventListener('keydown', (evt) => {
  const step = evt.shiftKey ? 28 : 12;
  if (evt.key === 'ArrowLeft') state.cursor.x = Math.max(0, state.cursor.x - step);
  else if (evt.key === 'ArrowRight') state.cursor.x = Math.min(800, state.cursor.x + step);
  else if (evt.key === 'ArrowUp') state.cursor.y = Math.max(0, state.cursor.y - step);
  else if (evt.key === 'ArrowDown') state.cursor.y = Math.min(560, state.cursor.y + step);
  else if (evt.key === 'Enter' || evt.key === ' ') {
    tap(state.cursor.x, state.cursor.y, 'B');
    evt.preventDefault();
    return;
  } else if (evt.key === 'h' || evt.key === 'H') hint();
  else if (evt.key === 'r' || evt.key === 'R') restart();
  else return;
  els.cursor.hidden = false;
  moveCursor();
});

// Fixed frames for the screenshots; live play otherwise.
if (shot === 'play') {
  for (const id of ['stripe', 'sign', 'gull', 'fish']) state.found.add(id);
  state.misses = 1;
  state.hints = 2;
  state.seconds = 83;
  state.started = true;
  els.msg.textContent = 'Found: the jumping fish. Six differences still hide.';
  hideCard();
  render();
} else if (shot === 'end') {
  for (const [id] of DIFFS) state.found.add(id);
  state.misses = 2;
  state.hints = 1;
  state.seconds = 227;
  state.won = true;
  render();
  showCard('Harbour complete!', `All ${TOTAL} differences found in ${fmt(state.seconds)} with 2 misses. The lanterns approve.`, 'Play again');
} else {
  render();
  if (shot === 'start') {
    showCard('Lantern Harbour', `Two harbours, ten differences. Click a change on either picture to ring it — ${TOTAL} to find, three hints in your pocket.`, 'Start looking');
  } else {
    showCard('Lantern Harbour', `Two harbours, ten differences. Click a change on either picture to ring it — ${TOTAL} to find, three hints in your pocket.`, 'Start looking');
  }
}
moveCursor();
