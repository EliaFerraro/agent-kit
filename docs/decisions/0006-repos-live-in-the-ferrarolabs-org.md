# 0006 · Repos live in the `ferrarolabs` organization

**Status:** accepted · 2026-10-30

## Context
The [board design](../project-boards.md) found that several things the harness needs exist only for organizations, on the Free plan too:
- **Issue fields**: Priority, Effort and dates stored on the issue, readable by agents over REST, shown as project columns. On a personal account that state can only be a label.
- **Issue types** (Feature, Bug, Task) instead of `type:*` labels.
- **Project templates**.
- **Fine-grained tokens** for project automation. On a personal account it needs a classic token with the `project` scope.

It also gives collaborators per-repo permissions, if someone ever joins.

## Decision
A free organization, `ferrarolabs`, owns jamly, agent-kit and future projects. Both repos were transferred on 2026-10-30. Labels, issues, milestones, branches, rulesets and repo settings were compared before and after: identical. Local remotes point to the new URLs; GitHub redirects the old ones.

## Consequences
- The Claude GitHub App and the cloud environments are installed for `ferrarolabs`, not the personal account.
- Whether a cloud session can read and set issue fields is still to be tested. If it can't, labels stay the agents' state and the org still pays for templates and tokens.
- For the portfolio, the repos are pinned on the personal profile, and membership of the org is public.
- The org can be renamed. Repo URLs redirect, but the old name becomes free for anyone to take, so renaming is rare.
