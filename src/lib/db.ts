import { supabase } from './supabase';
import type { Profile, Organization, Task, Submission, PointsLog, Badge } from './supabase';

export type { Profile, Organization, Task, Submission, PointsLog, Badge } from './supabase';

type BadgeType = Badge['badge_type'];

export interface LeaderboardEntry extends Profile {
  total_points: number;
  tasks_completed: number;
  badges_count: number;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<Profile | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return profile;
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  role: 'org' | 'ambassador',
  fullName: string,
  orgId?: string
) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role, org_id: orgId || null } },
  });
  if (authError) throw authError;
  if (!authData.user) throw new Error('Sign up failed');

  // Insert profile row immediately — without this getCurrentUser() returns null
  // and middleware redirects the user back to /auth in a loop
  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
      org_id: orgId || null,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  );
  if (profileError) {
    // Log but don't throw — auth succeeded, auth page will catch null profile below
    console.error('Profile insert failed:', profileError);
  }

  return authData;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ─── ORGANIZATIONS ────────────────────────────────────────────────────────────

export async function getOrgById(orgId: string): Promise<Organization | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();
  if (error) return null;
  return data;
}

export async function createOrg(
  name: string,
  description: string,
  createdBy: string
): Promise<Organization> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('organizations')
    .insert({ name, description, created_by: createdBy })
    .select()
    .single();
  if (error) throw error;
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ org_id: data.id })
    .eq('id', createdBy);
  if (updateError) throw updateError;
  
  return data;
}

// ─── TASKS ────────────────────────────────────────────────────────────────────

export async function getTasksByOrg(orgId: string): Promise<Task[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getActiveTasksForAmbassador(orgId: string): Promise<Task[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('org_id', orgId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();
  if (error) return null;
  return data;
}

export async function createTask(
  task: Omit<Task, 'id' | 'created_at' | 'status'>
): Promise<Task> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...task, status: 'active' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function closeTask(taskId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('tasks')
    .update({ status: 'closed' })
    .eq('id', taskId);
  if (error) throw error;
}

// ─── SUBMISSIONS ──────────────────────────────────────────────────────────────

export async function submitProof(
  taskId: string,
  ambassadorId: string,
  proofText: string,
  proofUrl?: string
): Promise<Submission> {
  if (!supabase) throw new Error('Supabase not configured');

  // SECURITY FIX: reject javascript: and data: URL schemes to prevent injection
  if (proofUrl) {
    const scheme = proofUrl.trim().toLowerCase();
    if (!scheme.startsWith('https://') && !scheme.startsWith('http://')) {
      throw new Error('Proof URL must start with https:// or http://');
    }
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      task_id: taskId,
      ambassador_id: ambassadorId,
      proof_text: proofText,
      proof_url: proofUrl || null,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getSubmissionsByOrg(orgId: string): Promise<Submission[]> {
  if (!supabase) return [];

  const { data: tasks } = await supabase
    .from('tasks')
    .select('id')
    .eq('org_id', orgId);

  const taskIds = tasks?.map((t: { id: string }) => t.id) || [];
  if (taskIds.length === 0) return [];

  const { data, error } = await supabase
    .from('submissions')
    .select('*, task:tasks(*), ambassador:profiles(*)')
    .in('task_id', taskIds)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSubmissionsByAmbassador(ambassadorId: string): Promise<Submission[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('submissions')
    .select('*, task:tasks(*)')
    .eq('ambassador_id', ambassadorId)
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function approveSubmission(submissionId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('submissions')
    .update({ status: 'approved' })
    .eq('id', submissionId);
  if (error) throw error;
}

export async function rejectSubmission(submissionId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('submissions')
    .update({ status: 'rejected' })
    .eq('id', submissionId);
  if (error) throw error;
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────

export async function getLeaderboard(orgId: string): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];
  const client = supabase;

  const { data: ambassadors, error } = await client
    .from('profiles')
    .select('*')
    .eq('role', 'ambassador')
    .eq('org_id', orgId);

  if (error) throw error;
  if (!ambassadors || ambassadors.length === 0) return [];

  const leaderboard = await Promise.all(
    ambassadors.map(async (amb: Profile) => {
      const { data: pointsData } = await client
        .from('points_log')
        .select('points')
        .eq('ambassador_id', amb.id);

      const total_points =
        pointsData?.reduce((s: number, p: { points: number }) => s + p.points, 0) || 0;

      const { count: tasks_completed } = await client
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('ambassador_id', amb.id)
        .eq('status', 'approved');

      const { count: badges_count } = await client
        .from('badges')
        .select('*', { count: 'exact', head: true })
        .eq('ambassador_id', amb.id);

      return {
        ...amb,
        total_points,
        tasks_completed: tasks_completed || 0,
        badges_count: badges_count || 0,
      };
    })
  );

  return leaderboard.sort((a, b) => b.total_points - a.total_points);
}

// ─── POINTS ───────────────────────────────────────────────────────────────────

export async function getTotalPoints(ambassadorId: string): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from('points_log')
    .select('points')
    .eq('ambassador_id', ambassadorId);
  if (error) throw error;
  return data?.reduce((s, p) => s + p.points, 0) || 0;
}

export async function getPointsHistory(ambassadorId: string): Promise<PointsLog[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('points_log')
    .select('*')
    .eq('ambassador_id', ambassadorId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function awardPoints(
  ambassadorId: string,
  points: number,
  reason: string,
  taskId?: string
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('points_log').insert({
    ambassador_id: ambassadorId,
    points,
    reason,
    task_id: taskId || null,
  });
  if (error) throw error;
}

// ─── BADGES ───────────────────────────────────────────────────────────────────

export async function getBadgesByAmbassador(ambassadorId: string): Promise<Badge[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('ambassador_id', ambassadorId)
    .order('awarded_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function awardBadge(ambassadorId: string, badgeType: BadgeType): Promise<void> {
  if (!supabase) return;
  await supabase
    .from('badges')
    .insert({ ambassador_id: ambassadorId, badge_type: badgeType });
}
