# Lantern Harbour — Spot the Difference

[![Competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jontumpil/makefun-spot-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jontumpil/makefun-spot-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

An entry for the make.fun competition **best-spot-the-difference-game**:
a complete spot-the-difference game that runs in a desktop browser
from static files, with no network request.

## The game

Two panels show the same harbour at dusk — Lantern Harbour, drawn
in code as SVG — and the right-hand panel hides **ten differences**:
a gull gone from the sky, a lighthouse stripe repainted, a cafe
sign re-lettered, a cat slipped off the pier, and six more. Click a
difference on either picture to ring it on both; the counter of
what remains ticks down in the header, next to the running clock,
the miss counter and your three hints. A hint makes a lantern
flicker near one hidden difference. Sounds are synthesised with
WebAudio (a pop for a find, a buzz for a miss, a fanfare for the
win), so the game needs no files beyond its own code.

Mouse and keyboard both play: the arrow keys move a gold ring over
the right panel, Enter taps it, H asks for a hint, R restarts.

## Layout

- `game/` — the playable game: `index.html` plus ES modules under
  `game/src/` (`scene.js` draws both harbours and lists the ten
  differences, `main.js` runs the game, `audio.js` makes the sounds)
- `screenshots/` — three real renders of the game (welcome card,
  mid-game with four differences ringed and six to go, the win card),
  taken from its own `?shot=` frames
- `main.ts` — the hand-in program: copies `game/` and
  `screenshots/` to the output directory and writes `dossier.json`
  with the vendored library in `vendor/makefun-game.ts` (the kit's
  file, unchanged)
- `serve.ts` — a tiny local server for play-testing:
  `node serve.ts`, then open http://localhost:8080

## License

MIT
