# Start IN-TIME in Codex

This bundle adds a goal-mode execution brief to the unchanged playable v0.1 foundation. It does not implement v0.2 or start Codex.

1. Extract into a new local folder, or compare with an existing IN-TIME checkout before copying anything. Open `intime-wayfarer/` as the Codex workspace.
2. Read `CODEX_GOAL.md`. It contains scope, source map, invariants, ordered implementation work, G01-G12 acceptance gates and approval limits.
3. In a Codex session supporting Goals, paste the single line from `CODEX_START.txt`. Use execution rather than a plan-only request.
4. Maintain workspace-limited permissions and the normal approval policy. This brief does not grant external publishing, deployment or spending authority.

No source ingestion is implied by a chat link. Codex must actually see the extracted files. When a newer checkout already exists, preserve it and reconcile the supplied baseline rather than replacing it.

## Evidence

`handoff-evidence/BASELINE_RECEIPT.json` records a fresh 34/34 Node test rerun, successful build and identical generated HTML. Browser tests were not rerun during this handoff preparation. Original browser claims and limits remain in `VERIFICATION.md`.

Every original source-package file is unchanged. `PACKAGE_MANIFEST.json` remains the original v0.1 manifest. `CODEX_HANDOFF_MANIFEST.json` separately records this envelope's contents.

## Goal controls

OpenAI's official guide documents `/goal <outcome>`, `/goal pause`, `/goal resume` and `/goal clear` for a supported Codex build. It states Goals are available starting in Codex 0.128.0. Verify the installed client; a plain text file does not itself activate a native Goal.

Official reference, checked 2026-10-17: https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex

If the client does not expose Goals, the execution brief can still be supplied as a normal implementation task, but persistent Goal activation must not be claimed.
