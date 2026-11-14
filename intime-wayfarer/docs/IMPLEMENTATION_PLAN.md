# Playable Foundation Implementation Plan

**Goal:** Deliver a playable temporal puzzle game plus source, tests and Google handoff instructions.
**Architecture:** A deterministic simulation with input commands is separate from native WebGL rendering and DOM UI. A build script generates a single offline HTML artifact from the same modular source.
**Tech stack:** JavaScript ES modules / JSDoc, native WebGL, zero-dependency bundler, Node test runner, Python Playwright.
**Spec:** DESIGN.md

## Global constraints
Do not edit or publish existing Replit apps. No hidden credentials, remote model calls or online game dependencies. Two echoes maximum. 60 Hz fixed timestep. Checkpoint facts monotonic during a run. Unknown save versions rejected. Runtime animation cannot consume the simulation RNG.

## Review focus
Old echo interaction state surviving a chapter transition; blocked or out-of-bounds click destinations; elapsed time during backgrounding; corrupt and oversized saves; repeated same-mission retry and end-screen new game.

## Tasks
1. Source and simulation: write behavioral tests first; implement world layout, recovered RNG adaptation, collision, pathfinding, echoes, mission gates, modifiers, checkpoint/retry, save validation and event verification. Run node tests.
2. Presentation: create procedural city, character animation, visible echo paths, gate feedback, lighting, title/menu, dialogue, HUD, map, responsive controls and audio. Bundle locally.
3. Verification: play complete routes with the real production simulation; exercise actual browser input, reload, failure/retry, mobile controls and both endings; inspect screenshots; record defects and fix with regressions.
4. Handoff: ship source ZIP, one-file game, one-file code+instructions text, Playground prompts, AI Studio instructions, provenance, source-rights notice and verification report.

## Execution ledger
Read-only source recovery complete. Existing apps unmodified. Isolated new workspace. Inline execution, no available subagent reviewer; record self-review as such.
Ruling: preserve the inherited conceptual direction while implementing a small new temporal game instead of extracting CHIRAQ wholesale; its dependency and state defects would dominate the handoff.

Ruling: use native WebGL and a deterministic concatenation build, not a remotely loaded engine; dependency downloads are unavailable in this environment. This keeps the delivered game actually offline and testable. Cost: custom rendering is a bounded prototype, not a general-purpose engine.

## Execution closeout

- Source selection complete: adapted exact returned Trinity SeededRng; preserved reference and commit. Rejected separate zeroing Tarot expression and garbled Physics extraction.
- Core complete: fixed-step movement, occupancy gates, bounded A*, echoes, anchors, authored story, modifiers, hazards, three epilogues and validated saves. 34 Node tests pass.
- Presentation complete: procedural 3D, controls, touch, help/map/pause, portable saves and synthesized sound.
- Ruling: Chromium in this environment could not expose WebGL or navigate to test URLs. Do not modify browser policy. Added a genuine projected-3D Canvas compatibility path and tested exact standalone bytes via set_content. Cost: native GPU rendering and origin persistence still require separate acceptance.
- Browser checks complete: desktop 29; mobile 11; no JS errors or external requests observed. Full route acceleration uses normal input, no position or quest overrides.
- Local packaging complete after SHA-256 manifest/ZIP inspection. Existing apps and remote repositories unchanged.
