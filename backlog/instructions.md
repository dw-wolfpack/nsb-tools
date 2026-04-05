# NSB backlog — how to run tickets + agents + charters

This file is the **operating playbook** for `backlog/`. (Extension `.mf` = markdown fragment / plain playbook text; open in any editor — same conventions as `.md`.)

---

## 1. What lives here (mental model)

| Layer | Purpose |
|-------|---------|
| **Strategy** | `north-star.md`, `staff-pm-system-audit.md` |
| **Cadence** | `active-priorities.md`, `metrics-scorecard.md`, `workstreams-and-agents.md`, TICKET-020 |
| **Execution** | `tickets/*.md` — one piece of work, acceptance criteria, status |
| **Agents** | `charterfile/*.json` + `charterfile/prompts/*.md` — reusable Cursor “modes” |
| **Catalog** | `charterfile/manifest.json` — machine list of charters for your own tooling |
| **Behavioral** | `charterfile/psychology-*.json`, `psychology-reference.md` |

The live site repo (`tools/`, `assets/js/`, etc.) is **not** the backlog; the backlog **drives** what you change there.

---

## 2. Weekly rhythm (minimum)

1. Open **`metrics-scorecard.md`** — fill what you can; note N/A honestly.
2. Open **`active-priorities.md`** — confirm **max 3** items **in progress**.
3. **TICKET-020:** calendar block sticks; pick **one bet** for the week.
4. When something ships: set ticket **`Status: done`** (or move to `tickets/done/` if you add that folder).

---

## 3. Starting a work session (ticket + agent)

### Step A — Pick one ticket

1. Open **`tickets/README.md`** for the index, or **`active-priorities.md`** for the current slice.
2. Choose **one** ticket with **`ready`** or **`in_progress`**.
3. Read **Problem**, **Outcome**, **Acceptance criteria** end-to-end.

**Rule:** one ticket per agent session (unless the ticket explicitly batches). New scope → new ticket or update acceptance criteria consciously.

### Step B — Pick the charter (agent)

1. **`workstreams-and-agents.md`** maps work types to agent names.
2. **`charterfile/README.md`** maps agents to **JSON + prompt file** and typical ticket IDs.
3. Open either:
   - **`charterfile/prompts/<agent>.md`** — fastest copy-paste, or  
   - **`charterfile/<name>.json`** — full ritual, `read_first`, `operating_rules`, `paste_ready_system_prompt`.

**Manifest for automation:** `charterfile/manifest.json` lists `id`, `file`, `prompt_md` per charter so you can load JSON from another tool pipeline.

### Step C — Cursor (or any LLM) session

1. **New chat** (or composer scoped to repo).
2. Paste the **paste-ready prompt** (from the `.md` file or the JSON field `NSBAgentCharter.paste_ready_system_prompt`).
3. Paste the **full acceptance criteria** section from the ticket (or the whole ticket).
4. Paste **paths to touch** if you already know them (e.g. `pro/index.html`, slug under `tools/`).
5. Tell the model to **run** `npm test` and `npm run precommit` when changing shipped code.

### Step D — Behavioral / ethics sequence (when relevant)

For UX that affects comprehension or money paths (often **TICKET-011, 005, 006, 021**):

1. **`psychology-perception-meaning`** — information + meaning (load, clarity, mental model).
2. **`psychology-action-memory`** — action + memory (feedback, limits, peak-end, chunking).
3. **`psychology-ethics-review`** — red team: Block / Fix / Watch; **no open Block** without written accept.

Read **`charterfile/psychology-reference.md`** before or during; cite principle **names** in PR/ticket notes.

### Step E — Close the loop

1. Check off acceptance criteria on the ticket; set **`Status: done`** when fully satisfied.
2. Update **`metrics-scorecard.md`** if a metric definition changed or you have new numbers.
3. If work birthed follow-ups, add tickets (`tickets/_template.md`) and link from **`active-priorities.md`** if needed.
4. **CHANGELOG** / user-facing summary: use **TICKET-017** habit when appropriate.

---

## 4. File conventions

| Item | Convention |
|------|------------|
| Ticket status | First lines: `**Status:** draft \| ready \| in_progress \| blocked \| done` |
| New ticket | Copy `tickets/_template.md`; add row to `tickets/README.md` |
| Charter version bump | In JSON: `metadata.version` + `metadata.last_updated` |
| Principles / ethics | Name the principle (Growth Design / red-team) in ticket or PR comment |

---

## 5. What to leverage beyond tickets

| Asset | When to use |
|-------|-------------|
| **`north-star.md`** | Reprioritize; check if work ladders to post-tax/fees goal |
| **`staff-pm-system-audit.md`** | Quarterly or when stuck — find the real bottleneck |
| **`metrics-scorecard.md`** | Leading indicators before revenue moves |
| **`charterfile/manifest.json`** | Scripts, Cursor rules, or “orchestrator” that picks charters by id |
| **Soul-style profiles** | Your personal `agent_soul_profile_*.json` is **you**; NSB charters are **execution roles** — paste both only when the session needs personal decision style + NSB constraints |
| **CI** | Repo root `npm test` + SEO scripts — don’t merge without green |
| **`docs/` + site FAQ/terms/privacy`** | Ethics charter cross-checks claims vs reality |

---

## 6. Anti-patterns (save future you)

- Running three agents on three tickets in one messy thread — **split chats**.
- Merging Pro/checkout/analytics changes **without** ethics pass when the ticket calls for it.
- Tickets with no acceptance criteria — refuse; use `_template.md`.
- Charters that grow forever — bump version or **split** a new charter id instead of one mega JSON.

---

## 7. Quick links

- Ticket index: `tickets/README.md`
- Agent index: `charterfile/README.md` + `charterfile/manifest.json`
- Workstreams: `workstreams-and-agents.md`
- Focus: `active-priorities.md`
- North star: `north-star.md`

Backlog folder overview: `README.md` (short index — this file is the **detailed** usage guide).
