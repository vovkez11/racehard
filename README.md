# 🏎️ RaceFun 2: Neon Rush

A mobile-friendly arcade dodge-racer that runs in any browser. No build step, no dependencies.

## Run it
Open `index.html` (or host the folder anywhere, e.g. GitHub Pages).

## Files
- `index.html`: page structure and HUD
- `style.css`: mobile-first layout (fills the screen, safe areas, landscape mode)
- `script.js`: game logic, drawing and the live-generated synth music

## How to play
- **Drive:** drag a finger / mouse on the road (the car follows, just above your finger), or use arrows / WASD to go left, right, forward and back
- **Risk and reward:** the further up the road you drive, the higher your score multiplier (up to +40%), but the less time you have to react
- **Nitro:** hold the ⚡ button or Space. It smashes 🚧 cones but not rival cars. Run it empty and it overheats: release the button and wait for it to recharge to 20%
- **Close calls:** skim past traffic to build a combo and refill nitro
- Collect 🪙 coins and power-ups: 🛡️ shield, ⏳ slow-motion, 🧲 coin magnet
- Oil slicks make steering slippery. Pause with P / Esc

## World and music
Every 2000 m the biome changes (Neon City → Desert Sunset → Frozen Pass → Deep Space), each with its own colours, scenery and synth track. Music tempo is fixed per biome and never changes with speed. A calm loop plays on the menu and game-over screens. 🎵 (or M) toggles music, 🔊 toggles sound effects.
