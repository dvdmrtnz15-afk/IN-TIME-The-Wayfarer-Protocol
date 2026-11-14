# CODEX GOAL — IN-TIME: The Wayfarer Protocol v0.2

## Mission and finish line

Continue the supplied IN-TIME game **in its existing codebase**. Deliver a more legible, visually coherent, reliably playable **v0.2.0 local playtest candidate**, with fresh execution evidence. This is an implementation assignment, not a request for a proposal, a replacement prototype, a trailer, or a concept page.

The differentiator is playable cooperation with recorded past selves: walk a route, rewind, leave an echo that repeats that actual route, and use its physical presence to solve the next puzzle. Improve how clearly and convincingly the player experiences that mechanic. Preserve the three-puzzle slice before considering expansion.

Work through investigation, regression tests, focused implementation, browser play, review, repair, and packaging. Do not stop at a plan or the first failed check. Mark the Goal complete only when the mandatory acceptance conditions below are evidenced. A missing execution environment is a blocker, not permission to call an untested path verified.

## Scope and authority

Routine project-local inspection, edits, tests, local preview servers, documentation, and coherent local commits on an isolated task branch are within this assignment. Preserve unrelated changes, existing repository instructions, source attribution, and the v0.1 baseline. Read applicable AGENTS.md and installed project skills. Use their required approval gates; this brief does not override higher-priority instructions or tool permissions.

Do not push, merge, create a remote repository or PR, publish, deploy, modify upstream Replit apps, or change production resources without separate authorization. Do not change global Codex settings, bypass sandbox restrictions, expose secrets, install unapproved system software, or spend on assets, models, hosting, or external services. Development-only dependency downloads require the workspace's normal permission flow. Runtime must remain independent of external services.

Default to native inline execution. Use an available independent reviewer for the finished diff; use parallel workers only for genuinely independent, file-disjoint tasks. Do not invent a reviewer or describe a self-review as independent review. Respect the configured Goal budget, pauses, and user interruptions. There is no authorization for an unlimited loop or an external recurring job.

## Intake and source of truth

Open the `intime-wayfarer/` directory from the supplied bundle. This is a static JavaScript game, **not a React app**. Do not rewrite it into React, Three.js, Unity, a new backend, or TypeScript merely to match a template. Small modular extractions are acceptable when a demonstrated defect or test boundary justifies them.

Read these before editing:

- `README.md`, `PROVENANCE.md`, `VERIFICATION.md`.
- `docs/DESIGN.md`, `docs/IMPLEMENTATION_PLAN.md`.
- `package.json`, `scripts/build.mjs`, `scripts/serve.mjs`.
- All seven runtime modules, the DOM/CSS, and relevant tests.

Use actual workspace contents as authority for current implementation. Use this brief as the requested increment. The original Google handoff remains context, not an instruction to recreate the game in Playground. If the workspace already contains newer work, compare it and continue forward; do not overwrite it with the ZIP.

If only the archive is present, inspect its entries and extract into an isolated directory without overwriting existing files. Reject unsafe archive paths or symlinks escaping the destination. If neither source nor archive is accessible, report the exact missing input; do not fabricate a source recovery. ChatGPT sandbox paths and attachments do not automatically exist inside a Codex workspace.

Original archive identity:

```text
IN_TIME_Playable_Foundation_v0_1.zip
SHA-256: 3c11cda620e68585370cde795d24b5e0a157279b2d42a33638dad8eaeb058b2d
```

Original standalone release identity:

```text
dist/index.html and dist/IN_TIME_PLAY.html
SHA-256: 9b257411f6b5f0212634f65c1c1297d7dbccd0bf26498a2f3a5a42485eac1779
```

Those hashes identify the unchanged v0.1 source package/release, not the future v0.2 output. Preserve the original manifest; generate a separately versioned manifest for the new release.

## Establish a fresh baseline

Inspect Git status, branch, current HEAD, and uncommitted work first. Use an isolated task branch/worktree where applicable. Never reset, clean, stash, or delete someone else's work to make the baseline easier.

The package specifies Node >=20 and has no runtime or build package dependencies. From its root:

```sh
node --version
npm test
npm run build
npm start
```

The preview defaults to loopback port 8080 and supports `PORT`. Read the server before changing binding. Do not expose it publicly to solve a local browser problem. Adapt to a managed preview host only inside the environment's supported permission boundary.

The handoff preparation freshly reran **34/34 Node tests** and the build; generated HTML matched the original release byte-for-byte. See `handoff-evidence/BASELINE_RECEIPT.json`. Codex must rerun them in its own environment.

Earlier browser results—29 desktop and 11 touch/mobile checks—are **historical**, not new hardware evidence. They used exact HTML injected through Playwright `set_content`, the Canvas compatibility renderer, and some accelerated normal-input routes. WebGL runtime, ordinary origin-based automatic saves, and real-device performance were not verified. Do not repeat those results as a current run.

## Existing implementation map

| Existing file | Responsibility and intended work |
|---|---|
| `src/core/rng.js` | Recovered/adapted seeded RNG. Preserve mixing, validated uint32 state, deterministic cloning/shuffling and attribution. |
| `src/core/world.js` | Layout, plate/gate definitions, collision, A*, objectives and twelve modifiers. Keep visual geometry, navigation and collision consistent. |
| `src/core/simulation.js` | 60 Hz state updates, recorded echoes, anchors, interactions, endings, save validation. Existing APIs include `IT.createGame`, `IT.rewind`, `IT.retry`, `IT.interact`, `IT.choose`, `IT.saveGame`, `IT.loadGame`. Verify signatures before changes. |
| `src/view/math.js` | Camera projection and ground picking. Test any camera or viewport changes. |
| `src/view/renderer.js` | Native WebGL and Canvas 3D compatibility rendering. Validate initialization, context lifecycle, occlusion, feedback and render budgets. |
| `src/view/audio.js` | Optional procedural Web Audio. Preserve user-gesture activation and mute. |
| `src/main.js` | Input, menus, dialogue, settings, local storage, rendering loop. Strengthen persistence/recovery and input/visibility handling. |
| `src/index.html`, `src/style.css` | Existing title, HUD, guide, settings and touch layout. Improve the game interface, not a new marketing shell. |
| `tests/browser_acceptance.py` | Current injected-page harness; contains an environment-specific Chromium path and launch flags. Parameterize rather than hard-code another machine. |
| `tests/browser_route.js`, `tests/playthrough.test.js` | Existing normal-input route helpers/regressions. Preserve them; add true browser-origin and unaccelerated input evidence. |

Never edit only the generated `dist` HTML. Change modular sources and rebuild both standalone outputs from them.

## Gameplay invariants: do not dilute the mechanic

1. Fixed-step simulation remains independent of rendering and frame rate. Rendering, particles and sound cannot consume or alter simulation RNG state.
2. Echoes replay recorded movement, restart together on rewind, and hold their recorded endpoints. At most two exist; a third replaces the oldest. No decorative clone, teleport, prerecorded fake route, or automatic plate activation.
3. Occupancy actually controls locked gates. Preserve already-anchored gates' unlocked behavior. Closed gates block movement and navigation. Final choices remain unavailable before the required progress.
4. The sequence remains Relay -> Archive -> Last Light/Convergence. Preserve three epilogues: `light`, `home`, `signal`; three optional memories are collectible once each.
5. The six-minute simulation clock does not refill on rewind. Dialogue, map, pause and focus loss do not consume it. Checkpoint retry is a distinct transition: preserve and test its existing reset rules, including timer/stability behavior. Do not silently turn retry into rewind or vice versa.
6. Permanent landmark facts and memories survive rewind/retry; a genuinely new timeline resets the run. No duplicate rewards or stale UI/echo state after retry, import or a new game.
7. Preserve keyboard, click-to-walk and touch controls. Pointer cancellation, window blur and modal entry must not leave movement or actions stuck.
8. Save/import restores complete state, including echoes and time. Malformed, oversized, unknown-version or inconsistent input fails without overwriting the current run. A checksum is corruption detection, not authentication or anti-cheat.
9. The release remains offline-capable and self-contained: no account, backend, analytics, remote font, runtime CDN, live LLM or paid service. Authored dialogue and seeded rules must not be marketed as autonomous intelligence.

## Ordered implementation work

### A. Make the verification environment portable and truthful

First preserve baseline behavior and evidence. Parameterize the browser executable, optional launch arguments, base URL, rendering mode and evidence directory. Keep the injected-page compatibility test where useful, but add a **real HTTP-origin** acceptance path through the included local server.

Add tests that fail when the renderer is silently substituted, storage is unavailable when expected, the wrong build is served, or an unexpected external request occurs. Assertions must distinguish initial loopback navigation from outbound network traffic; loading localhost is not an offline violation. Capture browser/version, viewport, graphics renderer, release SHA-256 and test mode in every report.

Implement a diagnostic rendering selection sufficient to test WebGL and force the real Canvas fallback. Do not mock graphics calls to manufacture a pass. Keep test acceleration/diagnostic controls opt-in and inactive in an ordinary production run. Read-only diagnostics are preferable; never use a state-mutation hook as proof of playability.

### B. Close graphics and persistence gaps before decorative expansion

Exercise the real WebGL API: compile/link, first frame, player/echo/gate visibility, picking, resize, high-DPI handling, context loss and recovery. Distinguish physical GPU execution from SwiftShader/software WebGL; neither is the Canvas path, but software WebGL does not certify hardware performance.

The baseline has a context-loss notification/overlay. Reproduce its behavior before changing it. Add a failing lifecycle regression, then implement safe pause, retained state, successful resource reinitialization on context restoration, or a truthful recoverable fallback. Avoid losing a run, duplicate render loops, silent clock advance or an overlay claiming a save succeeded when storage was denied. Preserve a way to export state during recovery where rendering is unavailable.

Through an ordinary localhost origin, start a real run, create echoes, anchor a checkpoint, save, reload the page and continue. Verify equivalent state before resumed time advances. Test corrupt stored data, write/quota denial, interrupted input, completed runs and same-session new game. Keep portable JSON export/import functional when automatic storage is denied. Preserve schema compatibility; any save-schema change needs an explicit version and tested migration or clear rejection. Application version and save-schema version are different.

### C. Make the existing slice look and feel deliberate

Stay with the rain-soaked year-2100 district: weathered stone, dark teal, copper, warm lanterns, readable isometric geometry and distinct silhouettes. Do not replace playable geometry with a background image or a video.

Implement a focused visual/interaction pass:

- Differentiate the player from both echoes by silhouette/marking as well as color. Show recording, replaying and endpoint-holding states distinctly.
- Make each plate's occupancy and its gate connection legible. Show two-plate readiness without relying only on mint versus gold. Use animation and optional sound to confirm actual state changes.
- Improve player locomotion/idle animation, checkpoint/final interaction feedback, and camera visibility through foreground obstruction. Cosmetic fading must not change collision.
- Add compact first-use guidance triggered by actual actions: reach a plate, record an echo, wait for arrival, cross the opened gate. Hints cannot complete the puzzle, grant time or take control from the player.
- Ensure reduced-effects and reduced-motion settings affect the expensive or distracting effects they name. Preserve optional audio, clear pause behavior, keyboard focus, readable text and touch layouts at 390x844 and 844x390.

Capture before/after screenshots at the same camera, viewport and game state, plus an actual uninterrupted gameplay clip where supported. Report observable improvements, not a claim that the game is fun or AAA-quality. Real enjoyment and first-time comprehension require human playtests.

### D. Prove, review and package the candidate

Retain every valid baseline regression. Add tests at the owning source boundary for each repair. Run the complete suite after each coherent batch and before release. Do not delete assertions, widen tolerances or bypass collision to force green.

Mandatory acceptance matrix:

| ID | Required evidence |
|---|---|
| G01 | Fresh full Node suite and standalone build pass; all 34 original valid checks remain covered. |
| G02 | Same seed/input stream reproduces gameplay state; render frame pacing/effects do not alter it. |
| G03 | Real recorded routes, endpoint holds, synchronized replay, two-echo limit and third-echo replacement pass; an unoccupied locked plate/gate cannot be bypassed. |
| G04 | All three puzzles and epilogues remain reachable via input-driven regressions. At least one full fresh-to-ending browser run uses ordinary keyboard/pointer controls, default real-time pacing, no accelerated stepping, no teleports or quest writes. |
| G05 | A complete Relay puzzle is solved through actual touch events; cancellation, multi-touch/action interaction and portrait/landscape behavior pass. Emulation is labeled as emulation. |
| G06 | Native WebGL and forced genuine Canvas fallback both render and support playable interaction. WebGL context loss/restoration or a documented safe fallback preserves the run. A native-WebGL failure cannot be hidden by automatic fallback. |
| G07 | Real-origin save -> page reload -> continue preserves a mid-run checkpoint, echoes, memories and timer. Storage denial and invalid imports preserve the current run; portable export/import passes. |
| G08 | Dialogue/map/menus/hidden-tab pause, failure/retry, returning to title and new timeline behave without stuck input, stale progress or duplicate reward. |
| G09 | No uncaught runtime errors, shader failures or unexplained external requests in the tested scenarios. Offline play after loading succeeds. |
| G10 | Same-scenario frame-time evidence before/after, with browser, device, renderer, viewport and effects settings; no uninvestigated sustained performance regression. |
| G11 | Visual feedback changes documented with actual rendered evidence; motion/audio settings and keyboard/touch UI remain functional. |
| G12 | Clean final diff review, accurate provenance/verification notes, reproducible v0.2 source/release artifacts and SHA-256 manifest. |

For G10, sample an active 60-second representative scenario after a 10-second warmup and report p50/p95 frame intervals and stalls over 100 ms. Compare equivalent renderers/settings. Investigate a >10% repeatable p95 slowdown rather than averaging it away. Aim for 60 fps desktop and 30 fps mobile on explicitly identified hardware; these are engineering targets, not universal promises. A software-renderer benchmark is not a real-device performance result.

A real-GPU desktop check and Safari/iOS/Android device checks are separate hardware acceptance rows. Execute available authorized devices. If unavailable, mark those rows NOT_RUN with the required device/browser and exact reproduction steps. Do not declare hardware acceptance, human playtesting or accessibility conformance complete from emulation alone.

## Continuous execution and learning from failures

Maintain `docs/codex/STATE.md`, `docs/codex/ACCEPTANCE.md`, and `docs/codex/DECISIONS.md`, or reuse equivalent existing records instead of duplicating them. Keep historical evidence intact; put current logs under a new run directory.

At every batch: inspect -> reproduce -> write failing regression -> implement the smallest coherent repair -> targeted checks -> full checks -> browser evidence -> review diff -> record result -> next unfinished gate. At a resume, read durable state and verify actual HEAD/worktree before repeating any task.

For a failed approach, record the symptom, reproduction, root-cause hypothesis, evidence, repair, regression and remaining risk. After three unsuccessful attempts at one hypothesis, reassess the cause or choose a different method; do not loop the same command. A blocked GPU, download or device lane does not stop independent source, test, UI or documentation work. Stop only when remaining work actually requires missing authority/input, the budget is exhausted, the user pauses, or the mandatory goal is satisfied.

Do not add a fourth puzzle, giant open world, driving, combat, multiplayer, monetization, dozens of NPCs, telemetry or live-model dialogue in this increment. Put such ideas in a short deferred list. Do not turn local error learning into an unsupervised self-modifying agent platform.

## Required delivery and status

Produce regenerated `dist/index.html` and `dist/IN_TIME_PLAY.html`, the complete modular source, regression/browser scripts, a v0.2 source ZIP, versioned manifest, updated run instructions, a verification report and a concise change/rollback record. Preserve source rights and rejected-source notes. Update the Google continuation instructions only to reflect the actual new artifact; do not claim import or publication.

Bind the report to the tested code revision/tree and output hashes. Record commands, exit codes, named pass/fail/not-run checks and evidence paths. When a final documentation-only commit follows tested code, state that distinction instead of implying a different code tree was tested.

Use a final status that matches evidence:

- `READY_FOR_PLAYTEST`: all mandatory G01-G12 gates pass. State exactly which renderer/browser/device configurations were exercised. This is local candidate readiness, not production certification.
- `IMPLEMENTED — VALIDATION BLOCKED`: code work is present but a mandatory test environment or acceptance gate remains unverified. Identify the precise gate and smallest missing action; do not mark the Goal complete.
- `IN_PROGRESS / BUDGET_LIMITED`: checkpoint the unfinished work and exact next command. Do not call a budget stop completion.

Independently report `HARDWARE_ACCEPTANCE: PASSED / PARTIAL / NOT_RUN` and `HUMAN_PLAYTEST: NOT_RUN` unless those activities actually occurred. Finish with artifact paths, modified files, actual test results, remaining risks, rollback instructions, and an explicit statement of remote actions taken or not taken.

Begin by inspecting the supplied source and running the unmodified baseline. Then implement this increment.
