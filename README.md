# CampusConnect ⚡

**Automated Campus Ambassador Management Platform**

Built for the AICore Connect Hackathon by UnsaidTalks Education.

---

## What is CampusConnect?

CampusConnect is a full-stack platform that transforms how organizations manage campus ambassador programs. Instead of spreadsheets and scattered WhatsApp groups, organizations get a centralized dashboard to assign tasks, track submissions, auto-score performance with AI, and gamify the entire experience with points, badges, and leaderboards.

**For Organizations:**
- Create and manage ambassador tasks (referrals, content, events, promotions)
- Review proof submissions with AI-powered quality scoring
- Track ambassador performance on a real-time leaderboard
- Approve/reject submissions with one click

**For Ambassadors:**
- Browse and complete assigned tasks
- Submit proof of completion with supporting links
- Earn points and climb the leaderboard
- Unlock 6 achievement badges (First Task, Rising Star, Referral King, Content Creator, Top Performer, Week Streak)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Supabase (Auth + PostgreSQL + Row Level Security) |
| AI Scoring | OpenRouter API (GPT-4o) |
| Deployment | Vercel |

---

## Features

### Core Platform
- 🔐 **Role-based Auth** — Org admins and ambassadors with separate dashboards
- 📋 **Task Management** — Create, assign, and close tasks with types, points, and deadlines
- 📤 **Proof Submission** — Ambassadors submit text + link proof for each task
- 🤖 **AI Auto-Scoring** — Submissions scored 0-100 by GPT-4o with written feedback
- 🏆 **Leaderboard** — Real-time ranking by total points earned
- 🎖️ **Badge System** — 6 achievement badges with automatic award logic
- 📊 **Points Engine** — Points = (AI score / 100) × task value, logged with history

### Design
- 🌑 Dark glassmorphism UI with electric indigo accent
- ✨ Framer Motion animations (fade-up, hover lift, number counters)
- 📱 Mobile responsive with collapsible sidebar navigation
- 💎 Premium aesthetic — no generic colors, no placeholder content

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                         # Landing page
│   ├── auth/page.tsx                    # Login + Signup
│   ├── org/
│   │   ├── dashboard/page.tsx           # Org overview
│   │   ├── tasks/page.tsx               # Task management
│   │   ├── ambassadors/page.tsx         # Ambassador list
│   │   └── leaderboard/page.tsx         # Org leaderboard
│   ├── ambassador/
│   │   ├── dashboard/page.tsx           # Ambassador home
│   │   ├── tasks/page.tsx               # Task list
│   │   ├── tasks/[id]/page.tsx          # Task detail + proof
│   │   ├── achievements/page.tsx        # Badges + points
│   │   └── leaderboard/page.tsx         # Ambassador leaderboard
│   └── api/score-submission/route.ts    # AI scoring endpoint
├── components/
│   ├── layout/     (Navbar, OrgSidebar, AmbassadorSidebar)
│   ├── dashboard/  (StatsCard, Leaderboard, TaskCard, BadgeShelf, PointsChart, ActivityFeed)
│   └── forms/      (CreateTaskForm, ProofSubmissionForm)
└── lib/
    ├── supabase.ts  # Client init + type definitions
    ├── db.ts        # All database operations
    ├── points.ts    # Points engine + processing
    └── badges.ts    # Badge award logic (6 conditions)
```

---

## Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User data — name, email, role (org/ambassador), org_id |
| `organizations` | Org name, description, creator |
| `tasks` | Task title, description, type, points, deadline, status |
| `submissions` | Proof text, proof URL, AI score, AI feedback, status |
| `points_log` | Points awarded per action with reason |
| `badges` | Badge type + ambassador + award timestamp |

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Badge System

| Badge | Condition |
|---|---|
| 🎯 First Task | Complete 1 task |
| ⭐ Rising Star | Earn 100+ points |
| 👑 Referral King | Complete 3 referral tasks |
| ✍️ Content Creator | Complete 3 content tasks |
| 🏆 Top Performer | Reach #1 on leaderboard |
| 🔥 Week Streak | Submit tasks 7 days in a row |

---

## AI Scoring

Submissions are scored via `POST /api/score-submission`:

1. Fetches submission + task details from Supabase
2. Sends task description + proof text to GPT-4o via OpenRouter
3. Returns `{ score: 0-100, feedback: string }`
4. Points awarded = `(score / 100) × task.points_value`
5. Automatically triggers badge checks after points are awarded

---

## Team

**UnsaidTalks Education** — AICore Connect Hackathon 2026

---

## License

This project was built for a hackathon submission. All rights reserved.
