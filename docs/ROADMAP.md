# Roadmap

Each phase is useful on its own and has a verifiable **exit criterion**. We don't move to the next phase until it's met. The pilot is **jamly**: phases 1–3 are built there, phase 4 extracts what's generic into this repo.

## Phase 0 · Plan ✅
- [x] Goal, principles and architecture in [PLAN.md](PLAN.md)
- [x] First decisions in [decisions/](decisions/)

**Exit:** the plan is written and approved by me.

## Phase 1 · Foundations (on jamly) — in progress
- [x] jamly's `CLAUDE.md` written as a short contract, with the definition of done and who holds each line ([jamly#1](https://github.com/EliaFerraro/jamly/pull/1))
- [x] Permissions in `.claude/settings.json`: deny secrets and irreversible commands ([jamly#1](https://github.com/EliaFerraro/jamly/pull/1))
- [x] CI on GitHub Actions: test, lint, typecheck, on pushes to every long-lived branch ([jamly#1](https://github.com/EliaFerraro/jamly/pull/1))
- [x] Issue templates: feature and bug ([jamly#1](https://github.com/EliaFerraro/jamly/pull/1))
- [x] Labels as code and a project board spec: labels carry the agent workflow, the Project is for planning ([jamly#1](https://github.com/EliaFerraro/jamly/pull/1))
- [ ] GitHub Project created from the spec (by hand: Projects aren't reachable from a session)
- [ ] Branch protection on `dev`, `staging`, `main`: PR + green CI required ([jamly#2](https://github.com/EliaFerraro/jamly/issues/2))
- [ ] Cloud environment configured: setup script, network allowlist, no Supabase credentials

**Exit:** a real issue implemented by a cloud session started from my phone, with a PR and green CI, without me writing code.

## Phase 2 · Sensors
- [ ] `verify-done` skill: runs every machine-checkable line of the definition of done and reports one row per line
- [ ] Stop hook that refuses to finish with red tests, lint or typecheck, and sends back the real error
- [ ] PostToolUse hook: format and lint on changed files
- [ ] `critic` subagent
- [ ] Every hook made to fail on purpose once

**Exit:** I've watched an agent try to finish with a red test, get blocked, and fix it on its own.

## Phase 3 · Long autonomy
- [ ] `docs/progress.md` convention
- [ ] Idempotent `resume-work` skill
- [ ] Cloud scheduled task that resumes work
- [ ] "I need you" signal when the agent is blocked
- [ ] Command log (Record column)

**Exit:** a feature moves forward for 24 hours without me, across at least one usage limit.

## Phase 4 · Extraction into the kit
- [ ] Split jamly's generic files from its project-specific ones
- [ ] Fill `template/` in this repo, including the generic labels (type, agent state, priority) and the board spec
- [ ] `scripts/bootstrap.sh` and `scripts/sync-kit.sh`
- [ ] Account-level skills: `write-spec`, `critic`, `explain-feature`
- [ ] This repo set up as a GitHub template repository

**Exit:** a second project set up with the kit in under 30 minutes, and a kit update propagated to jamly with the script.

## Phase 5 · Continuous quality
- [ ] `explainer` subagent and `docs/learn/`
- [ ] Weekly codebase auditor, one theme at a time, at most 5 issues
- [ ] Harness eval set: 10 tasks in `evals/` drawn from real failures
- [ ] Every recurring agent mistake becomes a rule, a hook or an eval task

**Exit:** a month of auditor issues triaged, and the eval set running on every change to the kit.

## Phase 6 · Parallelism
- [ ] 2–3 sessions in parallel on different areas of the code
- [ ] PR auto-fix
- [ ] Agent teams for review and debate on hard decisions
- [ ] (Optional) a view of what the agents are doing

**Exit:** a week with several features moving in parallel, with no conflicts between branches.
