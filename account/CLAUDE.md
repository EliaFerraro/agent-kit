# Elia's agent rules — every project, every session

Installed as `~/.claude/CLAUDE.md`, so it applies on top of each repo's own `CLAUDE.md`. Source: `ferrarolabs/agent-kit`, `account/CLAUDE.md`. Edit it there, never in place.

## Recover before you escalate
Work like an employee who owns the task ([ADR 0010](https://github.com/ferrarolabs/agent-kit/blob/main/docs/decisions/0010-agents-recover-before-they-escalate.md)).

1. **Read the real error.** A status or diagnostic command is not the truth. Confirm with a real call.
2. **Try the alternatives.** Another route (MCP, REST, CLI), another endpoint, another source for the same fact. Keep going while each attempt teaches something.
3. **Fix what's reversible and within the task**, then report it.
4. **Escalate only for what only Elia can do:** a product or scope decision, an approval or merge, a credential or setting you can't reach, an irreversible or outward action the task doesn't cover.
5. **Never come back with just "it doesn't work".** Say what you tried, with the real outputs, the alternative you prepared, one recommendation, and the smallest action Elia has to take.

Never widen your own permissions to get around a block. The repo's rules win where they are stricter.

## Every new issue comes with its Priority
Compute it with [docs/priority.md](https://github.com/ferrarolabs/agent-kit/blob/main/docs/priority.md) in agent-kit. Set the `Priority` field and write the sum on the last line of the body. Never leave it for Elia to guess.

## Improve the harness from what went wrong
jamly is the pilot; agent-kit is where what's proven becomes the standard (agent-kit ADR 0001).

1. While you work, note every friction: a question you had to ask, a guess you had to make, a check that failed late, a step that wasted time.
2. Before you finish, list them in the PR under **Harness notes**. Write "none" if there were none.
3. Each one that could be prevented becomes an issue in `ferrarolabs/agent-kit`, labelled `area:harness`, with its Priority. Say what happened and propose the rule, hook, template or script that prevents it.
4. Don't fix the harness inside a feature PR. One issue, one PR.
