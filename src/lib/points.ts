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
