# UI_UX_SPECIFICATION.md

Kidney Breathalyzer — Design System & UX Guidelines

Version: 1.1 (MVP — aligned with Example UX-UI.png)

---

## Visual Reference

**Primary reference:** `Example UX-UI.png` (project root) — เปิดเทียบก่อน build ทุกหน้า

---

## Design Direction

| Aspect | Specification |
|--------|---------------|
| Theme | พื้นหลังขาวล้วน, สไตล์ Apple Health |
| Dark Mode | เตรียม CSS tokens ไว้ — implement ทีหลัง |
| Accent | Medical Blue ผสมฟ้าทะเลอ่อน |
| Style | Apple Health + Google Fitbit Air — Clean, Medical, Modern |
| Landing | สไตล์ Apple + Stripe — typography ใหญ่, whitespace มาก |
| Language | ภาษาไทยล้วนตอน launch, i18n ทีหลัง |
| Icons | Lucide SVG เท่านั้น — **ห้ามใช้ Emoji** |

---

## Color Tokens

### CSS Variables (`app/globals.css`)

```css
:root {
  --bg-primary: #FFFFFF;
  --bg-surface: #F5F5F7;
  --accent-primary: #2B7FD4;
  --accent-secondary: #7DD3FC;
  --risk-low: #60A5FA;
  --risk-moderate: #3b82f6;
  --risk-high: #1E3A8A;
  --text-primary: #1D1D1F;
  --text-secondary: #86868B;
  --border-subtle: #E5E5EA;
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Dark mode — implement later */
.dark {
  --bg-primary: #000000;
  --bg-surface: #1C1C1E;
  --text-primary: #F5F5F7;
  --text-secondary: #98989D;
}
```

### Usage Guide

| Token | ใช้เมื่อ |
|-------|----------|
| `--bg-primary` | พื้นหลังหน้าหลัก |
| `--bg-surface` | Cards, sections, chart background |
| `--accent-primary` | Primary CTA, active nav, links |
| `--accent-secondary` | Gradients, highlights, secondary buttons |
| `--risk-low` | Risk ต่ำ — ฟ้าอ่อน (monochrome blue scale) |
| `--risk-moderate` | Risk ปานกลาง — ฟ้ากลาง (แยกจาก accent) |
| `--risk-high` | Risk สูง — น้ำเงินเข้ม |
| `--text-primary` | Headings, body text |
| `--text-secondary` | Captions, labels, timestamps |

### Risk Level Labels (ภาษาไทย)

| Level | Label | Color |
|-------|-------|-------|
| `low` | ความเสี่ยงต่ำ | `--risk-low` |
| `moderate` | ความเสี่ยงปานกลาง | `--risk-moderate` |
| `high` | ความเสี่ยงสูง | `--risk-high` |

---

## Typography

### Font

- **Family:** Noto Sans Thai (`next/font/google`)
- **Weights:** 400 (body), 500 (medium), 600 (heading)

### Scale

| Name | Size | Weight | ใช้เมื่อ |
|------|------|--------|----------|
| Hero | 28–32px | 600 | Landing headline |
| Title | 20–22px | 600 | Section titles, page headers |
| Body | 16px | 400 | ข้อความทั่วไป |
| Caption | 13px | 400 | Timestamps, disclaimers, labels |
| Small | 11px | 400 | Tab labels, badges |

### Line Height

- Headings: 1.2
- Body: 1.5
- Caption: 1.4

---

## Spacing & Layout

### Viewport

- **Primary:** 390×844px (iPhone 14)
- **Max width:** 430px centered on larger screens
- **Safe area padding:** 16px horizontal, 24px top, 80px bottom (clear bottom nav)

### Spacing Scale (Tailwind)

| Token | Value | ใช้เมื่อ |
|-------|-------|----------|
| `gap-2` | 8px | ภายใน compact components |
| `gap-4` | 16px | ระหว่าง cards |
| `gap-6` | 24px | ระหว่าง sections |
| `p-4` | 16px | Card padding |
| `p-6` | 24px | Hero card padding |
| `rounded-xl` | 12px | Cards |
| `rounded-2xl` | 16px | Hero cards, modals |
| `rounded-full` | 9999px | Buttons, badges |

---

## Components

### RiskIndicator (หลัก)

แสดงระดับความเสี่ยง — dot + short label (`ต่ำ` / `ปานกลาง` / `สูง`)

- ใช้ใน Dashboard, History, Result, AI Insight
- สีตาม blue scale: `risk-low`, `risk-moderate`, `risk-high`
- **ห้ามใช้** traffic-light (เขียว/ส้ม/แดง)

### RiskBadge (รอง — ไม่ใช้ใน MVP UI)

Pill badge แบบเต็ม — เก็บไว้สำหรับกรณีพิเศษเท่านั้น

### DashboardLatestSection

Section ผลล่าสุดบน Dashboard — `PageSectionHeader` + `RiskScoreCard` + sensor cards คู่

- Card มาตรฐาน `rounded-2xl`, ไม่มี gradient
- ตัวเลขคะแนน `text-3xl` + `RiskIndicator`

### MeasurementStepper

3 ขั้นตอน: เชื่อมต่อ → เป่าลมหายใจ → รอผล

- Step indicator: numbered circles + connecting line
- Active step: `--accent-primary`
- Completed: `--accent-primary` check icon

### TrendChart

Recharts LineChart ใน surface card

- Toggle: 7 วัน / 30 วัน (tabs หรือ segmented control)
- Line color: `--accent-primary`
- Grid: subtle `--border-subtle`
- Tooltip: วันที่ + ค่า

### DisclaimerBanner

แสดงทุกหน้าที่มีผล risk

- Background: `--bg-surface`
- Text: `--text-secondary`, 13px
- Position: bottom of content (above bottom nav ถ้ามี)
- ข้อความมาตรฐาน — ดู section Medical Disclaimer

### AIInsightCard

Card เดียว — ไม่ใช่ chat

- Icon: Lucide `Sparkles` หรือ `Brain` (outline)
- Title: "สรุปจาก AI"
- Body: 2–3 บรรทัด template explanation
- Link: "ดูรายละเอียด" → `/result/:id`

### BottomNav

4 แท็บ — **floating pill capsule** เหนือขอบล่าง

| Tab | Label | Icon (Lucide) | Route |
|-----|-------|---------------|-------|
| 1 | หน้าหลัก | `Home` | `/dashboard` |
| 2 | ประวัติ | `BarChart3` | `/history` |
| 3 | เชิงลึก | `Sparkles` | `/ai-insight` |
| 4 | โปรไฟล์ | `User` | `/profile` |

**หมายเหตุ:** ไม่มี tab "วัดค่า" — การวัดเกิดที่อุปกรณ์ IoT ไม่ใช่ในแอป

- Container: `rounded-full`, `shadow-card`, `backdrop-blur-md`, margin จากขอบล่าง
- Active: `bg-accent-primary/10`, `text-accent-primary`
- Inactive: `text-secondary`
- Label: `text-[10px]` ใต้ไอคอน, touch target 44px min

### StreakCard (P1)

- Title: "สถิติต่อเนื่อง"
- ตัวเลข streak ใหญ่ + "วัน"
- Icon: `Flame` outline

### WeeklyGoalCard (P1)

- Title: "เป้าหมายรายสัปดาห์"
- Progress: "2/3 ครั้ง"
- Progress bar ใต้ตัวเลข

### ChallengeProgressBar (P1)

- Title: "ท้าทาย 14 วัน"
- 14 dots/cells แนวนอน — filled = วันที่วัดแล้ว
- ไม่แสดง negative feedback สำหรับวันที่พลาด

---

## Navigation

### Bottom Tab Bar

ใช้บน route group `(app)` เท่านั้น

**ไม่แสดงบน:** `/`, `/login`, `/register`, `/onboarding`, `/result/[id]`

### Result Page

- Header: back arrow + "ผลการวัด"
- Footer CTA: "กลับหน้าหลัก" → `/dashboard`
- ไม่มี bottom nav

---

## Page Layouts

### Landing (`/`)

สไตล์ Apple + Stripe

```
┌─────────────────────────┐
│                         │
│      [Logo 80px]        │
│                         │
│   Kidney Breathalyzer   │  ← hero 28-32px
│   คัดกรองความเสี่ยง     │  ← tagline 16px secondary
│   โรคไตจากลมหายใจ       │
│                         │
│  ┌───────────────────┐  │
│  │  เริ่มต้นใช้งาน    │  │  ← primary CTA
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │    ดู Demo        │  │  ← secondary/outline CTA
│  └───────────────────┘  │
│                         │
│  [disclaimer caption]   │
└─────────────────────────┘
```

### Dashboard (`/dashboard`) — Apple Health Summary Pattern

เรียงจากบนลงล่าง:

1. **SummaryPageHeader** — "สรุป" + ลิงก์โปรไฟล์ + demo badge
2. **ปักหมุด** — `PinnedHealthCard` × 3 (การคัดกรอง / แอมโมเนีย / อะซิโทน)
3. **ไฮไลต์** — sparkline แนวโน้ม + สรุป AI + DoctorCTA (ถ้ามี)
4. **เพิ่มเติม** — `HealthGroupedCard` (อุปกรณ์, gamification, คู่มือ)
5. **DisclaimerBanner**

Headline หลักใช้คำคุณภาพ (`อยู่ในเกณฑ์ดี` / `ควรติดตาม`) — ตัวเลข ppb อยู่ใน caption

### Result (`/result/:id`)

1. Back link + **resultDetailTitle**
2. **ScreeningHeroSummary** (variant detail) — คำคุณภาพ + ring
3. **ResultSensorRows** — grouped list เซนเซอร์
4. **คำอธิบาย** — AIExplanation
5. **คำแนะนำ** — HealthTips + DoctorCTA
6. **DisclaimerBanner**

### History (`/history`) — P1

1. **SummaryPageHeader** — "ประวัติ"
2. **Filters** — period + risk chips ใน grouped card
3. **Pinned latest** — PinnedHealthCard
4. **รายการวัด** — grouped by day
5. **ไฮไลต์** — TrendChart + TrendChartInsight
6. **DisclaimerBanner**

### Onboarding (`/onboarding`) — P1

1. ข้อมูลส่วนตัว (อายุ, เพศ, น้ำหนัก — ไม่เก็บชื่อ-นามสกุล)
2. Risk factors (checkbox)
3. ยอมรับ medical disclaimer
4. **วิธีใช้อุปกรณ์ IoT** — เป่าที่อุปกรณ์ → รอซิงค์เข้าแอป

---

## Status Components (MVP)

### RiskMeter

- แถบช่วง 3 ระดับ (0–39 / 40–69 / 70–100) + ตัวชี้คะแนน
- **ไม่ใช่** progress bar เป้าหมาย (ต่างจาก Weekly Goal)
- Variants: `full` (การ์ดหลัก), `compact` (ประวัติ)

### SensorStatusPill + SensorLevelBar

| สถานะ | Pill | แถบ |
|--------|------|-----|
| ปกติ | เทา outline | ฟ้าอ่อน |
| สูงกว่าปกติ | ฟ้า filled | ฟ้าหลัก + เส้นเกณฑ์ |

เกณฑ์ PoC: แอมโมเนีย ≥280 ppb, อะซิโทน ≥225 ppb

### SensorEducationSheet

- ไอคอน `CircleHelp` บนการ์ดเซนเซอร์และคะแนนความเสี่ยง
- Bottom sheet อธิบายความหมาย / เกณฑ์อ้างอิง / แหล่งข้อมูล / disclaimer
- หน้า Result: ลิงก์ "ทำความเข้าใจค่าเซนเซอร์และเกณฑ์"

---

## AI Presentation Rules

| ทำ | ไม่ทำ |
|----|-------|
| Insight Card เดียว | Chat interface |
| Template explanation 2–3 บรรทัด | AI avatar |
| หัวข้อ "สรุปจาก AI" | Typing animation |
| Link ไปรายละเอียดเต็ม | Full-screen AI report |

---

## Gamification (P1)

| Feature | Logic | UI |
|---------|-------|-----|
| Healthy Streak | วัด ≥1 ครั้ง/วัน ติดต่อกัน | StreakCard |
| Weekly Goal | เป้าหมาย 3 ครั้ง/สัปดาห์ | WeeklyGoalCard + progress bar |
| 14-Day Challenge | highlight วันที่วัดใน 14 วันล่าสุด | ChallengeProgressBar |

- ไม่ punish ผู้ใช้ที่พลาดวัน
- ไม่ใช้คำว่า "แพ้" หรือ "ล้มเหลว"
- ใช้ภาษาเชิงบวก: "ต่อเนื่อง", "เป้าหมาย", "ความคืบหน้า"

---

## UI Copy (ภาษาไทย)

### Global

| Key | Text |
|-----|------|
| app_name | Kidney Breathalyzer |
| tagline | คัดกรองความเสี่ยงโรคไตจากลมหายใจ |
| cta_start | เริ่มต้นใช้งาน |
| cta_demo | ดู Demo |
| cta_view_report | ดูรายงาน |
| cta_back_home | กลับหน้าหลัก |
| cta_doctor | พบแพทย์ |
| cta_view_detail | ดูรายละเอียด |

### Device Status

| Status | Label |
|--------|-------|
| connected | เชื่อมต่อแล้ว |
| disconnected | ไม่ได้เชื่อมต่อ |
| demo | โหมดสาธิต |

### Measurement Steps

| Step | Label |
|------|-------|
| 1 | เชื่อมต่ออุปกรณ์ |
| 2 | เป่าลมหายใจ |
| 3 | รอผลการวิเคราะห์ |

### Mock Mode

| Key | Text |
|-----|------|
| device_status_demo | โหมดสาธิต |
| last_sync_label | ซิงค์ล่าสุด |

### AI Section

| Key | Text |
|-----|------|
| ai_title | สรุปจาก AI |
| ai_subtitle | การวิเคราะห์เบื้องต้นจากข้อมูลการวัด |

### Gamification (P1)

| Key | Text |
|-----|------|
| streak_title | สถิติต่อเนื่อง |
| streak_unit | วัน |
| weekly_goal_title | เป้าหมายรายสัปดาห์ |
| weekly_goal_unit | ครั้ง |
| challenge_title | ท้าทาย 14 วัน |

---

## Medical Disclaimer

ข้อความมาตรฐาน — ใช้ทุกหน้าที่แสดงผล risk:

> ผลลัพธ์จากระบบนี้เป็นเพียงการคัดกรองความเสี่ยงเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยโรค ผู้ใช้งานควรปรึกษาแพทย์หากมีข้อสงสัยหรือได้รับการแจ้งเตือนความเสี่ยง

---

## Logo

### Requirements

- Icon ล้วน ไม่มีข้อความ
- สไตล์ iOS app icon (squircle)
- Medical blue + sea blue gradient
- เก็บที่ `public/logo.png` (512px), `public/icon-192.png`

### Image AI Prompt (หลัก)

```
iOS app icon design, single centered symbol, no text, no letters.
A minimalist medical app icon combining a stylized kidney shape with a gentle breath/wind wave flowing through it.
Medical blue (#2B7FD4) and soft sea blue (#5BB5E8) gradient on pure white background.
Clean flat vector style, Apple Health aesthetic, rounded squircle icon format.
Subtle depth, soft shadow, professional healthcare feel.
Modern, trustworthy, preventive health screening device.
No emoji, no photorealistic details, no clutter.
1024x1024, high resolution, app store ready.
```

---

## Component States

### Loading

- Apple-style skeleton: `--bg-surface` animated pulse
- ใช้บน Dashboard cards, chart, measurement

### Empty

- Icon (Lucide outline) + ข้อความ + optional CTA
- ตัวอย่าง: "ยังไม่มีข้อมูลการวัด" + ปุ่ม "วัดค่าใหม่"

### Error

- ข้อความสั้น + ปุ่ม "ลองอีกครั้ง"
- สี: `--risk-high` สำหรับ icon เท่านั้น ไม่ใช่ background ทั้งหน้า

---

## Buttons

| Variant | Style |
|---------|-------|
| Primary | `bg-accent-primary text-white rounded-full h-12 px-6` |
| Secondary | `border border-accent-primary text-accent-primary rounded-full h-12` |
| Ghost | `text-accent-primary` no background |
| Danger | `bg-risk-high text-white` — ใช้เฉพาะ "พบแพทย์" CTA |

### Primary CTA บน Dashboard

- Full width, height 52px
- Label: "วัดค่าใหม่"
- Icon: `Wind` ด้านซ้าย

---

## Constraints

1. **ห้ามใช้ Emoji** ทุกที่ใน UI
2. ใช้คำว่า **"คัดกรองความเสี่ยง"** ไม่ใช่ "ตรวจโรค" หรือ "วินิจฉัย"
3. Disclaimer บังคับทุกหน้าที่แสดง risk level
4. Mobile-first — ไม่ต้อง perfect บน desktop
5. Touch targets ≥ 44px

---

## Related Docs

- [TECH_STACK.md](./TECH_STACK.md)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [PRODUCT_REQUIREMENT_DOCUMENT.md](./PRODUCT_REQUIREMENT_DOCUMENT.md)
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
