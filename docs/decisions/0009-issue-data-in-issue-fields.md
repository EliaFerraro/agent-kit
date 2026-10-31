# 0009 · Issue data lives in issue fields; the project keeps only Status

**Status:** proposed · 2026-10-31

## Context
Today the project template holds its own number fields: *Cost $*, *Opus share %*, *Waited on me (h)*. *Effort* and *Priority* are already org issue fields ([ADR 0008](0008-numeric-priority-and-projects-from-the-template.md)).

Project fields live in one project. Agents can't read them (they see issues, not Projects), and a second project would need its own copy.

Issue fields live on the issue. Agents, Actions and every project see the same value.

*Status* is built into every project. It can't be removed, and it can't be an issue field.

## Decision
- **Every piece of issue data is an org issue field.** Priority, Effort, Cost $, Opus share %, Waited on me (h), and a new **Stage**.
- **The project's only own field is Status.**
- **Stage mirrors Status**: the same values, in the same order, with the same colours.
- **A reconciler runs every 10 minutes.** When Stage and Status differ, the value changed most recently wins. On a tie, Stage wins, because agents can see it ([decided](https://github.com/ferrarolabs/agent-kit/issues/71)).
- **Stage replaces the agent labels** (`agent:ready`, `agent:working`, `needs:*`). One source for the agent's state ([decided](https://github.com/ferrarolabs/agent-kit/issues/72)). Cloud sessions can read and set issue fields ([tested](https://github.com/ferrarolabs/agent-kit/issues/24)).
- **Nothing is left without data.** A [nightly check](https://github.com/ferrarolabs/agent-kit/issues/75) lists open issues with a missing field and puts them in front of Elia.

## Consequences
- Supersedes the part of [ADR 0007](0007-project-boards.md) that put number fields in the project.
- `project-template.json` moves the number fields to `issueFields` and adds Stage.
- [The cloud test of issue fields](https://github.com/ferrarolabs/agent-kit/issues/24) passed through the MCP tools and through `gh api` (REST). Agents must pass `repo` to `list_issue_fields`: the org-level call is denied to the app.
- Through REST, agents set fields with POST. PUT wipes every field it doesn't name.
- Cloud sessions have no GraphQL and no org paths. Anything about the Project itself (Status) runs in an Action or on Elia's machine, never in a cloud session.
- GitHub Actions schedules can run late under load. "Every 10 minutes" means "within about 10 to 20 minutes".
- The reconciler needs the update time of both values. If one side doesn't expose it, the rule is revisited.
- Every rule and doc that names an agent label changes ([Replace the agent labels with Stage in jamly's rules and docs](https://github.com/ferrarolabs/agent-kit/issues/82)). Until Stage exists, the labels stay.
- Labels trigger Actions (`issues: labeled`). If a field change doesn't ([test](https://github.com/ferrarolabs/agent-kit/issues/81)), the auto-start runs from the reconciler, so within about 10 to 20 minutes.
