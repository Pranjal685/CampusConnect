import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'org' | 'ambassador';
  org_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  created_by: string;
  created_at: string;
}

export interface Task {
  id: string;
  org_id: string;
  title: string;
  description: string;
  task_type: 'referral' | 'content' | 'promotion' | 'event';
  points_value: number;
  deadline: string;
  status: 'active' | 'closed';
  created_at: string;
}

export interface Submission {
  id: string;
  task_id: string;
  ambassador_id: string;
  proof_text: string;
  proof_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  ai_score: number | null;
  ai_feedback: string | null;
  submitted_at: string;
  task?: Task;
  ambassador?: Profile;
}

export interface PointsLog {
  id: string;
  ambassador_id: string;
  points: number;
  reason: string;
  task_id: string | null;
  created_at: string;
}

export interface Badge {
  id: string;
  ambassador_id: string;
  badge_type: 'first_task' | 'top_performer' | 'week_streak' | 'referral_king' | 'content_creator' | 'rising_star';
  awarded_at: string;
}
