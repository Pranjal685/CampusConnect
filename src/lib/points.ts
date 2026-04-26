import { supabase } from './supabase';
import type { Task } from './supabase';
import { awardPoints } from './db';
import { checkAndAwardBadges } from './badges';

export async function processApprovedSubmission(submissionId: string): Promise<number> {
  if (!supabase) throw new Error('Supabase not configured');

  const { data: submission, error } = await supabase
    .from('submissions')
    .select('*, task:tasks(*)')
    .eq('id', submissionId)
    .single();

  if (error || !submission) throw error || new Error('Submission not found');

  const task = submission.task as Task;

  const awarded =
    submission.ai_score !== null
      ? Math.round((submission.ai_score / 100) * task.points_value)
      : task.points_value;

  await awardPoints(submission.ambassador_id, awarded, `Task completed: ${task.title}`, task.id);
  await checkAndAwardBadges(submission.ambassador_id);

  return awarded;
}

// Kept for backwards compatibility
export async function awardPoints_legacy(
  ambassadorId: string,
  points: number,
  reason: string,
  taskId?: string
) {
  return awardPoints(ambassadorId, points, reason, taskId);
}

export async function getTotalPoints(ambassadorId: string): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from('points_log')
    .select('points')
    .eq('ambassador_id', ambassadorId);
  if (error) throw error;
  return data?.reduce((sum, entry) => sum + entry.points, 0) || 0;
}

export async function getLeaderboard() {
  if (!supabase) return [];
  const { data: ambassadors, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'ambassador');
  if (error) throw error;
  if (!ambassadors) return [];

  const client = supabase;
  const leaderboard = await Promise.all(
    ambassadors.map(async (ambassador) => {
      const points = await getTotalPoints(ambassador.id);
      const { count: tasksCompleted } = await client
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('ambassador_id', ambassador.id)
        .eq('status', 'approved');
      const { count: badgesCount } = await client
        .from('badges')
        .select('*', { count: 'exact', head: true })
        .eq('ambassador_id', ambassador.id);
      return {
        ...ambassador,
        total_points: points,
        tasks_completed: tasksCompleted || 0,
        badges_count: badgesCount || 0,
      };
    })
  );
  return leaderboard.sort((a, b) => b.total_points - a.total_points);
}
