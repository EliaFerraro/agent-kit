# 0003 · Agents propose, I decide

**Status:** accepted · 2026-10-30

## Context
I want to delegate writing the code, not responsibility for the product. A sentence in `CLAUDE.md` can't prevent an irreversible action; it only makes it less likely.

## Decision
- I step in at two points: **I approve the plan** and **I merge**.
- Long-lived branches are protected: changes land only through a PR with green CI and my approval.
- The auditor and the critic open issues or comments with evidence and a proposal; they don't change the code themselves.
- I record architectural choices as ADRs; when I reject a proposal I write down why, so it isn't proposed again.

## Consequences
- My approvals are the bottleneck: the system must make them quick (small PRs, readable tests, short plans).
- Safety doesn't depend on how the agents behave.
