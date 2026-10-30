# 0002 · The state of the work lives in the repo, not in the session

**Status:** accepted · 2026-10-30

## Context
I want a feature to move forward for 12–24 hours without me, even when I run out of usage. A session can stop at any moment: limit reached, environment expired, an error. Whatever lives only in the session's context is lost.

## Decision
- Spec (issue), plan (`docs/plans/`), progress (`docs/progress.md`) and decisions are committed files.
- Agents make small, frequent commits and update `progress.md` after every completed step.
- Resuming is handled by a cloud scheduled task that restarts from `progress.md`, and is idempotent.

## Consequences
- No dependency on my machine being on or a session being open.
- The format of `progress.md` needs discipline: it's the contract between one session and the next.
- More commits on feature branches; squash on merge.
