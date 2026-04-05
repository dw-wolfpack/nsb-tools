# Agent charter files (plug-and-play)

Each **`*.json`** is an **NSB agent charter**: metadata, repo context, constraints, and a **`paste_ready_system_prompt`** you can drop into a new Cursor chat (Custom Instructions, composure, or first message).

Markdown mirrors live in **`prompts/`** for the same prompt without opening JSON.

## Charters

| File | Agent | Typical tickets |
|------|-------|-------------------|
| `analytics.json` / `prompts/analytics.md` | Analytics | 001 |
| `entitlements.json` / `prompts/entitlements.md` | Entitlements | 002, 007 |
| `seo.json` / `prompts/seo.md` | Growth / SEO | 003, 009, 010 |
| `conversion.json` / `prompts/conversion.md` | Conversion | 005, 006 |
| `ux-polish.json` / `prompts/ux-polish.md` | UX polish | 011, 018 |
| `ops.json` / `prompts/ops.md` | Ops / reliability | 003, 014, 013 |
| `product-pm.json` / `prompts/product-pm.md` | Product / PM | 004, 012, 015–020 |
| `psychology-perception-meaning.json` / `prompts/psychology-perception-meaning.md` | Behavioral UX (info + meaning) | 011, 018, 021 |
| `psychology-action-memory.json` / `prompts/psychology-action-memory.md` | Behavioral UX (time + memory) | 005, 006, 012, 021 |
| `psychology-ethics-review.json` / `prompts/psychology-ethics-review.md` | Ethics red-team (manipulation, privacy fit) | 005, 006, 012, 001, 021 |
| `psychology-reference.md` | Condensed principle cheat sheet ([source](https://growth.design/psychology)) | (read with psychology charters) |

## How to use (Cursor)

1. Open the charter JSON or `prompts/<agent>.md`.
2. Copy **`paste_ready_system_prompt`** (or the whole `.md` body).
3. Paste at **session start**, then paste **one ticket’s acceptance criteria** from `backlog/tickets/`.
4. Rule from `workstreams-and-agents.md`: **one agent, one ticket, one slice** — refuse scope creep; new work → new ticket.

## Schema

Top-level key is **`NSBAgentCharter`** (parallel idea to `AgentSoulProfile` in your soul contract JSON). Fields:

- `metadata` — id, version, related tickets, repo root path
- `context` — mission, read_first paths, stack facts
- `operating_rules` — always / never / scope
- `session_ritual` — numbered steps for the agent each run
- `deliverables` — what “done” looks like
- `handoff_to_owner` — what Chris must verify
- `paste_ready_system_prompt` — single string for clipboard

## Editing

Bump `metadata.version` and `metadata.last_updated` when you change behavior. Add `related_tickets` as the backlog evolves.
