# Source custody and synthesis decisions

This package is a new implementation grounded in recovered user game concepts and a narrow piece of actually recovered source. It is **not** represented as a source-level merge of four completed games.

## Adapted source

**Trinity LS IP - do not delete**, Replit; reported HEAD `02447f325dd6e6c5d7c8f420ed385368e42a49f1`.

The Replit read-only source response returned the full `src/alive-world-engine/rng.ts`. It is preserved as `reference/trinity-seeded-rng.ts`. The runtime adaptation in `src/core/rng.js` preserves its Mulberry32-style mixing, wraps the state to uint32 every step, validates public inputs and implements a copied-array Fisher–Yates shuffle. Tests check range, determinism, cloning, permutation and distinct-seed behavior. This is a standard non-cryptographic seeded generator, not a newly invented cryptographic algorithm.

The separate Tarot RNG excerpt returned by the source tool included `state ^= state >> 0`, which deterministically zeroes the state. The package includes a test reproducing that failure from the returned expression. That implementation was not adopted. This diagnosis concerns the returned excerpt; the complete original module was not independently mounted and executed.

## Inspected but not transplanted

**Chiraq City Saga**, Replit; reported HEAD `8bdc4ab625c0c49cdd84438288ebeed13157e77f`.

Read-only source inspection reported real walking, AABB collision, driving, missions, HUD and police code. It also identified driving/player synchronization, same-mission retry, saved mission phase and UI reset defects. Those upstream findings are attributed to source inspection, not an independent execution of that app.

The returned Physics.ts text was garbled, including lost comparison operators and missing spans. It was excluded. No claim is made that the upstream file actually has those syntax errors. The new game's collision implementation is newly written and tested.

The Medicine Run mission record and its small declarative interfaces were returned coherently. The mission interface is preserved as `reference/chiraq-mission-schema.ts` to show the source pattern considered. The temporal game does not contain CHIRAQ's driving, combat, map, fictional gang, medical-delivery dialogue or mission runtime. It uses a newly written temporal state machine with explicit transition guards.

**Little Learning Garden — Play Quest 5.0**: a Library HTML shell was read. It depended on separate CSS/JavaScript files and was not a suitable core for this temporal game. None of its child or family data/content is embedded in the new runtime.

**GitHub inspection**: authenticated repositories were enumerated; `scroll-world` was a skill/document repository rather than the sought game engine. No unrelated repository was copied. This was a targeted recovery, not a complete line-by-line audit of all historic branches and private files.

## Concept inheritance versus code inheritance

| Source concept | Adapted design idea | Status here |
|---|---|---|
| IN-TIME | Rewind, replaying selves, retained memory, irreversible final choice | New runtime and playable puzzles |
| THE WAYFARER | Year 2100 atmosphere, player agency, Tarot-modulated world | New art direction, twelve seeded mechanical modifiers |
| Ready Player You | Persistent consequences and scoped power | New pulse/echo mechanics and permanent landmark facts |
| TRINITY LS | Deterministic simulation and inspectable history | New fixed-step engine and corruption-checking ledger; recovered RNG adapted |

The working title **IN-TIME: The Wayfarer Protocol** and all specific new map coordinates, puzzle content, dialogue, art, epilogues and implementation choices are synthesis decisions from this delivery. They do not retroactively amend every earlier game's canon.

## Rights and dependencies

No npm runtime dependencies, external models, fetched textures, downloaded audio or bundled font files are included. Meshes and audio are procedural. No open-source license has been assigned to the user's entire project on their behalf. Existing source/contributor rights and title clearance should be reconciled before commercial publication. Standard algorithm reuse and source possession do not establish patent novelty or commercial exclusivity.

## Scope of external actions

Original apps were only queried. No upstream edits, builds, migrations, deployment, repository push, publication or Google account action occurred. Source custody is limited to the returned excerpts and the new locally written files, with package SHA-256 hashes for the delivered bytes.
