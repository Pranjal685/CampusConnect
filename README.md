# CampusConnect ⚡
### Automated Campus Ambassador Management Platform

> Built for the **AICore Connect Hackathon 2026** by UnsaidTalks Education

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📹 Demo Video

> **🎬 https://drive.google.com/file/d/1uc24Lk53w09CQv3Vz_rydb5zkvL0Fwlm/view?usp=sharing**

---

## 🚀 Live Demo

> **🌐 https://campus-connect-one-wheat.vercel.app/**

---

## 🧩 The Problem

Organizations running Campus Ambassador (CA) programs are stuck in 2015 — managing everything through WhatsApp groups, spreadsheets, and manual Google Forms. The result?

| Pain Point | Impact |
|---|---|
| No single source of truth | Managers overwhelmed, data scattered |
| No structured task system | Ambassadors confused about expectations |
| Zero gamification | 60%+ ambassador drop-off within 2 months |
| No performance visibility | Organizations can't measure ROI |

**Valuable ambassadors disengage. Organizations lose the ability to scale.**

---

## 💡 The Solution — CampusConnect

A centralized platform that turns a fragmented CA program into a **structured, scalable, self-sustaining growth engine.**

```
Organization creates tasks → Ambassador completes & submits proof
       → AI auto-scores quality → Points awarded automatically
              → Badges unlocked → Leaderboard updates in real-time
```

---

## ✨ Key Features

### 🏢 For Organizations
- **Task Management** — Create tasks with type, points value, and deadline
- **AI-Powered Review** — GPT-4o scores every submission 0–100 with written feedback
- **One-Click Approve/Reject** — With instant points calculation
- **Real-Time Leaderboard** — Surface top performers instantly
- **ROI Dashboard** — See points distributed, submission rates, engagement trends

### 🎓 For Ambassadors
- **Task Discovery** — Browse all active tasks with deadlines and points
- **Proof Submission** — Submit text description + proof link per task
- **Points Engine** — Earn points = (AI score / 100) × task value
- **Badge System** — 6 achievement badges with automatic unlock logic
- **Streak Tracker** — Maintain daily submission streaks
- **Live Leaderboard** — See your rank among all ambassadors

---

## 🤖 AI Auto-Scoring

The standout feature. Every ambassador submission is automatically evaluated by GPT-4o via OpenRouter:

1. Ambassador submits proof text + optional URL
2. System sends task context + submission to GPT-4o
3. AI returns `{ score: 0-100, feedback: string }` in under 3 seconds
4. Points = `Math.round((score / 100) × task.points_value)`
5. Badge check triggered automatically after points are awarded

**Example AI feedback:**
> *"Strong submission with clear evidence of task completion. The Instagram post shows good engagement and proper brand tagging. Consider adding more context about reach metrics next time. Score: 82/100"*

---

## 🏆 Badge System

| Badge | Condition | Type |
|---|---|---|
| 🎯 First Task | Complete your first task | Milestone |
| ⭐ Rising Star | Earn 100+ total points | Points |
| 👑 Referral King | Complete 3 referral tasks | Type-based |
| ✍️ Content Creator | Complete 3 content tasks | Type-based |
| 🏆 Top Performer | Reach #1 on leaderboard | Rank |
| 🔥 Week Streak | Submit on 7 consecutive days | Consistency |

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components, fast routing |
| Language | TypeScript | Type safety, no runtime surprises |
| Styling | Tailwind CSS + shadcn/ui | Rapid, consistent UI |
| Animations | Framer Motion | Smooth, professional feel |
| Charts | Recharts | Lightweight dashboard charts |
| Database | Supabase (PostgreSQL) | Real-time, auth built-in, RLS security |
| AI Scoring | OpenRouter (GPT-4o) | Best quality submission evaluation |
| Deployment | Vercel | Zero-config, instant CI/CD |

---

## 🗄️ Database Schema

```sql
profiles       → id, full_name, email, role, org_id, avatar_url
organizations  → id, name, description, logo_url, created_by
tasks          → id, org_id, title, description, task_type, 
                 points_value, deadline, status
submissions    → id, task_id, ambassador_id, proof_text, proof_url,
                 status, ai_score, ai_feedback, submitted_at
points_log     → id, ambassador_id, points, reason, task_id
badges         → id, ambassador_id, badge_type, awarded_at
```

---

## 🔐 Security

- **Row Level Security (RLS)** — Supabase policies enforce org isolation
- **Role-based middleware** — Next.js middleware protects all dashboard routes
- **Server-side API keys** — `OPENROUTER_API_KEY` never exposed to client
- **Parameterized queries** — All DB calls via Supabase SDK (no raw SQL)
- **Idempotent scoring** — Submissions cannot be AI-scored twice
- **Auth-protected API routes** — Score endpoint requires valid session
- **Generic error messages** — Internal errors never leaked to UI

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── auth/page.tsx                     # Login + Signup
│   ├── org/
│   │   ├── dashboard/page.tsx            # Org overview + analytics
│   │   ├── tasks/page.tsx                # Task CRUD
│   │   ├── ambassadors/page.tsx          # Ambassador management
│   │   └── leaderboard/page.tsx          # Org leaderboard
│   ├── ambassador/
│   │   ├── dashboard/page.tsx            # Ambassador home
│   │   ├── tasks/page.tsx                # Task list
│   │   ├── tasks/[id]/page.tsx           # Task detail + proof submission
│   │   ├── achievements/page.tsx         # Badges + points history
│   │   └── leaderboard/page.tsx          # Live leaderboard
│   └── api/score-submission/route.ts     # AI scoring endpoint
├── components/
│   ├── layout/      → Navbar, OrgSidebar, AmbassadorSidebar
│   ├── dashboard/   → StatsCard, Leaderboard, TaskCard,
│   │                  BadgeShelf, PointsChart, ActivityFeed
│   └── forms/       → CreateTaskForm, ProofSubmissionForm
└── lib/
    ├── supabase.ts  → Client init + TypeScript types
    ├── db.ts        → All 20 database operations
    ├── points.ts    → Points engine + AI score scaling
    └── badges.ts    → 6 badge conditions with dedup logic
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- A Supabase project
- An OpenRouter API key

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/campus-connect.git
cd campus-connect

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your keys (see below)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database Setup

Run the following in your Supabase SQL editor to create all tables:

```sql
-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('org', 'ambassador')),
  org_id UUID,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT CHECK (task_type IN ('referral','content','promotion','event')),
  points_value INTEGER DEFAULT 100,
  deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  ambassador_id UUID REFERENCES profiles(id),
  proof_text TEXT,
  proof_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  ai_score INTEGER,
  ai_feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Points Log
CREATE TABLE points_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ambassador_id UUID REFERENCES profiles(id),
  points INTEGER NOT NULL,
  reason TEXT,
  task_id UUID REFERENCES tasks(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ambassador_id UUID REFERENCES profiles(id),
  badge_type TEXT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 Design System

- **Theme:** Dark glassmorphism — deep navy background, frosted glass cards
- **Accent:** Electric indigo — used only on CTAs, active states, chart lines
- **Typography:** Inter — tight hierarchy, large metric numbers
- **Animations:** Framer Motion — fade-up entrances, hover lifts, number counters
- **Responsive:** Mobile-first, collapsible sidebar on small screens

---

## 🏗️ Architecture Decisions

**Why Supabase over Firebase?**
PostgreSQL gives us proper relational queries — the leaderboard, org-scoped data isolation, and points aggregation all benefit from real joins and RLS policies.

**Why OpenRouter over direct OpenAI?**
Model flexibility. OpenRouter lets us swap to Claude or Gemini without code changes if GPT-4o rate limits hit during peak usage.

**Why Next.js App Router?**
Server components handle all data fetching — no API layer needed for reads. The client stays lightweight, animations stay smooth.

---

## 👥 Team

Built solo for the **AICore Connect Hackathon 2026**
Organized by **UnsaidTalks Education** — [unsaidtalks.com](https://unsaidtalks.com)

---

## 📄 License

Built for hackathon submission. All rights reserved © 2026.
