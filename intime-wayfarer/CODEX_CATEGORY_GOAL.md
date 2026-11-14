# CODEX GOAL — IN-TIME Causal Strategy RPG
## Target: v0.3 category-proof candidate, after preserving the v0.2 quality lane

### Mission

Implement the bounded **Living District** proof from `CATEGORY_BLUEPRINT.md` in the supplied existing IN-TIME codebase. Deliver one genuinely playable integration of exact temporal echoes, one adaptive companion, one player-demonstrated reusable tactic, constrained district power, and consequences determined by physical world state.

The differentiator is **player-authored tactics as RPG progression**. The player must personally learn a useful method, make a constrained reusable tactic from it, delegate it to Rowan, coordinate it with immutable echoes, and see the district change because of the resulting actions.

This assignment is for implementation when the user invokes it in Codex. Merely receiving this document is not evidence that a Goal is active or that v0.2/v0.3 exists. The supplied runtime is still v0.1 unless actual workspace history establishes newer code.

### Authority and scope resolution

Read the workspace's applicable AGENTS.md, project skills, Git status, and current implementation before changing anything. Honor higher-priority instructions, tool permissions, budget, pauses, and approval requirements. Preserve unrelated work and continue newer source rather than overwriting it with this archive.

`CODEX_GOAL.md` is the preserved v0.2 stabilization brief. Retain its G01–G12 verification, offline runtime, attribution, no-remote-action rules, and classic gameplay invariants. This new brief extends product scope **only** for a separate Living District scenario, one companion, bounded tactic authoring, and the district/forecast systems below. Its explicit new-scenario rules override the older no-new-scenario restriction for this task only. They do not authorize a giant open world, a combat engine, cloud-model integration, driving, multiplayer, monetization, or additional characters.

Work locally on an isolated task branch/worktree. Do not push, merge, publish, deploy, create a remote repository, modify Replit upstreams, spend money, expose secrets, change global configuration, or bypass sandbox controls. Dependency/tool downloads follow the environment's normal permission flow. Do not add runtime network requirements.

Default to inline implementation with focused local commits. Use genuine independent review when available; label self-review honestly when unavailable. Do not fabricate delegation. Keep resumable progress and stop at actual authority/input blockers, configured budget, user pause, or an evidenced finish—not merely after writing a plan.

### Intake

Read `CATEGORY_BLUEPRINT.md`, `README.md`, `PROVENANCE.md`, `VERIFICATION.md`, `CODEX_GOAL.md`, `docs/DESIGN.md`, `package.json`, the build/serve scripts, and the affected runtime and tests.

This is plain JavaScript using `globalThis.IT`, native WebGL/Canvas, and a dependency-free standalone HTML build. Do not rewrite the app into React, TypeScript, Three.js, Unity, or a backend to suit a template. New small modules may follow the existing conventions. Rebuild `dist` from source; never edit only generated HTML.

Run the unmodified baseline:

```sh
node --version
npm test
npm run build
npm start
```

Record the current tree/revision, commands, exit codes, renderer, browser, and source/release hashes. Historical 34 engine, 29 desktop, and 11 mobile counts are inherited evidence until freshly rerun. Browser-origin saves and native WebGL were not certified in the original run. Keep these limitations explicit.

If source is unavailable, report that exact blocker. Do not reconstruct a different game from the brief and label it the supplied project.

## Ordered implementation gates

### 0. Protect and stabilize the classic game

Retain and exercise the prior G01–G12 quality lane. Preserve Relay → Archive → Last Light, the six-minute clock, all three original endings, two exact echoes with oldest replacement, physical plate occupancy, valid saves, retry, keyboard/pointer/touch, offline operation, and deterministic fixed-step rules.

New scenario work must not quietly change the classic run. Pure-logic development can proceed when a graphics environment is unavailable, but unavailable mandatory verification remains blocked, not passed.

### 1. Introduce a tested scenario boundary

Add an explicit scenario identity and declarative configuration with `classic` as the backward-compatible default and `living-district` as the new scenario. Verify actual APIs before choosing minimal signatures. Preserve `IT.createGame(seed)` behavior. Introduce a world/config lookup only where the existing global world would otherwise leak rules across scenarios.

The new scenario has a twelve-minute simulated-time deadline, three focus commitments, at most two immutable echoes, one live companion, three prepared tactics, three power units, and one unique portable archive core. Pause freezes all actors and economy together. The existing title can present Classic/tutorial and Living District; this is not a new marketing site.

Version the save schema separately from the application version. Add a migration fixture for the actual old schema or a clearly explained safe incompatibility result. Never accept a partial load that invents missing actor, cargo, or reservation state.

### 2. Build observed-state, live-actor, and command foundations

Implement one Rowan companion with physical movement, pathfinding, interaction range, one-object carry capacity, visible status, interrupt, and explicit safe fallback. Use normal world collision and permitted interactions. An agent may not write a gate-open flag, teleport, manufacture cargo, grant progress, or perform a player-only anchor/retry/rewind.

Give the planner an actor-specific observed snapshot rather than unrestricted internal state. Stable bounded planning runs no faster than 5 Hz with at most 256 action-plan expansions per update; navigation has its own explicit finite search limit. Use deterministic order and scheduling. Explain any justified change to those budgets with an adversarial regression and measured cost.

First prove a known-route transport, route-blocked fallback, permitted alternative route, and cancellation. A declared success requires an actual corresponding world event.

### 3. Implement demonstration-to-tactic authoring

Record semantic action events independently of the immutable movement-echo tape. Expose a compact selection and review flow: select a demonstrated segment, bind the intended goal, choose which targets may vary, review constraints/fallback, save to one of three repertoire slots.

The primitive allowlist is move, wait, interact, carry, deliver, pulse. Each primitive has actor permission, preconditions, resource checks, range/collision rules, completion, abort, and a visible reason for refusal. `pulse` requires the actor's real capability; it is not implicitly available to Rowan. `interact` accepts only named allowed reversible affordances.

Maximum 12 nodes per tactic graph; finite deadline; one bounded retry per node; no arbitrary script evaluation, generated JavaScript, unbounded loops, reflective property access, or unauthorized world writes. Validate identifiers, graph structure, sizes, numeric ranges, resource use, unknown operations, and role permissions. Render player-authored labels safely as text.

Demonstration extraction is not neural training. The UI must distinguish recording, draft, tested contexts, and unsupported conditions. Store source demonstration and version. Teach one useful Relay Runner tactic and prove its reuse with a different permitted destination and one changed known route. Failing safely with a precise unmet condition is preferable to fabricating success.

### 4. Implement the strategic dependency network

District supply is three power units. Full shelter operation requires two; archive transmission requires two; transit requires one. Allocate and reserve power without negative supply, double spending, or duplication. A relay change physically affects facility operation and available actions.

One archive core exists. It may be at a known world location, carried by exactly one actor, or delivered/transmitted according to an explicit state machine. A movement echo cannot carry a second copy. Plan reservations and interrupted handoffs preserve uniqueness.

Opening a presence-sensitive gate still requires actual occupancy. New plates declare their eligible actor types; classic plates retain existing behavior. A companion waiting on an echo-dependent gate waits on observed physical state, not a forecast or a plan's claim.

Outcome predicates are namespaced to the Living District:

- `refuge`: evacuation achieved and refuge supplied; archive knowledge neither transmitted nor delivered intact.
- `signal`: archive knowledge preserved through transmission or intact core delivery; full refuge/evacuation objective not achieved.
- `continuity`: evacuation achieved, refuge supplied, and archive knowledge preserved through transmission or intact core delivery. At least one implemented route must physically carry and deliver the core.

Define R = evacuation achieved plus refuge supplied and K = archive knowledge preserved. Outcomes partition all possibilities: continuity = R and K; refuge = R and not K; signal = K and not R; unsuccessful operation = neither. Add tests for all four combinations and an explicit retry state. Accept any valid sequential power-allocation solution rather than requiring the preferred rescue script. Do not collapse the result into an end-menu selection. The catalyst-backed final anchor is a player-authorized world interaction and commits only predicates already established by play.

The player can choose shelter + transit or archive + transit, and a physically coordinated core rescue can preserve records without operating the transmitter. Prove at least three mechanically distinct valid input-driven plans across the outcome space; do not claim every outcome is guaranteed under all mistakes.

### 5. Resolve temporal state consistently

In the new scenario, rewind returns only the player to the current anchor and restarts echo playheads; operation time does not refill. Live companion and cargo state continue. Dependent plans revalidate changed echo/gate state. Do not roll back or clone a current item transaction.

Checkpoint retry restores a complete consistent transient checkpoint, including actor/cargo ownership, plan status, reservations, timer and preview-probe balance, while preserving only explicit anchored facts and once-earned tactic entries. No duplicated rewards or retry-farmed materials. Define separate scenario hazard-reset policies without changing classic semantics.

Save/reload must restore the complete active situation: scenario, timer, player, echo paths/playheads, Rowan, cargo, tactics/versions, plan cursors, reservations, district allocation, checkpoints and persistent outcome. Unknown versions or invalid state leave the current run untouched.

### 6. Add bounded forecast and clear presentation

Preview one candidate for at most eight seconds/480 fixed ticks on isolated projected state using only permitted observations. Use a maximum of three probes per operation and one active preview computation. Cache equivalent requests and invalidate by relevant observed revision. Preview must not consume live RNG, mutate live facts/ledger, spend live resources, complete quests, or expose undiscovered information. Unknown branches must remain visibly unknown.

Add a tactical overlay on the existing world/map. Differentiate past echo, present companion, and predicted future by silhouette/line style/labels as well as color. Show actual dependencies, occupied plates, allocated power, plan phase, costs, and fallback. Keep the world as the main interface. Preserve reduced motion/effects, optional sound, keyboard focus, touch cancellation, and portrait/landscape layouts.

The final encounter should demonstrate real simultaneous coordination. Capture it through actual inputs at normal speed, with no debug teleport, quest flag assignment, fake success callback, or hidden prerecorded route presented as player creation.

## Mandatory category-proof acceptance matrix

| ID | Evidence required |
|---|---|
| C01 | Classic behavior and prior G01–G12 quality lane preserved; new defaults do not change classic clock, echo semantics, objectives or endings. |
| C02 | Scenario separation and save migration/rejection tests cover actual old saves and complete new state; invalid loads do not overwrite current play. |
| C03 | Echo tape remains immutable while Rowan adapts; a route-blocked test distinguishes exact replay from live planning. |
| C04 | Rowan reaches targets through collision-valid paths, obeys ranges and role permissions, stops/replans on known obstruction, and can be interrupted. |
| C05 | Unknown/unobserved state is excluded from planning and forecast disclosures; a hidden-state perturbation test prevents oracle leakage. |
| C06 | A useful semantic demonstration is turned into a reviewed, edited, saved tactic through UI; no hard-coded mission-complete macro. |
| C07 | That tactic transfers to a permitted new target and changed known route; unsupported context yields a specific safe refusal/fallback. |
| C08 | Graph/schema/budget validation rejects unknown verbs, oversized/cyclic plans, invalid IDs, stale assumptions, forbidden anchors and resource overspend. |
| C09 | Conserved power, one unique core, plan reservations, interrupted handoffs and simultaneous-action ordering pass adversarial tests. |
| C10 | Rewind, cancellation, pause, retry, new run and reload preserve the documented complete temporal/economic state without duplicated objects or stale plans. |
| C11 | Eight-second isolated forecasts do not mutate live state/RNG/ledger or reveal unknowns; probe limits and checkpoint behavior are tested. |
| C12 | All three Living District outcomes are reached through real action routes and physical predicates; at least three distinct valid plans are documented. |
| C13 | One complete new scenario is played in a browser at normal speed through controls; a touch route demonstrates creating/issuing a tactic and real coordination. Emulation labeled. |
| C14 | Native WebGL and actual fallback behavior, ordinary-origin persistence, offline network checks and uncaught error checks are exercised; blocked paths remain blocked status. |
| C15 | Before/after rendering evidence and same-scenario frame-time data identify hardware/software renderer, browser, viewport, settings, and sustained regression investigation. |
| C16 | Reviewed source, rebuilt standalone output, accurate status/provenance, updated instructions and versioned manifest are delivered with no hidden external actions. |

A five-person exploratory playtest is a proposed follow-on, not a result Codex may invent. Report `HUMAN_PLAYTEST: NOT_RUN` until real people participate. Automated checks do not certify category novelty, enjoyment, accessibility conformance, or commercial demand.

## Evidence and execution discipline

Maintain the existing durable state/acceptance/decision records; add the C gates rather than forking competing progress histories. At resume, compare actual HEAD/tree and evidence before repeating completed work. Preserve old logs and put fresh results in a separate run directory.

Each change follows reproduce → failing regression → focused implementation → targeted checks → full suite → input-driven browser evidence → review → record. Add tests at module boundaries, not just rendered text. Do not remove a valid assertion, bypass collision, silently switch renderers, or inject desired world state to pass a gameplay check.

After repeated failure, revise the root-cause hypothesis and record the evidence. Continue independent work when one environment lane is blocked. Respect user pauses and configured budget; no unlimited loop. Use a genuine independent reviewer if available and disclose when it is only self-review.

## Delivery and truthful status

Deliver updated modular source, both standalone HTML outputs, a versioned v0.3 source ZIP, runnable tests, scenario/tactic instructions, actual screenshots/clip where supported, manifests, rollback notes, and an acceptance report bound to the tested revision/output hashes.

`CATEGORY_PROOF_READY_FOR_PLAYTEST` requires C01–C16 and inherited mandatory quality gates. This is a local candidate, not a claim of a new market category.

`IMPLEMENTED — VALIDATION BLOCKED` means code exists but a mandatory environment or gate is missing. Identify exact missing evidence.

`IN_PROGRESS / BUDGET_LIMITED` means work remains. Preserve the next action and incomplete gates; do not declare the Goal done.

Independently report hardware acceptance, human playtest status, model integration status (expected `NOT_IMPLEMENTED / OFFLINE_GAME_AI_ONLY` in this increment), and every remote action (expected none).

**Start by inspecting the existing workspace and running the unchanged baseline. Build the smallest real version of the new category, not a description of the largest possible version.**
