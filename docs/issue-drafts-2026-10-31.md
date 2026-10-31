# Issue drafts — 2026-10-31

The cloud session that wrote these could read GitHub but not write to it, so they are drafts. Publish them, then delete this file.
Links to issues that already exist use their name.

---

## 1. Cloud sessions: a working `gh`, as on Elia's machine
Labels: `type:chore`, `needs:elia` · Milestone: Phase 1

**Context.** `gh` is installed in cloud sessions, but its `GH_TOKEN` is not valid. The project and label scripts can't run from the cloud.

**What.**
- A fine-grained token for the `ferrarolabs` org with Issues, Pull requests and Projects read/write, plus Contents read.
- Stored in the cloud environment settings as a secret named `GH_TOKEN`. Never pasted in chat.

**Done when** `gh auth status` passes in a new cloud session, and `gh project list --owner ferrarolabs` lists the projects.

---

## 2. An agent starts on its own when an issue gets `agent:ready`
Labels: `type:feature`, `area:harness` · Milestone: Phase 3

**Context.** Today `agent:ready` is a convention. Nothing listens to it: Elia still opens a session and asks.

**What.** Something that notices the label and starts a cloud session on that issue. It also adds `agent:working`.

**Open question for Elia.** Which trigger?
- (a) A cloud scheduled task that looks for `agent:ready` issues every hour. Simple, but up to an hour late.
- (b) A GitHub Action on the `labeled` event. Immediate, but it runs in Actions, not in a cloud session, and needs its own Claude credentials.

**Done when** labelling a test issue `agent:ready` leads to a PR with no chat opened by Elia.

**Depends on** "resume-work skill: pick up from progress.md, idempotently" and "Scheduled cloud task that resumes work after usage limits".

---

## 3. Decide: when Stage and Status differ, which one wins?
Labels: `type:docs`, `needs:elia` · Milestone: Phase 1

**Question.** The reconciler finds Stage = *Ready* and Status = *In progress*. Which value does it keep?

**Recommendation.** The one changed most recently. Both sides carry an update time. On a tie, Stage wins, because agents can see it.

**Done when** the answer is in ADR 0009.

---

## 4. Decide: do agent labels still drive Stage?
Labels: `type:docs`, `needs:elia` · Milestone: Phase 1

**Question.** Today the labels (`agent:ready`, `agent:working`, `needs:*`) drive Status. With Stage on the issue, there are three copies of one fact.

**Options.**
- (a) Labels drive Stage; Stage drives Status. The labels stay the agents' handshake.
- (b) Stage replaces the agent labels. One source, but every rule and doc that names a label changes.

**Recommendation.** (a) for now. Revisit after the cloud test of issue fields.

**Done when** the answer is in ADR 0009.

---

## 5. Decide: is "Device check" a generic Status?
Labels: `type:docs`, `needs:elia` · Milestone: Phase 1

**Question.** *Device check* exists because jamly is a mobile app. The template must work for any project.

**Options.**
- (a) Rename it *Manual check*, so it fits any project.
- (b) Remove it from the template; jamly adds it on top.

**Recommendation.** (a): every project has some check that only Elia can do.

---

## 6. Decide: Effort values
Labels: `type:docs`, `needs:elia` · Milestone: Phase 1

**Question.** Effort is in the template, but its values are written nowhere.

**Recommendation.** S and M only. An L becomes a parent issue with sub-issues (board design §3.4).

---

## 7. Move the project's number fields to org issue fields, and add Stage
Labels: `type:feature`, `area:harness` · Milestone: Phase 1

**What.** Create the org issue fields Cost $, Opus share %, Waited on me (h) and Stage. Stage takes the same values and colours as Status. Update `project-template.json` and `build-project.js`. `--check` reports a project number field that should be an issue field.

**Done when** `--check` passes on the template and fails on a project that still has its own number field.

**Depends on** "Test: can a cloud session read and set issue fields?" and drafts 3–6.

---

## 8. Stage ⇄ Status reconciler, every 10 minutes
Labels: `type:feature`, `area:harness` · Milestone: Phase 1

**What.** A GitHub Action in agent-kit, on a 10-minute schedule. For every registered project: where Stage and Status differ, apply the rule from draft 3. Log each change in the run summary.

**Done when**
- Changing Status by hand changes Stage within 20 minutes, and the other way round.
- Seen failing: with the token revoked, the run goes red.

**Depends on** draft 7; "Project sync: apply the template spec to every org project, on change and nightly" (it holds the project registry).

---

## 9. Completeness check: no open issue without its data
Labels: `type:feature`, `area:harness` · Milestone: Phase 2

**What.** Nightly: list open issues with no Priority, Effort, Stage or milestone. Post the list as one `needs:elia` issue, updated in place, and close it when the list is empty.

**Done when** an issue created with no Priority shows up the next morning, and the report closes once the field is set.

---

## Comment for "Install the Claude GitHub App on the ferrarolabs organization"
Checked on 2026-10-31 from a cloud session: reading issues works, but `git push`, creating a PR and creating an issue all return 403 "Resource not accessible by integration". The app still needs installing on the org, with write access.
