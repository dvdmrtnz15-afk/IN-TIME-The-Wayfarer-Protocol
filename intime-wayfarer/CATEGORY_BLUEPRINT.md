# IN-TIME: The Wayfarer Protocol
## Causal Strategy RPG — category blueprint, revision 1

**Status:** Proposed product direction and bounded implementation contract. The delivered runtime remains the preserved v0.1 foundation; this document does not claim the new systems exist. The v0.2 stabilization goal remains a prerequisite quality lane, not a completed release.

**Player promise:** Play the hero. Teach the plan. Command the consequences.

**One-sentence pitch:** An embodied strategy RPG in which you turn experiences into reusable AI-directed tactics, cooperate with exact recordings of your past self, and commit decisions that reshape a living city.

**Category thesis:** The core unit of progression is not merely an item, character level, or combat statistic. It is a player-authored, executable tactic that can be tested, adapted by a companion, combined with other tactics, and used to change persistent world systems.

“Category-defining” is the ambition. Novelty, enjoyment, reliability, commercial demand, and market-category recognition are separate hypotheses requiring evidence. No first-ever claim or guaranteed commercial result is made.

---

## 1. The synthesis: one game, not a bundle of genres

The original IN-TIME foundation already has a distinctive temporal verb: walk a route, rewind, and leave a physical echo that repeats that recorded movement and holds its endpoint. The proposed game makes that verb the first rung of a larger progression:

**Experience → understand → demonstrate → compose → delegate → coordinate → commit → live with the result.**

The RPG supplies embodied action, relationships, identity, and a growing repertoire. Strategy supplies contested resources, dependencies, timing, coordinated actors, and consequential allocation. AI supplies bounded adaptation and assistance with composing intentions into executable tactics. These are different uses of the same world state, not three unrelated game modes.

A successful mission should produce two things: a changed district and a new way the player knows how to operate. The new tactic becomes part of the character's build. A later mission tests its assumptions under different conditions.

### Approaches considered

1. **RPG plus conversational companions.** Easy to describe, but conversation could remain decorative and the player would still use a conventional ability system.
2. **Strategy game with programmable units.** Deep, but risks turning the experience into a coding interface with little embodied adventure or personal consequence.
3. **Embodied causal strategy RPG.** Recommended: the player physically discovers a useful method, preserves it as a tactic, delegates bounded parts, and stays responsible for decisive moments. Echoes supply exact temporal coordination; agents supply adaptation; RPG choices determine what goals deserve pursuit.

The third direction preserves the distinctive existing mechanic while giving strategy and AI a necessary gameplay role.

## 2. World and player fantasy

Keep the established year-2100 rain-soaked, sacred-futurist district: weathered stone, copper infrastructure, dark teal streets, warm lanterns, monumental clockwork, and human-scale places worth saving. Use the existing IN-TIME title and Wayfarer Protocol subtitle. Do not manufacture a second competing brand.

The city survives through unstable infrastructure and a memory network that can preserve certain events. The player is a Wayfarer: an embodied operator able to manifest recorded traces, coordinate allies, and anchor selected changes. This is fictional temporal technology, not a claim about real physics or any separate research project sharing the Wayfarer name.

The fantasy is not unlimited control over time. It is **becoming capable of accomplishing a coordinated plan that one body could not accomplish alone**—without escaping responsibility for its consequences.

The city should contain institutions, routes, households, obligations, and disagreements. They must be represented through visible mechanical consequences before expanding the quantity of lore. Restored lights alter safe routes. Lost archive records alter available knowledge. A repaired bridge changes logistics. A companion's promise constrains which plans they accept.

The player should feel clever, powerful, and accountable. The design must avoid both an opaque bureaucracy simulator and an AI assistant that plays everything while the player watches.

## 3. Three kinds of agency: a non-negotiable distinction

### The player: improvisation in the present

The player moves, explores, handles interactions, makes precise timing decisions, intervenes when a plan breaks, and authorizes irreversible commitments. Direct control must remain responsive. The first proof does not add a new combat system; its tension comes from hazards, disruption, escort/carrying, routing, timing, and scarce power. Later combat is optional scope, not necessary to prove the category.

### The echo: exact memory of the past

An echo is an immutable movement recording. It replays its own timed path, restarts with the existing echo loop, and holds its endpoint. It does not reinterpret orders, choose routes, acquire intentions, invent interactions, carry duplicated objects, or become an adaptive NPC.

Preserve the two-echo limit and oldest-replaced-on-third behavior in the existing scenario. An echo can affect explicitly presence-sensitive mechanisms through actual occupancy. Its special temporal-projection rules must be visible and consistent; do not secretly convert a phase trace into a conventional collision-controlled character or vice versa. New actor types cannot silently gain access to echo-only mechanisms.

### The companion: adaptive intention toward a future

A companion is a live actor, not a recording. It chooses permitted actions toward a goal using observed state, learned tactic definitions, available tools, and explicit constraints. It must obey live collision, navigation, action range, resource availability, and its role permissions.

The first proof promotes one existing named character—**Rowan**—from stationary role to a recruitable field companion in the new scenario. The proposed specialization is infrastructure repair and careful transport. Mira and Ivo remain authored supporting roles initially; no claim is made that their earlier characterization already includes these new behaviors.

A companion can say, in plain language, “The route is blocked. I will wait at the lantern,” and physically do so. Its explanation derives from its actual plan state. It cannot claim to have repaired a relay or rescued someone unless the corresponding world event occurred.

**The design rule:** Past behavior is replayed. Future behavior is planned. Present judgment belongs to the player.

## 4. The signature mechanic: weave a tactic from experience

The signature system is called **Tactic Weaving**. It turns a demonstrated solution into a reusable, inspectable ability. This is the main category hypothesis, not a cosmetic naming exercise.

### A concrete example: Relay Runner

The player discovers a route through a gate, waits for a hazard to pass, picks up a portable archive core, and carries it to a safe lantern. The recorder captures meaningful action events and their observed conditions, separately from the existing movement-echo tape.

The player selects that segment and chooses which details may vary. A draft tactic appears:

- **Goal:** deliver the selected core to the selected safe landmark.
- **Start condition:** required gate is open and the route is known.
- **Method:** approach the gate; wait for a safe crossing; acquire the core; follow the permitted route; deliver.
- **Flexibility:** choose another known safe route if the original is blocked.
- **Constraints:** do not spend the final anchor charge; do not enter undiscovered routes; do not abandon carried cargo.
- **Fallback:** stop at the nearest previously verified safe landmark and request a new instruction.

The player reviews this readable card and saves it in one of three prepared tactic slots. Rowan can execute it later with a different destination or a blocked original corridor. If a condition no longer holds, the agent adapts only within the permitted envelope or stops with a specific reason.

A remembered route is not proof of a general ability. The UI distinguishes **recording**, **draft tactic**, **tested in listed contexts**, and **unsupported here**. A tactic can be useful before universal reliability exists; its limitations are part of strategy.

### What “learning” means in the first implementation

Use demonstration-grounded extraction and explicit player annotations over known action primitives. This is not neural imitation learning, personality cloning, or proof that a model inferred intention from one trajectory. One observation supports one concrete example; the player or validated system supplies the allowed generalization.

A developer-visible tactic contract contains:

`id, version, sourceDemonstrationId, actorRole, goal, observedPreconditions, steps, permittedAlternatives, resourceBudget, abortConditions, fallback, testedContexts`.

A player-facing card shows only goal, method, costs, boundaries, and fallback. No node-editor literacy is required.

### Bounded composition, real variety

Start with six live-agent primitives: **move, wait, interact, carry, deliver, pulse**. `interact` is permissioned to named reversible affordances; `pulse` is available only to an actor with the corresponding capability. A composed tactic is a bounded action graph with explicit sequence, condition, and fallback edges. Maximum 12 action nodes, one bounded retry per node, and a finite task deadline in the first proof. An unavailable action is rejected before execution.

Echo creation, checkpoint retry, and final anchoring are not ordinary agent primitives. The player retains those controls.

Creativity comes from combining targets, triggers, timing, constraints, roles, and demonstrated methods—not from letting generated JavaScript run in the game or allowing language to invent an unsupported power.

### Full-game direction

Later, a natural-language or voice interface may propose tactic graphs, suggest alternatives, explain failure, or help name a tactic. A locally available model or separately authorized service could provide this authoring layer. It must compile into the same inspected contract. The core game must remain playable without it. The v0.3 proof uses the offline planner and structured authoring; it does not add live LLM calls or pretend authored dialogue is generative intelligence.

## 5. AI abilities should feel like powers

Five ability families organize the full direction. Only the bounded subset specified later belongs in the next proof.

**Echo:** enlist exact past movement. A correctly placed echo buys simultaneous presence, not arbitrary extra intelligence.

**Insight:** preview one candidate plan against currently known state. Show a short projected sequence, dependency conflicts, and unknowns. A prediction is conditional, not prophecy or a success guarantee.

**Intent:** assign a bounded objective to a live companion, with explicit permissions and an interrupt. The player decides the objective and its limits; the companion handles local execution.

**Weave:** compose practiced methods into new reusable tactics, binding roles and targets without programming syntax.

**Anchor:** commit a meaningful world change that survives the local temporal loop. Show the consequence and opportunity cost before the player confirms.

A showcase combination is **a living rescue formation**: an echo occupies a regulator; a second echo opens a transit gate; Rowan carries the archive core only after both dependencies are satisfied; the player uses a pulse to create a crossing window and personally anchors the evacuation. Every effect comes from real actors, actions, and world state. The sequence is not a pre-rendered special attack or one hidden “complete objective” command.

The long-term promise is that players develop recognizable tactical styles. Their signature powers are partly authored through play, not simply selected from identical global skill trees.

## 6. Make the strategy substantive

### One world at three scales

**Field view:** embodied movement, observation, interactions, hazards, and execution.

**Tactical view:** pause the same simulation; inspect actors, observed routes, dependencies, resource reservations, and a short preview. Assign or interrupt a tactic. This is an overlay on the playable district, not a disconnected spreadsheet.

**District view:** show how power, transit, information, and institutional commitments alter opportunities in the same space. In the first proof, this can be another layer of the existing map. It need not be a second renderer or a new strategy game engine.

All three views read one authoritative world. Pause freezes player, companions, hazards, resource transfer, and operation time together. It is not a way to run a free parallel economy.

### Four meaningful constraints, not a dozen currencies

1. **Time:** the operation deadline. The classic six-minute scenario remains unchanged. The new proof has its own explicitly labeled twelve-minute simulated-time deadline; it is a new scenario rule, not a silent extension of the old timer.
2. **Focus:** three concurrent commitments in the new scenario. Each deployed echo reserves one point and the one active companion reserves one. This initially caps the formation at two echoes plus Rowan. More commands do not manufacture extra actors.
3. **Power:** a conserved district supply of three units. The shelter requires two for full operation, the archive transmitter two, and the transit system one. The player can reroute supply; demands cannot all be satisfied simultaneously.
4. **Anchor catalyst:** one physical mission resource reserved for the final persistent commitment. It cannot be duplicated by echoes or spent by an agent without permission; in the proof it remains player-only.

Relationships are also constraints but should not be reduced to a single morality currency. Show relevant promises, expertise, and refusals in context.

### The world is a dependency network

Opening a route matters because it lets someone or something move. Supplying a facility matters because it changes what that facility can do. Carrying a core matters because it physically moves a scarce object out of danger.

This creates strategic choices such as supplying shelter plus transit, supplying archive plus transit, or moving the archive core by hand to preserve its information without running the transmitter. The latter requires coordination, route knowledge, and time; it is not a dialogue choice that grants everything for free.

The power system makes the decision costly. The portable core makes a clever alternative possible. The companions and echoes make simultaneous execution possible. The RPG makes the people and records worth caring about.

### Counterplay and disruption

Plans must meet adversarial conditions: a route closes, a previously observed hazard changes phase, a device needs sustained maintenance, or a commitment prevents using a convenient shortcut. The first proof uses bounded, authored, telegraphed disturbances. Later opposing factions can react to tactics they actually witness, with visible warning and response limits.

Do not read a private player command and spawn a perfect counter. Do not reward extra prompting over good play. A companion must not see undiscovered map state merely because the engine stores it.

## 7. RPG progression without losing the strategy

Progression expands what the player can understand, coordinate, and responsibly delegate. It does not need XP grinding or permanent across-the-board stat inflation.

A full-game character build has three components:

- A limited prepared repertoire of player-authored tactics.
- Equipment or tools that enable new action affordances and impose tradeoffs.
- Relationships that grant expertise, access, and specific collaboration commitments.

Three optional development tendencies provide a readable fantasy without locking the player into a rigid class: **Pathfinder** discovers and exploits routes; **Warden** preserves people and infrastructure; **Weaver** coordinates dependencies and conditional actions. They are proposed specializations, not new claims about prior canon.

A Warden might trade route speed for sustained protection. A Weaver might coordinate a more complex dependency but occupy a scarce focus commitment. A Pathfinder might scout an alternative path but still have to travel it and acquire current information. No specialization silently bypasses collision, cost, or uncertainty.

Learning a better tactic changes later play. “I can now coordinate a safe handoff under interruption” is a stronger progression event for this game than “my pulse is five percent stronger.”

NPC relationships must change available plans. Rowan might accept a protected transport task but refuse an order that violates a previously disclosed promise. Refusal occurs before commitment when knowable; emergent interruption explains the changed condition. The player can revise the plan, negotiate through supported authored choices, or handle the action personally.

## 8. The category-proof mission: The Living District

This is one compact new scenario that proves the integration. It is not a full campaign or the entire vision.

### Fixed scope

One authored district using the existing art direction and reusable geometry. One player, up to two exact echoes, one active companion, three infrastructure consumers, one unique portable core, three prepared tactic slots, six primitive action types, and three consequential outcomes. Existing Relay, Archive, and Last Light remain reachable unchanged in the classic scenario/tutorial lane.

### Mission setup

The city is approaching a blackout. Residents need a powered refuge and a viable evacuation route. The archive transmitter can preserve the district's records, but it competes for the same power. The core can instead be physically recovered and transported. Rowan can repair and carry, but cannot be in two places at once.

The player chooses the desired plan. The engine must not secretly choose its preferred moral ending.

### Playable sequence

**Discover.** Reach the relay, learn the echo mechanism through an actual occupied plate, inspect the power network, and meet Rowan. The objective is understandable before strategy terminology appears.

**Demonstrate.** Perform a short, useful transport or repair sequence. Mark its start, intended goal, permitted target changes, and fallback in a compact UI. Save it as Relay Runner.

**Delegate.** Assign Relay Runner to Rowan. He moves through the world and carries a real unique object. A telegraphed obstruction forces either a valid alternate known path or an explicit safe stop. The player sees what adaptation does and does not mean.

**Coordinate.** Place the two echoes where simultaneous presence matters; schedule Rowan's objective behind their conditions; redirect power; take direct control of the remaining timing-sensitive part. A brief forecast can expose an observed conflict but not reveal unknown threats.

**Commit.** Complete a physical terminal interaction with the catalyst and confirm the persistent consequences. Do not implement the mission as three final menu buttons that manufacture completion.

**Return.** Allow a short walk through the changed district. Lighting, access, recovered information, and character responses reflect the saved outcome. The tactic stays in the repertoire; the world result stays in the Chronicle.

### Three outcomes grounded in state

- **Refuge:** residents evacuated and refuge supplied; the archive records were neither successfully transmitted nor delivered intact to the refuge.
- **Signal:** records preserved before blackout, by transmission or intact core delivery; the full refuge/evacuation objective was not achieved. Show the specific unresolved consequence without inventing untracked casualties.
- **Continuity:** refuge and evacuation achieved and the records preserved, either through completed transmission or by delivering the unique intact archive core to the refuge. At least one implemented route must use physical core recovery. A valid sequential power-routing solution must also be recognized rather than discarded because it was not the designer's preferred plan.

Use explicit predicates for these outcomes and a separate failed-operation state with retry: with R = refuge plus evacuation achieved and K = records preserved, Continuity is R and K, Refuge is R and not K, Signal is K and not R, and failure is neither. These four cases cover every combination without silently discarding a valid alternative solution. Classic `light`, `home`, and `signal` ending logic is unchanged and separately namespaced by scenario.

### Why the moment could be memorable

The player watches a past self hold a regulator, an adaptive companion reroute a fragile cargo, and the present self perform the last timed crossing. The district lights turn on because all three roles actually coordinated. The player recognizes the plan as theirs.

That is the target emotional proof. A larger map or a more articulate chatbot would not establish it.

## 9. Time, memory, and fairness rules

Keep the classic temporal semantics unchanged. The new scenario has explicit rules:

- Tactical pause freezes the complete simulation. A live model, if added later, does not get to advance the world asynchronously.
- Rewind resets the player to the current anchor and restarts the echo tapes. The operation clock does not refill. Live companion position, current cargo ownership, and ongoing district transactions continue; they are not cloned or rolled back by the player's spatial rewind.
- A changed echo dependency causes dependent plans to wait, revalidate, or stop. It cannot authorize opening a gate directly.
- A checkpoint retry is different: restore the checkpoint's consistent transient district, actor, cargo, plan, and clock state. Preserve only explicitly anchored facts and once-earned repertoire entries. A retry cannot accumulate free supplies or duplicate a core.
- The new scenario resets or resumes hazards according to its documented scenario policy, separately from the classic scenario's existing drone reset rules.
- A genuinely new run resets world/run state; a persistent repertoire must be loaded only through an explicit profile mechanism. The proof can scope repertoire persistence to its validated save rather than silently creating a global account.
- Plans reserve resources and recheck them at execution. Two agents or steps cannot spend the same item or power capacity concurrently.
- Identical gameplay inputs and admitted plan records reproduce outcomes in the same supported runtime. This is not a claim of bitwise equivalence across every JavaScript engine or nondeterministic model run.

No hidden morality meter. No psychological profiling from camera movement, voice, age, or inferred personality. Any director uses disclosed gameplay signals and bounded authored rules. The older hidden-Tarot aspiration and the current visible modifier UI are different historical designs; this increment keeps the current modifier presentation rather than claiming they are already unified.

## 10. AI architecture: powerful proposals, bounded execution

Use this authority chain:

**Player intent → observed-state snapshot → proposed tactic → validation and resource reservation → fixed-step action execution → actual world events → useful feedback.**

The simulation owns truth. A planner may propose a route or action graph; it cannot write `gateOpen`, teleport an actor, create inventory, anchor a fact, declare a rescue, or replace a save. In-game text is data, not a command to the runtime.

### Three distinct AI responsibilities

**Execution AI:** inexpensive local behavior execution and navigation. It handles motion, waits, observed hazard response, fallback, and cancellation. It runs offline and deterministically within the existing simulation structure.

**Planning AI:** bounded goal-oriented search over the actor's known affordances, observations, and permitted tactic graph. It adapts a plan when relevant observed state changes. Use stable ordering, finite node-expansion budgets, and tick-scheduled work; do not tie decision quality to render frame rate.

**Language/model layer:** future optional translation, explanation, and candidate composition. It is never the physics, the save system, the rulebook, or an authoritative narrator of events that have not happened. Store accepted proposals for replay. A seed alone cannot reproduce a fresh external model response.

The first proof implements the first two responsibilities with established game-AI techniques. It does not need model credentials, a cloud backend, or arbitrary generated code to deliver adaptive behavior.

### Observation and preview

Use a deliberately limited observation view, not the full internal world. Include known landmarks, visible hazards, known gate/plate state, role permissions, confirmed commitments, and available resources. Unknown remains unknown.

Forecast at most eight seconds of one candidate plan on a separate cloned state. Do not mutate the live ledger, spend live resources, consume live RNG, or learn hidden information through simulated exploration. Show the assumptions and unknown areas. Use “predicted under observed conditions,” not unsupported confidence percentages. Cache equivalent previews and invalidate them when relevant observed revision changes.

A first-proof cap of three forecast probes per operation prevents an unlimited oracle; retry restores the checkpoint's probe balance, not a separate farmable reward. Forecast use does not unlock map information. The card costs are explicit to the player.

### Bounded initial technical budgets

Proposed engineering limits, not measured performance results: one live companion; planning no faster than 5 Hz; stable maximum 256 plan expansions per update; at most 12 tactic nodes; at most three prepared tactics; preview 480 fixed steps at 60 Hz; one preview computation active at a time. Navigation uses a documented separate bounded search budget. If these limits obstruct a valid small-scene solution, redesign the search/state boundary with a regression rather than silently making the budgets unlimited.

## 11. Visual and interaction direction

The visual signature should be causal legibility, not generic neon clutter. Render exact echoes with distinct silhouettes and temporal trails. Render the companion as a live, materially present character. Render a proposed future as a clearly different dotted projection that cannot be mistaken for a committed actor.

Show plate occupancy and actual gate connections. Show reserved power flowing along a visible link. When a plan waits, its dependency should be identifiable in the world. Use shape, labels, motion, and optional sound together; color alone is insufficient.

The default screen is the world. A compact three-tactic bar, current objective, actor status, and pause controls are enough. Open detailed cause/plan information on demand. Avoid an enterprise agent dashboard inside the game.

The expected presentation is intimate cinematic strategy: rain and light, expressive silhouettes, restrained sound, satisfying transitions, and readable geometry. No placeholder button that pretends to invoke a feature; no painted background standing in for the playable world.

Preserve keyboard, pointer, and touch parity. Voice is optional future convenience, never the sole input path. Reduced motion/effects and mute must affect the actual rendering/audio behavior. Tactical pause gives thinking time without changing the world.

## 12. Implementation fit with the delivered source

The preserved source is a dependency-free JavaScript game with a 60 Hz simulation, declarative world, recorded echoes, A* navigation, native WebGL plus Canvas compatibility rendering, input/UI, and validated saves. It is not a React application.

Preserve the existing public behavior of `IT.createGame(seed)`, `IT.step`, `IT.rewind`, `IT.retry`, `IT.interact`, `IT.choose`, `IT.saveGame`, and `IT.loadGame` in the classic scenario. Inspect actual signatures before editing. Separate a scenario registry and world lookup only where needed to avoid one global world's rules leaking into another.

Suggested new responsibility boundaries, subject to inspection of newer workspace code:

| Proposed module | Responsibility |
|---|---|
| `src/core/scenarios.js` | Classic and Living District configuration, mode identity, scenario invariants |
| `src/core/observations.js` | Actor-specific known state, disclosure boundaries, observed revision |
| `src/core/tactics.js` | Demonstration events, tactic schema, validation, composition, repertoire |
| `src/core/agents.js` | Companion planner/executor, interrupts, stable scheduling, plan status |
| `src/core/district.js` | Power allocation, cargo uniqueness, resource reservations, outcome predicates |
| `src/core/forecast.js` | Pure bounded preview using isolated state and observations |

Add UI at the existing input/view boundary. Extend the explicit build list so modular and standalone outputs remain equivalent. Renderer and sound may display outcomes but may not decide them. Model adapters are deferred, not required package dependencies.

Save schema and application version are separate. Version the new schema explicitly, supply tested migration or clear safe rejection for old saves, and preserve a migration fixture. Save includes actor state, cargo ownership, tactic versions, plan cursors, reservations, operation clock, scenario, checkpoints, and anchored outcomes. Invalid data must not overwrite the current run.

## 13. Delivery order and proof gates

**A — Stabilize the base.** Re-run the prior v0.2 goal's G01–G12 quality lane; preserve existing history and label unavailable hardware/browser evidence honestly. Independent pure-logic work can proceed while an environment lane is blocked, but the final release cannot claim that lane passed.

**B — Add one adaptive companion.** Prove collision-safe navigation, one physical task, cancellation, refusal, and a safe fallback. Compare behavior to a fixed recorded route under a known obstruction.

**C — Add one demonstrated, reusable tactic.** Capture semantic actions separately from echoes. Validate the draft, expose constrained edits, save it, and reuse it with a different target and one changed route. Show exactly what generalized.

**D — Add the district dependency.** Three power consumers, conserved supply, one unique cargo item, explicit resource reservation, and state-derived endings. The companion must wait for a genuinely occupied gate rather than bypass its state.

**E — Add preview and presentation.** Isolated eight-second forecast, readable actor/plan states, first-use guidance, responsive input, and real-time browser evidence.

Do not expand to factions, procedurally generated campaign, dozens of actors, open-world driving, multiplayer, marketplace, or live LLM integrations until the combined first proof works.

## 14. The test for category value

Functional correctness is necessary but cannot prove a new category or fun. Use separate checks:

**Mechanical proof:** exact echoes, adaptive companion, player-authored tactic, constrained power network, and persistent outcome all work together through real inputs. Removing any one should remove an identifiable strategic possibility, not just a UI decoration.

**Transfer proof:** the player's saved tactic handles a different allowed target and one changed known route, or correctly declines with an actionable reason. It must not succeed by silently becoming a mission-complete macro.

**Comprehension proof:** first-time players can explain the difference between an echo, a companion, and a forecast. They can identify why a plan failed and change the relevant condition.

**Authorship proof:** players describe a successful sequence as a plan they created, not merely the designer's scripted puzzle solution or the AI's answer.

**Replay proof:** at least three mechanically distinct input-driven solutions are demonstrated for the mission. This is a content requirement, not proof of infinite emergence.

**Early human study:** begin with five external first-time playtesters for exploratory usability findings, not market validation. Suggested targets: useful echo within three active minutes; a self-authored tactic within eight; at least four can explain actor distinctions and one world consequence; document every breakdown and replay preference. These are proposed targets, not achieved results, statistical evidence, or universal timing requirements.

Compare the same encounter with a fixed-route helper and with the bounded adaptive companion. Record goal completion, interventions, time spent editing, mistaken expectations, and willingness to replay. A richer planner that creates more confusion is not an upgrade.

## 15. Prior art and the honest category claim

The components have precedents. The Last Clockwinder uses demonstrations to create looping automation clones. Lemnis Gate combines temporal self-cooperation with tactical strategy. KRAFTON/NVIDIA describe an AI teammate architecture combining deliberate language-model reasoning and fast game behavior. These examples are reasons to avoid claiming that echoes, tactical time, or AI companions alone are inventions here.

The proposed distinction is their integration with **player-authored executable tactics as RPG progression** and **persistent institutional consequences as strategy**. The test is whether that integration changes what the player repeatedly does, learns, and values. This is a positioning and design thesis, not an exhaustive prior-art, patent, trademark, or market assessment.

### Primary references

- Pontoco/Cyan: The Last Clockwinder official publishing announcement and developer/publisher store description. https://cyan.com/2022/04/13/closing-walls-and-ticking-clocks/ and https://store.steampowered.com/app/1755100/The_Last_Clockwinder/
- Ratloop Games Canada game director James Anderson, developer-authored Lemnis Gate explanation. https://blog.playstation.com/2021/09/21/lemnis-gate-fusing-tactical-time-travel-with-strategic-shooting/
- KRAFTON interview published by NVIDIA, “How KRAFTON Built PUBG Ally,” June 25, 2026. https://developer.nvidia.com/blog/how-krafton-built-pubg-ally-a-co-playable-character-powered-by-nvidia-ace/
- Supplied IN-TIME source, `docs/DESIGN.md`, `PROVENANCE.md`, `VERIFICATION.md`, and `CODEX_GOAL.md`. Those records establish source and historical evidence boundaries, not new feature completion.

## Bottom line

Do not build an RPG with a chatbot attached, an RTS with a time gimmick, or an autonomous-agent demo wearing a game interface.

**Build a game in which intelligence becomes a playable resource: the player earns methods through experience, teaches bounded agency, coordinates past and future actions, and chooses which consequences become permanent.**
