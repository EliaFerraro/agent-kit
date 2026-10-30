# agent-kit

My reusable agent harness: the system that lets Claude Code agents build my projects on their own, while I make the product and architectural decisions and approve the result.

**Status:** Phase 1, foundations. The kit is built one piece at a time, first on the pilot project **jamly**.

## Where to start

- [docs/PLAN.md](docs/PLAN.md): where we want to end up. Goal, principles, architecture, agent roles, flow, boundaries.
- [docs/ROADMAP.md](docs/ROADMAP.md): the phases, each with its exit criterion.
- [docs/decisions/](docs/decisions/): why each choice was made, one decision per file.

## The idea in three lines

- **Agent = Model + Harness.** I don't control the model; context, tools, boundaries, hooks and orchestration I do.
- **State lives in the repo.** Specs, plans and progress are files, so work survives the end of a session and resumes on its own after a usage limit.
- **Agents propose, I decide.** I approve plans and merge; everything else is held by tests, hooks and branch protection.

## How it will be used (from Phase 4)

```bash
# set up the kit in a repo
./scripts/bootstrap.sh ../my-project

# update the kit in a repo that already uses it
./scripts/sync-kit.sh ../my-project
```

The kit stays optional: in any repo I can always work by hand or in chat.
