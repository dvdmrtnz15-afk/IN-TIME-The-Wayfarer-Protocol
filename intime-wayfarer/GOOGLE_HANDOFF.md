# Google handoff — preserve the working game

## First distinguish the products

Google Playground's help centre documents prompt-based game creation, conversational edits, reference images, and exporting a generated game's HTML/JavaScript/CSS/assets as a ZIP. It does **not document an existing-code or ZIP import** in the reviewed instructions. This is not proof that every account lacks such an option. Do not assume this source package can be uploaded and executed unchanged in Playground.

Google AI Studio's Build documentation explicitly describes **Add files (+) → Import from GitHub** for existing code. That is the documented code-preserving import route once this package is placed in a repository. No repository was created or pushed in this delivery. A text handoff can supply context, but it is not equivalent to a verified source import.

Official sources checked during preparation:
- https://playground.google/helpcenter — Game Creation & Vibe Coding; source export.
- https://ai.google.dev/gemini-api/docs/aistudio-build-mode — Get started; Import a project from GitHub.

These product capabilities can change. Confirm the controls visible in your account rather than fabricating an import success.

## For Google Playground

Start with the bounded `PLAYGROUND_PROMPT.txt`. It describes the tested loop and essential acceptance checks. A screenshot from `evidence/two-echo-puzzle.png` can be used as a reference image where supported. Playground transforms reference photos; do not assume it embeds your original image or reproduces the exact existing engine.

Keep the original playable HTML as the comparison baseline. First generate one complete Relay puzzle. Then extend to two echoes and the Archive. Finally add the final tower and endings. Inspect an exported build after each increment. Do not keep expanding a version that cannot complete its current puzzle. The complete source is also supplied as a single text handoff for a tool that can consume it.

## For Google AI Studio or another code-capable builder

Import the repository containing this exact source through the documented GitHub flow, or supply the consolidated source to a code-capable workspace with a supported ingestion mechanism. Start by running the unmodified version. Its `dist/index.html` is a static client release. Its build needs Node only; no dependency installation is necessary. A managed preview server may require binding to its assigned host and port. Adjust server binding explicitly if needed; do not rewrite the game to solve a hosting configuration issue.

Paste this implementation directive:

> Continue the supplied IN-TIME — The Wayfarer Protocol codebase. This is a working temporal-puzzle foundation, not a request for a concept page. Read README.md, PROVENANCE.md and VERIFICATION.md first. Preserve the renderer-independent fixed-step core, seeded RNG, recorded echo playback, pressure-plate gate guards, irreversible checkpoint facts, complete save validation and working endings. Run the existing tests and launch the current build before making changes. Do not claim an import or test that did not run.
>
> Improve one vertical slice at a time. First verify the native WebGL path on actual hardware and ordinary origin-based local saves. Then improve character animation, lighting, camera occlusion, ambience and interaction legibility without changing puzzle semantics. Keep keyboard and touch parity. Any map geometry change must include matching collision and a complete route test. Any save-format change requires a version bump, migration or an explicit old-save rejection.
>
> Keep the game playable throughout. No mock buttons, no static gameplay image, no autoplay video posing as a game, no quest bypass, no fake AI dialogue, no accounts, payments, multiplayer or backend in this increment. No secrets in client code. Do not replace the entire project with an unrelated template.
>
> Acceptance: a new player can reach every ending; echoes replay real recorded routes; a third echo replaces the oldest; the city clock does not rewind; checkpoints survive retries; two matching input streams with one seed reproduce state; corrupt saves fail safely; touch works; no new runtime errors or unexplained network calls. Report actual executed tests, the modified files, and remaining limits.

## Ordered upgrade backlog

1. Hardware acceptance: WebGL on Chrome/Safari/Android, true browser-origin save/reload, frame timings and WebGL context recovery. Preserve the tested Canvas compatibility route.
2. Presentation: authored character rigs/animation, stronger environmental landmarks, consistent occlusion, richer weather and original audio. Keep measurable render budgets and reduced-effects mode.
3. Game depth: add a genuinely different fourth temporal interaction only after a playable specification and tests. Avoid simply adding more pressure plates.
4. Human playtests: watch first-time players without coaching; measure whether they understand echo endpoints, see active plates, and can recover from mistakes. Change onboarding based on observation, not claims of guaranteed retention.

Do not begin by adding a giant open world, monetization, dozens of NPCs or live LLM calls. The next asset is a better verified game loop, not a longer feature list.
