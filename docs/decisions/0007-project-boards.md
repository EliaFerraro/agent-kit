# 0007 · Project boards: one template, Status derived from labels

**Status:** accepted · 2026-10-30

## Context
The [board design](../project-boards.md) proposed five decisions (§8). They are settled here.

## Decision
1. **Organization**, not a personal account: see ADR 0006.
2. **Nobody moves Status by hand.** A GitHub Action, the same in every repo, adds items to the project and sets Status from the agent labels and from issue/PR events. Labels stay the source of truth.
3. **The cross-repo hub comes later**, when 3+ repos have agents running; until then, saved searches. It must not force changes later, so everything the hub needs is in the per-repo template now:
   - the same labels in every repo (one `labels.yml` from the kit);
   - the same fields with the same names in every project;
   - an Action that can already target more than one project.
   Adding the hub then means creating one project and adding its ID to the Action's config, nothing else.
4. **Metrics, in this order:** time waiting on me → stalled agents → usage per issue and per model → throughput → quality.
5. **One "Needs me" status**: *In review* is folded into it. For one person, a PR waiting for review and a question waiting for an answer are the same queue.

## Consequences
- jamly's `docs/process/42-project-board.md` changes: Status values, and the Action instead of hand moves.
- The usage ledger records the **full model id** (e.g. `claude-sonnet-5-5`). On 2026-10-30 the CLI 2.1.190 resolved the alias `sonnet` to Sonnet 4.6; the ledger is how such drift gets noticed.
- The usage ledger deduplicates transcript lines by request id: summing raw lines counted output tokens twice in a test.
