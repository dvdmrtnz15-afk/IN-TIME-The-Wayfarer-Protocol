# IN-TIME-The-Wayfarer-Protocol
Video game = The defining shift: you do not merely acquire abilities. You turn the way you solve problems into abilities—then teach, combine, and command them.


## Project status

The playable source is in [`intime-wayfarer/`](intime-wayfarer/). It is the preserved **v0.1.0 temporal-puzzle foundation**, not an implementation of every feature in the Causal Strategy RPG design.

The next design direction is a **Causal Strategy RPG**: player-authored tactics, exact temporal echoes, bounded adaptive companions, and persistent district consequences. Tactic Weaving, the adaptive companion, district power economy, and forecast are specified work, not shipped features.

## Run the existing game

Use Node.js 20 or later. No runtime or build package installation is required.

```sh
cd intime-wayfarer
npm test
npm run build
npm start
```

The included local server defaults to loopback port 8080. The standalone release is [`intime-wayfarer/dist/IN_TIME_PLAY.html`](intime-wayfarer/dist/IN_TIME_PLAY.html); download/open it in a browser that executes JavaScript, or use the local server. GitHub's file viewer is not a running game or a deployment.

## Codex implementation entry point

Read [`AGENTS.md`](AGENTS.md) and [`README_CATEGORY.md`](intime-wayfarer/README_CATEGORY.md). For the bounded new scenario, use [`CODEX_CATEGORY_GOAL.md`](intime-wayfarer/CODEX_CATEGORY_GOAL.md) and [`CATEGORY_START.txt`](intime-wayfarer/CATEGORY_START.txt).

The complete design is [`CATEGORY_BLUEPRINT.md`](intime-wayfarer/CATEGORY_BLUEPRINT.md). The earlier [`CODEX_GOAL.md`](intime-wayfarer/CODEX_GOAL.md) preserves the v0.2 stabilization requirements. Inspect actual source and user instructions before selecting an implementation scope.

## Evidence and limits

[`VERIFICATION.md`](intime-wayfarer/VERIFICATION.md) records the original finite test results and their conditions. The earlier browser checks exercised the Canvas compatibility renderer; native WebGL, ordinary-origin automatic save/reload, real-device performance, and human playtesting remain separate verification obligations.

Source/package manifests and prior evidence remain unchanged in the project directory. Statements about no upload or push in those historical documents describe their original preparation, not any later repository import. See [`PROVENANCE.md`](intime-wayfarer/PROVENANCE.md) for source reuse and rights boundaries. No new open-source license has been assigned by this import.
