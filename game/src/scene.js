// The scene: "Lantern Harbour at Dusk", drawn as one SVG per panel.
// buildScene(variant) renders the same harbour twice; the variant
// panel carries the differences listed in DIFFS. Each difference is
// a small, named change — an object gone, a colour swapped, a sign
// re-lettered — placed at a fixed point of the 800 x 560 viewBox,
// and DIFFS gives the point a player must click (either panel) and
// the radius that counts as finding it.

// [id, x, y, radius, label]
export const DIFFS = [
  ['gull', 618, 92, 30, 'the gull over the lighthouse'],
  ['stripe', 690, 228, 30, 'the lighthouse stripe'],
  ['sail', 322, 344, 34, 'the sail stripes'],
  ['star', 150, 62, 24, 'the bright star'],
  ['sign', 210, 295, 36, 'the cafe sign letter'],
  ['cat', 430, 346, 28, 'the cat on the pier'],
  ['window', 189, 339, 24, 'the lit window'],
  ['balloon', 615, 268, 26, 'the balloon colour'],
  ['fish', 356, 452, 28, 'the jumping fish'],
  ['clock', 84, 168, 28, 'the clock hands'],
];

const has = (variant, id) => variant === id;

// One harbour, two tellings. `variant` is '' for the original and
// the id of every difference to apply for the changed panel; the
// game passes 'all' there, so every difference shows at once.
export function buildScene(variant) {
  const v = (id) => variant === 'all' || has(variant, id);
  const stripe = v('stripe') ? '#3b6ea5' : '#c0392b';
  const balloon = v('balloon') ? '#8e44ad' : '#27ae60';
  return `
<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lantern Harbour at dusk">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2c3e70"/><stop offset="0.55" stop-color="#7a4a7e"/>
      <stop offset="1" stop-color="#e8875b"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3d5a80"/><stop offset="1" stop-color="#1d3557"/>
    </linearGradient>
  </defs>
  <rect width="800" height="380" fill="url(#sky)"/>
  <circle cx="648" cy="96" r="40" fill="#f6d186"/>
  <circle cx="648" cy="96" r="58" fill="#f6d186" opacity="0.25"/>
  ${v('star') ? '' : '<path d="M150 44 l5 13 13 0 -10 9 4 13 -12 -8 -12 8 4 -13 -10 -9 13 0 z" fill="#ffe9a8"/>'}
  <path d="M96 84 l4 9 9 0 -7 6 3 9 -9 -6 -9 6 3 -9 -7 -6 9 0 z" fill="#ffe9a8" opacity="0.8"/>
  <path d="M420 52 l3 8 8 0 -6 5 2 8 -7 -5 -7 5 2 -8 -6 -5 8 0 z" fill="#ffe9a8" opacity="0.7"/>
  <ellipse cx="238" cy="104" rx="66" ry="17" fill="#f4f1de" opacity="0.85"/>
  <ellipse cx="520" cy="66" rx="52" ry="13" fill="#f4f1de" opacity="0.7"/>
  ${v('gull') ? '' : '<path d="M596 92 q12 -12 22 0 q10 -12 22 0" stroke="#20304a" stroke-width="4" fill="none" stroke-linecap="round"/>'}
  <path d="M120 130 q10 -10 18 0 q9 -10 18 0" stroke="#20304a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M330 148 q8 -8 15 0 q8 -8 15 0" stroke="#20304a" stroke-width="3" fill="none" stroke-linecap="round"/>

  <path d="M0 380 L800 380 L800 560 L0 560 Z" fill="url(#sea)"/>
  <path d="M0 402 q60 -8 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t80 0" stroke="#98c1d9" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M0 470 q60 -8 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t80 0" stroke="#98c1d9" stroke-width="3" fill="none" opacity="0.35"/>
  <ellipse cx="648" cy="392" rx="90" ry="7" fill="#f6d186" opacity="0.35"/>

  <g>
    <rect x="664" y="150" width="52" height="150" fill="#f4f1de"/>
    <rect x="664" y="196" width="52" height="20" fill="${stripe}"/>
    <rect x="664" y="240" width="52" height="20" fill="${stripe}"/>
    <rect x="658" y="132" width="64" height="18" rx="4" fill="#293241"/>
    <rect x="678" y="104" width="24" height="28" fill="#293241"/>
    <circle cx="690" cy="118" r="8" fill="#ffd166"/>
    <path d="M646 300 h88 l10 14 h-108 z" fill="#5b4a3f"/>
  </g>

  <g>
    <rect x="40" y="120" width="88" height="180" fill="#8a5a44"/>
    <path d="M28 122 L84 66 L140 122 Z" fill="#5d3a2a"/>
    <circle cx="84" cy="168" r="26" fill="#f4f1de"/>
    <circle cx="84" cy="168" r="21" fill="#fdf6e3"/>
    ${v('clock')
      ? '<line x1="84" y1="168" x2="84" y2="152" stroke="#293241" stroke-width="4" stroke-linecap="round"/><line x1="84" y1="168" x2="99" y2="168" stroke="#293241" stroke-width="4" stroke-linecap="round"/>'
      : '<line x1="84" y1="168" x2="84" y2="152" stroke="#293241" stroke-width="4" stroke-linecap="round"/><line x1="84" y1="168" x2="72" y2="176" stroke="#293241" stroke-width="4" stroke-linecap="round"/>'}
    <rect x="66" y="238" width="36" height="62" fill="#3d2b1f"/>
  </g>

  <g>
    <rect x="150" y="252" width="120" height="104" fill="#e0aa6e"/>
    <path d="M140 254 L210 208 L280 254 Z" fill="#9c6644"/>
    <rect x="160" y="282" width="100" height="26" fill="#293241"/>
    <text x="210" y="301" font-family="Georgia, serif" font-size="19" fill="#ffd166" text-anchor="middle" letter-spacing="3">${v('sign') ? 'CAFF' : 'CAFE'}</text>
    <rect x="176" y="322" width="26" height="34" fill="${v('window') ? '#4a3b2c' : '#ffd166'}"/>
    <rect x="222" y="322" width="26" height="34" fill="#ffd166"/>
    <line x1="189" y1="322" x2="189" y2="356" stroke="#293241" stroke-width="2"/>
    <rect x="146" y="352" width="128" height="6" fill="#7f5539"/>
  </g>

  <g>
    <rect x="470" y="268" width="104" height="88" fill="#b08968"/>
    <path d="M460 270 L522 226 L584 270 Z" fill="#6f4e37"/>
    <rect x="506" y="306" width="32" height="50" fill="#3d2b1f"/>
    <rect x="482" y="282" width="20" height="20" fill="#ffd166"/>
    <rect x="542" y="282" width="20" height="20" fill="#a8dadc"/>
  </g>

  <g>
    <path d="M252 372 q48 -26 96 0 l-10 22 h-76 z" fill="#9c6644"/>
    <rect x="296" y="316" width="5" height="58" fill="#5d3a2a"/>
    ${v('sail')
      ? '<path d="M301 316 L344 366 L301 366 Z" fill="#f4f1de"/><path d="M301 330 L330 356 L301 356 Z" fill="#e8875b"/><path d="M301 344 L318 360 L301 360 Z" fill="#f4f1de"/>'
      : '<path d="M301 316 L344 366 L301 366 Z" fill="#f4f1de"/>'}
    <path d="M296 322 L258 366 L296 366 Z" fill="#e0aa6e"/>
    <circle cx="322" cy="352" r="4" fill="#293241"/>
  </g>

  <path d="M0 356 h800 v26 H0 z" fill="#6f4e37"/>
  <path d="M0 356 h800" stroke="#54382a" stroke-width="4"/>
  ${[40, 190, 340, 490, 640].map((x) => `<rect x="${x}" y="382" width="10" height="34" fill="#54382a"/>`).join('')}
  <g stroke="#ffd166" stroke-width="2">
    <line x1="30" y1="330" x2="770" y2="330"/>
    ${[30, 155, 280, 405, 530, 655, 770].map((x) => `<line x1="${x}" y1="330" x2="${x}" y2="356"/><circle cx="${x}" cy="338" r="5" fill="#ffd166" stroke="none"/>`).join('')}
  </g>

  <g>
    <circle cx="615" cy="268" r="17" fill="${balloon}"/>
    <path d="M615 285 q-4 12 2 20" stroke="#f4f1de" stroke-width="2" fill="none"/>
    <rect x="607" y="330" width="16" height="26" rx="5" fill="#3b6ea5"/>
    <circle cx="615" cy="322" r="8" fill="#f2c29b"/>
    <line x1="617" y1="330" x2="617" y2="306" stroke="#f2c29b" stroke-width="3"/>
  </g>

  ${v('fish') ? '' : '<g><path d="M330 452 q26 -30 52 0 q-26 10 -52 0 z" fill="#98c1d9"/><circle cx="368" cy="446" r="3" fill="#1d3557"/><path d="M330 452 l-12 -8 q2 8 0 16 z" fill="#98c1d9"/><path d="M344 470 q12 8 24 0" stroke="#98c1d9" stroke-width="3" fill="none"/></g>'}

  ${v('cat') ? '' : '<g><ellipse cx="430" cy="350" rx="17" ry="9" fill="#293241"/><circle cx="445" cy="342" r="8" fill="#293241"/><path d="M438 336 l-3 -7 M450 336 l3 -7" stroke="#293241" stroke-width="3" stroke-linecap="round"/><path d="M414 348 q-12 -4 -10 -16" stroke="#293241" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="442" cy="341" r="1.8" fill="#ffd166"/><circle cx="448" cy="341" r="1.8" fill="#ffd166"/></g>'}

  <g>
    <rect x="22" y="328" width="44" height="28" rx="3" fill="#c0392b"/>
    <rect x="30" y="310" width="28" height="18" rx="3" fill="#e8875b"/>
    <rect x="38" y="296" width="13" height="14" fill="#98c1d9"/>
  </g>
  <g fill="#f4f1de" opacity="0.9">
    <rect x="96" y="512" width="60" height="10" rx="4"/>
    <rect x="108" y="500" width="36" height="10" rx="4"/>
  </g>
</svg>`;
}
