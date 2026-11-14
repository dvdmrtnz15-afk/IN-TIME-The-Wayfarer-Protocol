# IN-TIME: The Wayfarer Protocol — playable foundation

## Intended outcome
A genuinely playable, self-contained browser game and readable source handoff for continued development in Google's tools. The user approved continuing the proposed synthesis of IN-TIME, THE WAYFARER, persistent consequence and deterministic state. This is a new vertical slice, not a claim that the earlier games were complete.

## Slice contract
One rain-soaked sacred-futurist city district; three linked temporal puzzles; two explicit final decisions. The player walks through a 3D world, records movement, rewinds and leaves up to two replaying echoes. Echoes hold pressure plates while the present player passes gates. Each restored landmark is an irreversible checkpoint. A six-minute simulated-time clock creates pressure; dialogue, pause, hidden tabs and menus do not consume it. Failure offers a checkpoint retry without clearing permanent progress. No combat, accounts, API keys, telemetry, paid assets or backend.

## Systems
60 Hz fixed-step, renderer-independent JavaScript simulation. Declarative world, world-space collision, bounded A* navigation, deterministic seeded deck with twelve temporary modifiers, deterministic patrol hazards, anchored facts, canonical event checksums, exact local saves with validation and safe failure, keyboard/touch input, Web Audio synthesis and an optional reduced-effects setting. A lightweight native WebGL renderer draws a procedural 3D environment. All runtime code bundled into one HTML file, including the renderer; source remains modular. Checksums detect accidental edits, NOT hostile tampering or anti-cheat.

## Content
Relay: one echo and one gate. Archive: two echoes and two plates. Convergence: two plates, a final terminal and a choice to restore the city or carry its signal away. Three optional memory fragments change the restored-city epilogue. Character dialogue and clues react to completed anchors and rewinds. Maps and explicit in-game assistance avoid opaque puzzle logic.

## Source custody
Adapt the actually recovered Trinity SeededRng implementation. Preserve commit attribution. Do not integrate its separate defective Tarot PRNG or garbled collision extraction. Preserve CHIRAQ mission schema as a source reference; write the new temporal mission engine independently. Never imply that a Replit code-audit response is a runtime test.

## Acceptance
Fresh game → move → echo → plate → gate → interact → checkpoint; three-puzzle completion with each final decision; anchored fact survives rewind; no duplicate fragment rewards; deterministic equal-seed action streams; different-seed deck variation; safe corrupt-save rejection; reload including echoes; restart and checkpoint retry; keyboard and touch browser checks; no remote requests after loading the single-file release. A projected-3D Canvas compatibility renderer must keep the game playable when WebGL is unavailable; if neither rendering API exists, show an explicit message rather than an empty canvas. Mobile layout checked, not blanket hardware performance certified.
