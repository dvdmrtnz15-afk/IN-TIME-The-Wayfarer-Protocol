# Verification record — v0.1.0

## Results

| Layer | Result | What it establishes |
|---|---|---|
| Node suite | 34 / 34 passed | Seeded RNG, camera projection, fixed-step state, gate collision, A*, real echo routes, complete outcomes, save validation, checkpoint/failure recovery |
| Desktop Chromium acceptance | 29 / 29 passed | Live UI, real keyboard input, three-puzzle route via accelerated normal input, map/dialogue pause, JSON download/import, invalid import recovery, failure/retry, focus-loss pause |
| Touch/mobile emulation | 11 / 11 passed | Real touch-event joystick movement, echo action, map, portrait overflow check, portrait/landscape controls |
| Browser JS errors | 0 observed | No uncaught JavaScript errors during those finite runs |
| External requests | 0 observed | No outbound requests during the injected standalone-page runs |
| Standalone build | Passed | Seven runtime files plus HTML/CSS bundled without external dependencies |

The all-seed route test covers seeds 1 through 12. Other route tests exercise all three epilogues: light, home, signal. These finite samples are not a proof for every future extension or seed.

## Browser conditions

System Chromium in a headless environment; 1440×900 desktop, 390×844 portrait and 844×390 landscape emulation. WebGL was unavailable. The actual implemented **Canvas 3D compatibility renderer** was exercised, not a mocked WebGL API. Screenshots are captures of the running game. Native WebGL runtime and performance remain unverified here.

Browser URL navigation was restricted. The harness used Playwright `set_content` with the exact standalone release text, without modifying its source. A test flag enables bounded fixed-step input acceleration. `tests/browser_route.js` calls normal movement, echo and interaction functions; it does not write coordinates or quest flags. Keyboard movement and touch controls have separate ordinary-event checks.

The resulting preview origin did not offer localStorage. The truthful storage-denial message was checked. A genuine browser download was produced, loaded again through the file-input UI, and checked for restored ending state. Invalid import retained the current game. This does not certify persistence across ordinary browser-origin reloads. Node tests verify complete save/reload state equivalence.

## Evidence and reproduction

- `evidence/core-tests.txt`: current full Node TAP output.
- `evidence/browser-desktop.json`, `evidence/browser-mobile.json`: named checks and observed results.
- `evidence/two-echo-puzzle.png`, `evidence/ending-desktop.png`, `evidence/game-mobile.png`: actual runtime captures.
- `tests/browser_acceptance.py`: uses Python Playwright and an installed Chromium executable. These are development tools, not game dependencies.
- `tests/playthrough.test.js`: input-driven route construction; no direct quest completion.
- Red-test logs preserve initial missing-feature checks and the invalid memory-identifier regression before repair.

Re-run `npm test` and `npm run build`. To reproduce the browser acceptance in a suitable environment: install development-only Python Playwright, set the script's Chromium path if necessary, then run `python tests/browser_acceptance.py desktop` and `python tests/browser_acceptance.py mobile`.

## Review findings

The source selection rejected a degenerate returned Tarot RNG excerpt and an incomplete collision extraction. The new core was tested independently. A final adversarial-save check exposed memory IDs resolving inherited object properties; the validator now requires an exact own-property identifier and the regression passes.

The CPU compatibility renderer initially allowed a large ground triangle to overpaint foreground meshes because centroid depth sorting alone cannot order intersecting large surfaces. Ground surfaces now render in a separate ordered pass. The compatibility path remains a painter-based approximation rather than a depth-buffer renderer; subtle polygon-order artifacts remain possible. Native WebGL has a depth buffer but was not executed here.

No independent human code review, real-device lab, accessibility conformance audit or human playtest was performed. No Google import or publishing action was executed. Do not describe this artifact as AAA-ready, production-certified, human-tested or deployed.
