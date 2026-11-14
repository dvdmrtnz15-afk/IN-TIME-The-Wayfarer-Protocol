# IN-TIME — The Wayfarer Protocol

**Playable foundation v0.1.0 · Original temporal puzzle vertical slice**

One city. One night. More than one you. Walk onto a pressure plate, leave an echo of your route, rewind to your checkpoint, and use your past selves to open the next gate. Three landmarks, two final decisions, three epilogues.

## Play now

Open `dist/IN_TIME_PLAY.html` in a browser that runs JavaScript. It is self-contained: no installation, network connection, API key, account, purchased asset or external font is required. A chat attachment preview or a mobile file preview may show source or a static preview instead of executing the game. Use a real browser or serve the included `dist` directory.

Desktop: WASD/arrows move relative to the camera; Shift runs; Q leaves an echo; E interacts; Space pulses anomalies; M opens the district map; Escape pauses. Clicking reachable ground walks there. The mouse wheel changes zoom. Touch: drag the joystick and use ECHO / INTERACT / PULSE. Use the in-game guide before your first route.

The six-minute timer counts simulation time. Dialogue, menus and focus loss pause it. A rewind does **not** replenish time. Completed landmarks and memories survive rewinds and checkpoint retries. Only two echoes can exist: a third replaces the oldest. Echoes repeat their actual recorded path and then remain at its endpoint. A pressure plate changes to mint when occupied.

## Preserve progress

Automatic saves use this browser's local storage when available. Browser privacy settings, a file-preview environment or storage denial can prevent it; the game displays a warning. Use **Pause → Export save** for a portable JSON backup. **Load a save** restores the complete recorded state, including echoes, timing and memories. No save is sent anywhere.

## Develop

Node 20 or later. Runtime and build have zero package dependencies.

```sh
npm test
npm run build
npm start
```

The local server prints its address; the default is port 8080 on loopback. To regenerate and serve together: `npm run dev`. The project is a static client game, not a React application or an API-backed service. Do not add a server dependency just to run it.

## Source map

| File | Responsibility |
|---|---|
| `src/core/rng.js` | Adapted recovered Trinity seeded RNG; validated uint32 state and shuffle |
| `src/core/world.js` | World layout, plates, gates, collision, A*, twelve modifiers and objectives |
| `src/core/simulation.js` | Fixed steps, echoes, anchors, authored interactions, endings, save validation |
| `src/view/math.js` | Orthographic camera projection and screen-to-ground conversion |
| `src/view/renderer.js` | Native WebGL rendering plus projected-3D Canvas compatibility renderer |
| `src/view/audio.js` | Optional quiet Web Audio tones; no recorded voice or fetched music |
| `src/main.js` | Keyboard, touch, navigation, UI, settings and local save adapter |
| `src/index.html`, `src/style.css` | Accessible DOM controls, title, menus and visual system |
| `scripts/build.mjs` | Bundles exactly these runtime files into a standalone HTML |
| `tests/` | Node regression and route tests; reproducible browser acceptance scripts |
| `reference/`, `PROVENANCE.md` | Recovered-source attribution and explicit reuse/rejection boundaries |

## What was verified

34 Node checks passed. They include complete input-driven routes through all three epilogues and twelve seeds, determinism, gate collision, echo limits, checkpoint preservation, save validation and camera math. Desktop browser acceptance passed 29 checks, including an accelerated normal-input route through all three puzzles, exported-save download/import, invalid import recovery, failure/retry and focus-loss pause. Mobile emulation passed 11 checks, including real touch events, echo creation and portrait/landscape controls. JavaScript errors and external requests observed during these browser checks: zero.

The browser harness supplies normal movement inputs in accelerated fixed steps for the complete route. It does not teleport the player, set quest facts, refill the clock or bypass gates. Separate keyboard and touch checks use ordinary browser events. This is automated verification, not a human playtest or a claim of universal bug-freedom.

## Important limits

This is a small, stylized procedural 3D puzzle, **not** a finished open-world RPG, a port of the entire CHIRAQ source, an MMO or an AI-driven NPC system. Character dialogue is authored. Tarot effects are seeded rules. Rewind is a game mechanic, not a physical model. Event/save checksums detect accidental corruption; they are not cryptographic security, hostile-tamper resistance or anti-cheat.

The test browser did not expose WebGL, so browser acceptance exercised the Canvas 3D compatibility path. The native WebGL path is implemented but not runtime-certified in this environment. The compatibility renderer uses depth-sorted polygons and may show painter-order artifacts; it trades visual precision for portability. Real GPU, Safari/iOS, Android-device performance, screen-reader conformance and human enjoyment remain unmeasured. No 60-fps performance claim is made.

Browser URL navigation and origin storage were unavailable in the test environment. Exact standalone bytes were rendered through Playwright `set_content`. Storage-denial handling and actual JSON export/import were tested; ordinary origin-based automatic-save persistence was not independently certified. Node save/reload equivalence was tested.

Nothing was uploaded to Google, published, merged or pushed. Existing Replit and GitHub projects were left unchanged. See `GOOGLE_HANDOFF.md` for the difference between Playground prompting and AI Studio's documented code-import route.
