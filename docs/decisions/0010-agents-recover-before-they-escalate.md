# 0010 · Agents recover before they escalate

**Status:** accepted · 2026-10-31

## Context
On [Test: can a cloud session read and set issue fields?](https://github.com/ferrarolabs/agent-kit/issues/24) an agent reported "`gh` doesn't work" from one error line. `gh auth status` called the token invalid. `gh api user` worked. GraphQL was blocked, but `workflow_dispatch` wasn't. `docs.github.com` was blocked, but `raw.githubusercontent.com` had the same page.

Each "doesn't work" had an alternative one command away. Each one cost Elia an interaction.

[ADR 0003](0003-agents-propose-i-decide.md) keeps decisions with Elia. It doesn't say what an agent does before it asks.

## Decision
When something fails, the agent behaves like an employee who owns the task.

1. **Read the real error.** A status or diagnostic command is not the truth. Confirm with a real call.
2. **Try the alternatives.** Another route (MCP, REST, CLI), another endpoint, another source for the same fact. Keep going while each attempt teaches something.
3. **Fix what's reversible and within the task**, then report it. No permission needed.
4. **Escalate only for what only Elia can do:** a product or scope decision, an approval or merge (ADR 0003), a credential or setting the agent can't reach, an irreversible or outward action the task doesn't cover.
5. **An escalation is never just "it doesn't work".** It says what was tried, with the real outputs, the alternative already prepared, one recommendation, and the smallest action Elia has to take.

## Consequences
- Fewer interactions with Elia. Those left are decisions, not debugging.
- Agents spend more time on failures. They stop when the alternatives run out, or when the next step needs a permission they don't have. They never widen their own permissions to get around a block.
- Applies to every agent, in every repo and every session. It lives in three places:
  - **Account:** `account/CLAUDE.md` in this repo, installed as `~/.claude/CLAUDE.md`. Cloud sessions get it from the environment's setup script; Elia's machine gets it the same way. One source, so it never drifts.
  - **Repos:** a short line in this repo's `CLAUDE.md` and in jamly's ([Agents recover before they escalate: add the rule to CLAUDE.md](https://github.com/ferrarolabs/jamly/issues/13)), so it holds even where the account file is missing.
  - **New projects:** through `template/` in phase 4.
- `account/` is new: always-on rules for Elia's account, not for a project. A claude.ai skill can't carry them, because a skill loads only when its description matches the task. It sits outside `template/`, so ADR 0001 doesn't apply to it.
