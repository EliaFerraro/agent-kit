# How Priority is computed

[ADR 0008](decisions/0008-numeric-priority-and-projects-from-the-template.md) makes Priority a number from 1 to 100, 100 = do first, one scale for the whole org. This is how an agent proposes it. Elia overrides any value; the override wins.

## The sum

| Part | Points |
|---|---|
| **Phase** (from [ROADMAP](ROADMAP.md)) | On the current phase's exit path **60** · current phase, not on the exit path **40** · next phase **20** · later **0** |
| **Unblocks** | **+5** per open issue that waits on this one, at most **+15** |
| **Value or risk** | Security or data loss **+15** · user-visible in the current release **+10** · makes agents or Elia faster **+5** · comfort **0** |
| **Effort** | Low **+5** · Medium **0** · High **−5** |
| **Parked** | Elia said "when it's needed": capped at **30** |

Then: clamp to 1–100, and move to the nearest free number so no two open issues tie.

## Where it's written
- The value goes in the `Priority` field.
- The sum goes on one line at the end of the issue body: `**Priority 86** = exit path 60 + unblocks 10 + user-visible 10 + low effort 5, +1 to avoid a tie`.
- When the roadmap's phase changes, the scale is recomputed.
