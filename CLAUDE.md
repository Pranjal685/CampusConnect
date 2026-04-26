# CampusConnect — CLAUDE.md

## What This Project Is
CampusConnect is an Automated Campus Ambassador Management Platform 
built for the AICore Connect Hackathon by UnsaidTalks Education.
Deadline: 26th April 2026, 6:00 PM IST.

Organizations use this to manage campus ambassador programs.
Ambassadors use this to complete tasks, earn points, and get recognized.

---

## Tech Stack
- Framework: Next.js 14, App Router, TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Animations: Framer Motion
- Charts: Recharts
- Icons: Lucide React
- Backend: Supabase (auth + postgres + storage)
- Deployment: Vercel

---

## Design System
- Theme: Dark glassmorphism
- Background: Deep dark navy/near-black with fixed radial blob glows
- Cards: Glass effect — backdrop-blur, low opacity white bg, thin white border
- Accent: Single electric indigo/violet — used ONLY on CTAs, active states, 
  chart lines, points badges
- Font: Inter
- Spacing: Compact and dense — no excessive whitespace
- Animations: Subtle only — fade-up entrance, hover lift, number counters

---

## Project Structure
/app
  /page.tsx                        → Public landing page
  /auth/page.tsx                   → Login + Signup with role selection
  /org/dashboard/page.tsx          → Org overview
  /org/tasks/page.tsx              → Task management
  /org/ambassadors/page.tsx        → Ambassador management
  /org/leaderboard/page.tsx        → Full leaderboard (org view)
  /ambassador/dashboard/page.tsx   → Ambassador home
  /ambassador/tasks/page.tsx       → Task list
  /ambassador/tasks/[id]/page.tsx  → Task detail + proof submission
  /ambassador/achievements/page.tsx → Badges + points history
  /ambassador/leaderboard/page.tsx → Leaderboard (ambassador view)
  /api/score-submission/route.ts   → AI scoring endpoint

/components
  /layout/Navbar.tsx
  /layout/OrgSidebar.tsx
  /layout/AmbassadorSidebar.tsx
  /dashboard/StatsCard.tsx
  /dashboard/Leaderboard.tsx
  /dashboard/TaskCard.tsx
  /dashboard/BadgeShelf.tsx
  /dashboard/PointsChart.tsx
  /dashboard/ActivityFeed.tsx
  /forms/CreateTaskForm.tsx
  /forms/ProofSubmissionForm.tsx

/lib
  /supabase.ts                     → Supabase client init + type definitions
  /db.ts                           → All database operations (central DB layer)
  /points.ts                       → Points engine logic
  /badges.ts                       → Badge award logic

---

## Database Tables (Supabase)
- profiles: id, full_name, email, role, org_id, avatar_url, created_at
- organizations: id, name, description, logo_url, created_by, created_at
- tasks: id, org_id, title, description, task_type, points_value, deadline, status
- submissions: id, task_id, ambassador_id, proof_text, proof_url, status, 
  ai_score, ai_feedback, submitted_at
- points_log: id, ambassador_id, points, reason, task_id, created_at
- badges: id, ambassador_id, badge_type, awarded_at

---

## User Roles
- 'org' → can create tasks, view all ambassadors, approve/reject submissions
- 'ambassador' → can view tasks, submit proof, earn points and badges

Auth flow: Supabase email+password. Role stored in profiles table.
After login redirect to /org/dashboard or /ambassador/dashboard based on role.

---

## Badge Types & Award Conditions
- first_task: Complete first task
- rising_star: Earn 100+ points
- referral_king: Submit 3+ referral type tasks
- content_creator: Submit 3+ content type tasks
- top_performer: Reach #1 on leaderboard
- week_streak: Submit tasks 7 days in a row

---

## Points Engine Rules
- Points awarded = task points_value when submission is approved
- Points logged in points_log table with reason and task_id
- Total points = sum of all points_log entries per ambassador
- Leaderboard = ambassadors ranked by total points descending

---

## AI Scoring (OpenRouter API)
Endpoint: POST /api/score-submission
Input: { submissionId }
Output: { score: 0-100, feedback: string, pointsAwarded: number }
Uses OpenRouter API with openai/gpt-4o model.
Score gets saved to submissions.ai_score and submissions.ai_feedback.
Points awarded = (ai_score / 100) * task points_value (rounded).
API key from env: OPENROUTER_API_KEY

---

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
NEXT_PUBLIC_SITE_URL=

---

## Code Conventions
- TypeScript everywhere — no 'any' types
- Server components by default, 'use client' only when needed
- All DB calls via Supabase client in /lib/supabase.ts
- Loading states on every async operation
- Error boundaries on all pages
- No lorem ipsum — use realistic campus ambassador content
- Component names: PascalCase
- File names: camelCase for libs, PascalCase for components
- Always mobile responsive

---

## Current Status (Updated 26 April 2026)
[x] Landing page with dark glassmorphism design
[x] Auth page — login + signup with role selection + Suspense boundary
[x] Org dashboard — stats, charts, activity feed
[x] Org tasks — CRUD with create modal
[x] Org ambassadors — table with expandable submissions
[x] Org leaderboard — ranked table with search
[x] Ambassador dashboard — points, streak, available tasks
[x] Ambassador tasks — available + submitted with status
[x] Ambassador task detail — proof submission flow
[x] Ambassador achievements — badges + points history chart
[x] Ambassador leaderboard — highlights current user
[x] AI scoring endpoint — OpenRouter GPT-4o integration
[x] Points engine — auto-award on approval with AI scaling
[x] Badge system — all 6 conditions implemented
[x] Auth middleware — role-based route protection
[x] Error boundaries — org, ambassador, and global
[x] README.md — full hackathon submission doc
[x] Security audit — credentials in .env.local only, no direct supabase in pages
[ ] Supabase RLS policies (configure in Supabase dashboard)
[ ] Vercel deployment

## What Claude Code Should Focus On
- Supabase RLS policies (configure in dashboard)
- Vercel deployment + environment variables
- Performance optimizations
- Any remaining edge-case bugs