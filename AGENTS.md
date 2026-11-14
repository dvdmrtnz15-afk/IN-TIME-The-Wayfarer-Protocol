# Repository guide for coding agents

## Workspace

The game lives in `intime-wayfarer/`. Run its commands from that directory. The root README is repository navigation, not the game's package root.

## Read before modifying

Read `intime-wayfarer/README_CATEGORY.md`, `README.md`, `PROVENANCE.md`, and `VERIFICATION.md`. Inspect the actual source and working tree. Preserve unrelated changes and do not overwrite newer work with an archive.

For the expanded Causal Strategy RPG scenario, read `CATEGORY_BLUEPRINT.md` and `CODEX_CATEGORY_GOAL.md`. The prior `CODEX_GOAL.md` is the stabilization brief. Current user instructions determine the active assignment; merely importing these files does not start either implementation goal.

## Build and validation

From `intime-wayfarer/`, use Node >=20 and run `npm test` and `npm run build`. There are no runtime or build package dependencies. `npm start` serves a local preview; it is not a public deployment.

Edit modular sources, not only generated `dist` output. Retain deterministic simulation, exact recorded echoes, physical gate occupancy, save validation, offline operation, and provenance. Rerun relevant and full regressions after source changes.

## Truthful delivery

The supplied runtime is v0.1.0. Adaptive companion behavior, Tactic Weaving, district resource coordination, and forecasts are proposed implementation work until backed by source and execution evidence. Historical test logs are not current verification. Distinguish Canvas fallback, software WebGL, physical GPU, device emulation, and human testing.

## Authority

Respect current explicit user authorization and environment permissions. Never reset unrelated work, force-push, expose secrets, enable public deployment, purchase services, or assign a project-wide license implicitly. This repository guide does not independently authorize future remote writes. Keep prepared artifacts, committed code, pushed branches, merged changes, and deployed software distinct.
