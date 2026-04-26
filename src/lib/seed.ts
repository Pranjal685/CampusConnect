// Demo seed data for CampusConnect
import type { Profile, Organization, Task, Submission, PointsLog, Badge } from './supabase';

const ORG_ID = 'org-001';
const ORG_USER_ID = 'user-org-001';

export const seedOrganization: Organization = {
  id: ORG_ID, name: 'TechStart India', description: 'India\'s fastest growing student tech community. We connect ambitious students with real-world tech opportunities.', logo_url: null, created_by: ORG_USER_ID, created_at: '2025-11-01T10:00:00Z',
};

export const seedOrgProfile: Profile = {
  id: ORG_USER_ID, full_name: 'Arjun Mehta', email: 'arjun@techstartindia.com', role: 'org', org_id: null, avatar_url: null, created_at: '2025-11-01T10:00:00Z',
};

export const seedAmbassadors: Profile[] = [
  { id: 'amb-001', full_name: 'Priya Sharma', email: 'priya.s@iitb.ac.in', role: 'ambassador', org_id: ORG_ID, avatar_url: null, created_at: '2025-11-05T08:00:00Z' },
  { id: 'amb-002', full_name: 'Rohan Gupta', email: 'rohan.g@bits.ac.in', role: 'ambassador', org_id: ORG_ID, avatar_url: null, created_at: '2025-11-06T09:30:00Z' },
  { id: 'amb-003', full_name: 'Ananya Reddy', email: 'ananya.r@iiith.ac.in', role: 'ambassador', org_id: ORG_ID, avatar_url: null, created_at: '2025-11-07T11:00:00Z' },
  { id: 'amb-004', full_name: 'Karan Singh', email: 'karan.s@vit.ac.in', role: 'ambassador', org_id: ORG_ID, avatar_url: null, created_at: '2025-11-08T14:00:00Z' },
  { id: 'amb-005', full_name: 'Meera Patel', email: 'meera.p@dtu.ac.in', role: 'ambassador', org_id: ORG_ID, avatar_url: null, created_at: '2025-11-10T10:00:00Z' },
  { id: 'amb-006', full_name: 'Aditya Joshi', email: 'aditya.j@nitk.ac.in', role: 'ambassador', org_id: ORG_ID, avatar_url: null, created_at: '2025-11-12T13:00:00Z' },
  { id: 'amb-007', full_name: 'Sneha Nair', email: 'sneha.n@pes.edu', role: 'ambassador', org_id: ORG_ID, avatar_url: null, created_at: '2025-11-14T09:00:00Z' },
  { id: 'amb-008', full_name: 'Vikram Desai', email: 'vikram.d@coep.ac.in', role: 'ambassador', org_id: ORG_ID, avatar_url: null, created_at: '2025-11-15T16:00:00Z' },
];

export const seedTasks: Task[] = [
  { id: 'task-001', org_id: ORG_ID, title: 'Share Campus Event on LinkedIn', description: 'Create a professional LinkedIn post about our upcoming Tech Hackathon. Include the event poster, date, and registration link. Tag at least 5 connections.', task_type: 'content', points_value: 50, deadline: '2026-05-15T23:59:00Z', status: 'active', created_at: '2025-12-01T10:00:00Z' },
  { id: 'task-002', org_id: ORG_ID, title: 'Refer 3 Students to Sign Up', description: 'Get 3 students from your campus to register on TechStart India platform. Share your unique referral link and ensure they complete their profiles.', task_type: 'referral', points_value: 100, deadline: '2026-05-20T23:59:00Z', status: 'active', created_at: '2025-12-02T10:00:00Z' },
  { id: 'task-003', org_id: ORG_ID, title: 'Host a Workshop Awareness Session', description: 'Organize a 30-minute awareness session in your college about TechStart India programs. Take photos, record attendance, and submit a brief report.', task_type: 'event', points_value: 200, deadline: '2026-05-25T23:59:00Z', status: 'active', created_at: '2025-12-03T10:00:00Z' },
  { id: 'task-004', org_id: ORG_ID, title: 'Create Instagram Reel about TechStart', description: 'Film a 30-60 second Instagram Reel showcasing what TechStart India offers students. Use trending audio and tag @techstartindia.', task_type: 'content', points_value: 75, deadline: '2026-05-18T23:59:00Z', status: 'active', created_at: '2025-12-04T10:00:00Z' },
  { id: 'task-005', org_id: ORG_ID, title: 'Distribute Flyers in Campus', description: 'Print and distribute 50 flyers around your campus notice boards, canteen, and library. Submit photos of at least 5 placed flyers.', task_type: 'promotion', points_value: 60, deadline: '2026-05-10T23:59:00Z', status: 'active', created_at: '2025-12-05T10:00:00Z' },
  { id: 'task-006', org_id: ORG_ID, title: 'Write a Blog Post about Tech Careers', description: 'Write a 500+ word blog post about emerging tech careers for engineering students. Mention TechStart India resources naturally.', task_type: 'content', points_value: 120, deadline: '2026-06-01T23:59:00Z', status: 'active', created_at: '2025-12-06T10:00:00Z' },
  { id: 'task-007', org_id: ORG_ID, title: 'Refer 5 Students for Hackathon', description: 'Get 5 students registered for the upcoming TechStart Hackathon 2026. Share the registration form and follow up with interested students.', task_type: 'referral', points_value: 150, deadline: '2026-05-30T23:59:00Z', status: 'active', created_at: '2025-12-07T10:00:00Z' },
  { id: 'task-008', org_id: ORG_ID, title: 'Put Up Campus Banners', description: 'Place 3 promotional banners at key locations in your campus — main gate, department building, and hostel area. Submit photos of all 3.', task_type: 'promotion', points_value: 80, deadline: '2026-05-12T23:59:00Z', status: 'closed', created_at: '2025-12-08T10:00:00Z' },
  { id: 'task-009', org_id: ORG_ID, title: 'Organize Tech Quiz Event', description: 'Host a tech quiz competition with at least 20 participants. Document the event with photos and submit the winner details.', task_type: 'event', points_value: 250, deadline: '2026-06-10T23:59:00Z', status: 'active', created_at: '2025-12-09T10:00:00Z' },
  { id: 'task-010', org_id: ORG_ID, title: 'Twitter Thread on Student Tech Skills', description: 'Create a Twitter/X thread (5+ tweets) about essential tech skills for 2026. Include relevant statistics and tag @TechStartIndia.', task_type: 'content', points_value: 65, deadline: '2026-05-22T23:59:00Z', status: 'active', created_at: '2025-12-10T10:00:00Z' },
];

export const seedSubmissions: Submission[] = [
  { id: 'sub-001', task_id: 'task-001', ambassador_id: 'amb-001', proof_text: 'Posted on LinkedIn with 200+ impressions. Tagged 8 connections including 3 professors.', proof_url: 'https://linkedin.com/posts/priya-linkedin-post', status: 'approved', ai_score: 92, ai_feedback: 'Excellent engagement and reach.', submitted_at: '2025-12-10T14:30:00Z' },
  { id: 'sub-002', task_id: 'task-002', ambassador_id: 'amb-001', proof_text: 'Referred Rahul, Sneha, and Amit. All three completed their profiles.', proof_url: null, status: 'approved', ai_score: 88, ai_feedback: 'All referrals verified.', submitted_at: '2025-12-12T11:00:00Z' },
  { id: 'sub-003', task_id: 'task-003', ambassador_id: 'amb-001', proof_text: 'Conducted a 45-minute session with 35 attendees in the CS department seminar hall.', proof_url: 'https://drive.google.com/workshop-photos', status: 'approved', ai_score: 95, ai_feedback: 'Exceptional turnout and engagement.', submitted_at: '2025-12-15T16:00:00Z' },
  { id: 'sub-004', task_id: 'task-004', ambassador_id: 'amb-002', proof_text: 'Created a reel with trending audio, got 1.2K views in first 24 hours.', proof_url: 'https://instagram.com/reel/rohan-techstart', status: 'approved', ai_score: 90, ai_feedback: 'Great content quality.', submitted_at: '2025-12-11T09:00:00Z' },
  { id: 'sub-005', task_id: 'task-002', ambassador_id: 'amb-002', proof_text: 'Referred Priya, Ankit, and Manisha from BITS campus.', proof_url: null, status: 'approved', ai_score: 85, ai_feedback: 'Referrals confirmed.', submitted_at: '2025-12-13T15:30:00Z' },
  { id: 'sub-006', task_id: 'task-005', ambassador_id: 'amb-003', proof_text: 'Placed 55 flyers across 12 notice boards and 3 canteen areas.', proof_url: 'https://drive.google.com/flyer-photos', status: 'approved', ai_score: 87, ai_feedback: 'Good coverage.', submitted_at: '2025-12-09T10:00:00Z' },
  { id: 'sub-007', task_id: 'task-001', ambassador_id: 'amb-003', proof_text: 'LinkedIn post about the hackathon with custom graphic design.', proof_url: 'https://linkedin.com/posts/ananya-post', status: 'approved', ai_score: 91, ai_feedback: 'Professional post with great design.', submitted_at: '2025-12-11T14:00:00Z' },
  { id: 'sub-008', task_id: 'task-006', ambassador_id: 'amb-004', proof_text: 'Published 800-word blog on Medium about AI careers in India.', proof_url: 'https://medium.com/@karan/tech-careers-2026', status: 'approved', ai_score: 93, ai_feedback: 'Well-written, comprehensive article.', submitted_at: '2025-12-14T18:00:00Z' },
  { id: 'sub-009', task_id: 'task-007', ambassador_id: 'amb-004', proof_text: 'Got 5 registrations from VIT campus for the hackathon.', proof_url: null, status: 'pending', ai_score: null, ai_feedback: null, submitted_at: '2025-12-16T12:00:00Z' },
  { id: 'sub-010', task_id: 'task-001', ambassador_id: 'amb-005', proof_text: 'Shared event on LinkedIn with customized post.', proof_url: 'https://linkedin.com/posts/meera-post', status: 'approved', ai_score: 78, ai_feedback: 'Good but could improve engagement.', submitted_at: '2025-12-10T20:00:00Z' },
  { id: 'sub-011', task_id: 'task-008', ambassador_id: 'amb-005', proof_text: 'Placed banners at 3 locations — main gate, CSE building, boys hostel entrance.', proof_url: 'https://drive.google.com/banner-photos', status: 'approved', ai_score: 82, ai_feedback: 'Banners well placed.', submitted_at: '2025-12-08T11:00:00Z' },
  { id: 'sub-012', task_id: 'task-004', ambassador_id: 'amb-006', proof_text: 'Instagram reel with 800 views and 45 likes.', proof_url: 'https://instagram.com/reel/aditya-reel', status: 'approved', ai_score: 80, ai_feedback: 'Decent engagement.', submitted_at: '2025-12-12T16:30:00Z' },
  { id: 'sub-013', task_id: 'task-010', ambassador_id: 'amb-006', proof_text: 'Created a 7-tweet thread about top skills for 2026.', proof_url: 'https://twitter.com/aditya/thread', status: 'pending', ai_score: null, ai_feedback: null, submitted_at: '2025-12-17T10:00:00Z' },
  { id: 'sub-014', task_id: 'task-002', ambassador_id: 'amb-007', proof_text: 'Referred 3 students from PES University.', proof_url: null, status: 'approved', ai_score: 86, ai_feedback: 'All referrals verified.', submitted_at: '2025-12-13T09:30:00Z' },
  { id: 'sub-015', task_id: 'task-005', ambassador_id: 'amb-007', proof_text: 'Distributed 50 flyers in engineering block.', proof_url: 'https://drive.google.com/sneha-flyers', status: 'rejected', ai_score: 35, ai_feedback: 'Photos are blurry, cannot verify placement.', submitted_at: '2025-12-09T14:00:00Z' },
  { id: 'sub-016', task_id: 'task-001', ambassador_id: 'amb-008', proof_text: 'LinkedIn post with event details, tagged 10 peers.', proof_url: 'https://linkedin.com/posts/vikram-post', status: 'approved', ai_score: 76, ai_feedback: 'Solid effort.', submitted_at: '2025-12-11T19:00:00Z' },
  { id: 'sub-017', task_id: 'task-003', ambassador_id: 'amb-002', proof_text: 'Hosted workshop with 28 students, covered AI and ML basics.', proof_url: 'https://drive.google.com/rohan-workshop', status: 'approved', ai_score: 89, ai_feedback: 'Good attendance.', submitted_at: '2025-12-16T17:00:00Z' },
  { id: 'sub-018', task_id: 'task-009', ambassador_id: 'amb-003', proof_text: 'Quiz event with 25 participants from ECE and CSE departments.', proof_url: 'https://drive.google.com/quiz-event', status: 'pending', ai_score: null, ai_feedback: null, submitted_at: '2025-12-18T13:00:00Z' },
  { id: 'sub-019', task_id: 'task-006', ambassador_id: 'amb-001', proof_text: 'Published detailed blog about web development careers on Hashnode.', proof_url: 'https://hashnode.com/priya/webdev-careers', status: 'approved', ai_score: 94, ai_feedback: 'Excellent writing quality.', submitted_at: '2025-12-17T15:00:00Z' },
  { id: 'sub-020', task_id: 'task-007', ambassador_id: 'amb-002', proof_text: '6 students registered from BITS for hackathon.', proof_url: null, status: 'approved', ai_score: 88, ai_feedback: 'Exceeded target.', submitted_at: '2025-12-18T10:00:00Z' },
  { id: 'sub-021', task_id: 'task-004', ambassador_id: 'amb-005', proof_text: 'Created fun reel about campus life at DTU and TechStart.', proof_url: 'https://instagram.com/reel/meera-reel', status: 'pending', ai_score: null, ai_feedback: null, submitted_at: '2025-12-19T08:00:00Z' },
];

// Points logs — calculated from approved submissions
export const seedPointsLog: PointsLog[] = [
  { id: 'pts-001', ambassador_id: 'amb-001', points: 50, reason: 'Task: Share Campus Event on LinkedIn', task_id: 'task-001', created_at: '2025-12-10T15:00:00Z' },
  { id: 'pts-002', ambassador_id: 'amb-001', points: 100, reason: 'Task: Refer 3 Students to Sign Up', task_id: 'task-002', created_at: '2025-12-12T12:00:00Z' },
  { id: 'pts-003', ambassador_id: 'amb-001', points: 200, reason: 'Task: Host Workshop Awareness Session', task_id: 'task-003', created_at: '2025-12-15T17:00:00Z' },
  { id: 'pts-004', ambassador_id: 'amb-001', points: 120, reason: 'Task: Write Blog Post about Tech Careers', task_id: 'task-006', created_at: '2025-12-17T16:00:00Z' },
  { id: 'pts-005', ambassador_id: 'amb-001', points: 50, reason: 'Bonus: Top performer of the week', task_id: null, created_at: '2025-12-18T10:00:00Z' },
  { id: 'pts-006', ambassador_id: 'amb-002', points: 75, reason: 'Task: Create Instagram Reel', task_id: 'task-004', created_at: '2025-12-11T10:00:00Z' },
  { id: 'pts-007', ambassador_id: 'amb-002', points: 100, reason: 'Task: Refer 3 Students to Sign Up', task_id: 'task-002', created_at: '2025-12-13T16:00:00Z' },
  { id: 'pts-008', ambassador_id: 'amb-002', points: 200, reason: 'Task: Host Workshop Awareness Session', task_id: 'task-003', created_at: '2025-12-16T18:00:00Z' },
  { id: 'pts-009', ambassador_id: 'amb-002', points: 150, reason: 'Task: Refer 5 Students for Hackathon', task_id: 'task-007', created_at: '2025-12-18T11:00:00Z' },
  { id: 'pts-010', ambassador_id: 'amb-003', points: 60, reason: 'Task: Distribute Flyers in Campus', task_id: 'task-005', created_at: '2025-12-09T11:00:00Z' },
  { id: 'pts-011', ambassador_id: 'amb-003', points: 50, reason: 'Task: Share Campus Event on LinkedIn', task_id: 'task-001', created_at: '2025-12-11T15:00:00Z' },
  { id: 'pts-012', ambassador_id: 'amb-003', points: 30, reason: 'Bonus: Creative submission award', task_id: null, created_at: '2025-12-12T10:00:00Z' },
  { id: 'pts-013', ambassador_id: 'amb-004', points: 120, reason: 'Task: Write Blog Post about Tech Careers', task_id: 'task-006', created_at: '2025-12-14T19:00:00Z' },
  { id: 'pts-014', ambassador_id: 'amb-005', points: 50, reason: 'Task: Share Campus Event on LinkedIn', task_id: 'task-001', created_at: '2025-12-10T21:00:00Z' },
  { id: 'pts-015', ambassador_id: 'amb-005', points: 80, reason: 'Task: Put Up Campus Banners', task_id: 'task-008', created_at: '2025-12-08T12:00:00Z' },
  { id: 'pts-016', ambassador_id: 'amb-006', points: 75, reason: 'Task: Create Instagram Reel', task_id: 'task-004', created_at: '2025-12-12T17:00:00Z' },
  { id: 'pts-017', ambassador_id: 'amb-007', points: 100, reason: 'Task: Refer 3 Students to Sign Up', task_id: 'task-002', created_at: '2025-12-13T10:00:00Z' },
  { id: 'pts-018', ambassador_id: 'amb-008', points: 50, reason: 'Task: Share Campus Event on LinkedIn', task_id: 'task-001', created_at: '2025-12-11T20:00:00Z' },
];

export const seedBadges: Badge[] = [
  { id: 'bdg-001', ambassador_id: 'amb-001', badge_type: 'first_task', awarded_at: '2025-12-10T15:00:00Z' },
  { id: 'bdg-002', ambassador_id: 'amb-001', badge_type: 'rising_star', awarded_at: '2025-12-12T12:00:00Z' },
  { id: 'bdg-003', ambassador_id: 'amb-001', badge_type: 'content_creator', awarded_at: '2025-12-17T16:00:00Z' },
  { id: 'bdg-004', ambassador_id: 'amb-001', badge_type: 'top_performer', awarded_at: '2025-12-18T10:00:00Z' },
  { id: 'bdg-005', ambassador_id: 'amb-002', badge_type: 'first_task', awarded_at: '2025-12-11T10:00:00Z' },
  { id: 'bdg-006', ambassador_id: 'amb-002', badge_type: 'rising_star', awarded_at: '2025-12-16T18:00:00Z' },
  { id: 'bdg-007', ambassador_id: 'amb-002', badge_type: 'referral_king', awarded_at: '2025-12-18T11:00:00Z' },
  { id: 'bdg-008', ambassador_id: 'amb-003', badge_type: 'first_task', awarded_at: '2025-12-09T11:00:00Z' },
  { id: 'bdg-009', ambassador_id: 'amb-003', badge_type: 'rising_star', awarded_at: '2025-12-12T10:00:00Z' },
  { id: 'bdg-010', ambassador_id: 'amb-004', badge_type: 'first_task', awarded_at: '2025-12-14T19:00:00Z' },
  { id: 'bdg-011', ambassador_id: 'amb-004', badge_type: 'rising_star', awarded_at: '2025-12-14T19:00:00Z' },
  { id: 'bdg-012', ambassador_id: 'amb-005', badge_type: 'first_task', awarded_at: '2025-12-08T12:00:00Z' },
  { id: 'bdg-013', ambassador_id: 'amb-006', badge_type: 'first_task', awarded_at: '2025-12-12T17:00:00Z' },
  { id: 'bdg-014', ambassador_id: 'amb-007', badge_type: 'first_task', awarded_at: '2025-12-13T10:00:00Z' },
  { id: 'bdg-015', ambassador_id: 'amb-007', badge_type: 'rising_star', awarded_at: '2025-12-13T10:00:00Z' },
  { id: 'bdg-016', ambassador_id: 'amb-008', badge_type: 'first_task', awarded_at: '2025-12-11T20:00:00Z' },
];

// Helper to compute leaderboard from seed data
export function getSeedLeaderboard() {
  const pointsByAmbassador = new Map<string, number>();
  seedPointsLog.forEach(p => {
    pointsByAmbassador.set(p.ambassador_id, (pointsByAmbassador.get(p.ambassador_id) || 0) + p.points);
  });

  return seedAmbassadors
    .map(amb => ({
      ...amb,
      total_points: pointsByAmbassador.get(amb.id) || 0,
      tasks_completed: seedSubmissions.filter(s => s.ambassador_id === amb.id && s.status === 'approved').length,
      badges_count: seedBadges.filter(b => b.ambassador_id === amb.id).length,
      college: ['IIT Bombay', 'BITS Pilani', 'IIIT Hyderabad', 'VIT Vellore', 'DTU Delhi', 'NIT Surathkal', 'PES University', 'COEP Pune'][seedAmbassadors.indexOf(amb)],
    }))
    .sort((a, b) => b.total_points - a.total_points);
}

// Weekly submission data for charts
export function getWeeklySubmissions() {
  return [
    { week: 'Week 1', submissions: 6 },
    { week: 'Week 2', submissions: 9 },
    { week: 'Week 3', submissions: 4 },
    { week: 'Week 4', submissions: 5 },
  ];
}

// Points over time for ambassador charts
export function getPointsOverTime(ambassadorId: string) {
  const logs = seedPointsLog
    .filter(p => p.ambassador_id === ambassadorId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  let cumulative = 0;
  return logs.map(p => {
    cumulative += p.points;
    return { date: new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), points: cumulative };
  });
}
