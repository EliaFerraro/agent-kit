# 0005 · The kit is public, under MIT

**Status:** accepted · 2026-10-30

## Context
The kit is meant to be reused in any project, and it is also how I show the way I work. A private repo can be shown to nobody. Under GitHub Free, a private repo also gets no branch protection.

The pilot, jamly, is public but all rights reserved: it may become a product. The kit is the opposite case: its value is in being copied.

## Decision
The repo is public, under the MIT licence. Before going public, the full history was scanned for secrets: none.

## Consequences
- Anyone can read, copy and adapt the kit, as long as they keep the copyright notice.
- Nothing private goes into this repo: no credentials, no client or employer details, nothing about jamly that jamly itself doesn't make public.
- Issues from strangers are untrusted input. Agents act only on what I label.
- Branch protection on `main` becomes available. It goes on in the same way as jamly's.
