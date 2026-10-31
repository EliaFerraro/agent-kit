# 0011 · Org first; what can't live in the org is synced from one source

**Status:** proposed · 2026-10-31

## Context
Tokens, labels, templates and rules are set repo by repo today. With one repo that's fine. With five, they drift, and every new repo is set up by hand.

GitHub holds some of these at org level. Others exist only per repo.

| Thing | Org level? | Today |
|---|---|---|
| Issue fields, issue types | Yes | Already org |
| Projects | Yes | Already org ([Agent work](https://github.com/orgs/ferrarolabs/projects/3)) |
| Actions secrets (`PROJECT_TOKEN`) | Yes, shared with all or chosen repos | Repo secret in agent-kit |
| Issue and PR templates | Yes, as defaults from a public `ferrarolabs/.github` repo | Per repo (jamly) |
| Agent rules (`CLAUDE.md`) | Account level: `account/CLAUDE.md` (ADR 0010) | Done |
| Labels | Only defaults for **new** repos | `labels.yml` in jamly |
| Workflows (CI, Status, reconciler) | Reusable workflows from one repo; each repo keeps a short caller | Per repo |
| Branch rulesets | Org rulesets: plan availability to check | Per repo |
| Cloud environment, setup script | Per environment, shared by any repo that uses it | One environment |

## Decision
- **Org first.** Anything GitHub can hold at org level lives there, set once.
- **Everything else has one source, agent-kit, and a sync job keeps the repos aligned.** A scheduled Action in agent-kit compares each org repo with the source and opens a PR where they differ. It never pushes to a protected branch. This is phase 4's `sync-kit.sh`, run by an Action instead of by hand.
- **A repo keeps only what is truly its own**: its `CLAUDE.md`, its ADRs, its code.

## Consequences
- `PROJECT_TOKEN` moves to an org secret, shared with all repos. The repo copy is deleted.
- Templates move to a new `ferrarolabs/.github` repo. jamly's copies go, unless jamly needs its own.
- Labels: the generic ones (type, agent state, priority) become a kit file; the sync job applies it to every repo. Repo-specific labels (`area:*`) stay per repo.
- The sync job needs a token that can open PRs in every repo. That is Elia's to create.
- Overlaps phase 4 of the [roadmap](../ROADMAP.md). Tracked in [Org first, then sync](https://github.com/ferrarolabs/agent-kit/issues/85).
