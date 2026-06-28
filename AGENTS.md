# AGENTS.md

Instructions for AI assistants working on Kidney Breathalyzer

---

## Project Summary

**Kidney Breathalyzer** is a mobile-first web app (Next.js) for **kidney disease risk screening** via breath analysis. It is a Hackathon PoC — not a certified medical device.

**Goal:** Judges open a URL and can demo the full flow without real hardware (Mock Mode).

---

## Critical Rules

### Medical Language

1. Always use **"คัดกรองความเสี่ยง"** (risk screening) — NEVER **"วินิจฉัยโรค"** (diagnose disease)
2. AI provides **general health information** — not medical diagnosis or treatment
3. Include the **medical disclaimer** on every page that shows risk results
4. High risk → suggest seeing a doctor, never claim the user has kidney disease

### Standard Disclaimer (copy-paste)

```
ผลลัพธ์จากระบบนี้เป็นเพียงการคัดกรองความเสี่ยงเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยโรค ผู้ใช้งานควรปรึกษาแพทย์หากมีข้อสงสัยหรือได้รับการแจ้งเตือนความเสี่ยง
```

### UI Rules

- **No Emoji** anywhere in the UI — use Lucide SVG icons only
- UI language: **Thai** (default), prepare i18n for English later
- Follow [Docs/UI_UX_SPECIFICATION.md](Docs/UI_UX_SPECIFICATION.md) for colors, components, copy

---

## Build Order

Build in this priority — do not skip ahead:

| Priority | Pages / Features |
|----------|------------------|
| **P0** | Landing, Dashboard, Device Sync display, Result + AI Explanation |
| **P1** | History, Onboarding, Gamification widgets |
| **P2** | Login/Register, Profile, Supabase Auth |

### P0 Checkpoint

Judge can: open URL → click "ดู Demo" → see dashboard with preloaded device data → history → result + AI explanation

**Architecture:** Measurement happens on the IoT device (ESP32). The web app is a **companion** that displays synced data — it does not initiate breath measurement from the UI.

---

## Technical Constraints

- **MVP AI:** Rule-based scoring only — no ML models ([PRD section 4](Docs/PRODUCT_REQUIREMENT_DOCUMENT.md))
- **Demo Mode must work** without hardware and without Supabase credentials
- **Do not over-engineer:** no Redux, no Zustand, no separate backend server
- **Stack is locked:** see [Docs/TECH_STACK.md](Docs/TECH_STACK.md)
- **File structure:** see [Docs/FOLDER_STRUCTURE.md](Docs/FOLDER_STRUCTURE.md)

---

## Code Conventions

| Item | Convention |
|------|------------|
| Components | PascalCase files, feature folders |
| Utils / lib | kebab-case or camelCase |
| DB columns | snake_case |
| Comments | English OK |
| UI text | Thai |
| Imports | `@/` alias |

### Architecture

- Business logic in `lib/` — not in components or pages
- Pages are thin — compose components + fetch data
- API routes call `lib/` functions — no duplicated logic

---

## Key Docs (read before coding)

| Doc | Purpose |
|-----|---------|
| [Docs/PROJECT_CONTEXT.md](Docs/PROJECT_CONTEXT.md) | Vision, scope, medical context |
| [Docs/PRODUCT_REQUIREMENT_DOCUMENT.md](Docs/PRODUCT_REQUIREMENT_DOCUMENT.md) | Pages, API, DB schema, scoring |
| [Docs/TECH_STACK.md](Docs/TECH_STACK.md) | Locked tech decisions |
| [Docs/FOLDER_STRUCTURE.md](Docs/FOLDER_STRUCTURE.md) | Where files go |
| [Docs/UI_UX_SPECIFICATION.md](Docs/UI_UX_SPECIFICATION.md) | Design system, copy, components |

---

## What NOT to Do

- Claim the system can diagnose disease
- Use ML models in MVP
- Use Emoji in UI
- Build P2 auth before P0 demo flow works
- Add features not in PRD without user approval
- Store real names (PDPA — no ชื่อ-นามสกุล)
- Invent Thai UI copy — use strings from UI_UX_SPECIFICATION.md

---

## Mock Mode Requirements

- Demo account: **30 days pre-loaded history**, alternating risk levels (no in-app measurement UI)
- Device status badge shows **"โหมดสาธิต"** on dashboard when in demo mode
- Landing **"ดู Demo"** button bypasses login
- New readings in production come from **ESP32 via `POST /api/device/ingest`** — not from the app UI
- `POST /api/mock/generate` is dev/firmware testing only (not exposed in UI)

---

## Gamification (P1 only)

- Healthy Streak: consecutive days with ≥1 measurement
- Weekly Goal: 3 measurements per week
- 14-Day Challenge: visual progress, no punishment for missed days
- Positive language only

---

## When Adding Features

1. Check it aligns with [Docs/PROJECT_CONTEXT.md](Docs/PROJECT_CONTEXT.md) scope
2. Update relevant Doc if the decision affects other agents
3. Follow build priority (P0 → P1 → P2)
4. Keep changes minimal and focused
