import { supabase } from './supabase';
import type { Badge } from './supabase';
import { awardBadge, getLeaderboard } from './db';

export type BadgeType = Badge['badge_type'];

export const BADGE_INFO: Record<BadgeType, { name: string; description: string; icon: string; howToEarn: string }> = {
  first_task: { name: 'First Task', description: 'Completed your very first task', icon: '🎯', howToEarn: 'Complete your first task' },
  rising_star: { name: 'Rising Star', description: 'Earned 100 points', icon: '⭐', howToEarn: 'Earn 100 points' },
  referral_king: { name: 'Referral King', description: 'Submitted 3 referral tasks', icon: '👑', howToEarn: 'Submit 3 referral tasks' },
  content_creator: { name: 'Content Creator', description: 'Submitted 3 content tasks', icon: '✍️', howToEarn: 'Submit 3 content tasks' },
  top_performer: { name: 'Top Performer', description: 'Reached #1 on the leaderboard', icon: '🏆', howToEarn: 'Reach #1 on the leaderboard' },
  week_streak: { name: 'Week Streak', description: 'Submitted tasks 7 days in a row', icon: '🔥', howToEarn: 'Submit tasks 7 days in a row' },
};

export async function checkAndAwardBadges(ambassadorId: string): Promise<void> {
  if (!supabase) return;

  const { data: existingBadges } = await supabase
    .from('badges')
    .select('badge_type')
    .eq('ambassador_id', ambassadorId);
  const earned = new Set(existingBadges?.map((b: { badge_type: BadgeType }) => b.badge_type) || []);

  // first_task: approved submissions >= 1
  if (!earned.has('first_task')) {
    const { count } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('ambassador_id', ambassadorId)
      .eq('status', 'approved');
    if ((count || 0) >= 1) await awardBadge(ambassadorId, 'first_task');
  }

  // rising_star: total points >= 100
  if (!earned.has('rising_star')) {
    const { data } = await supabase
      .from('points_log')
      .select('points')
      .eq('ambassador_id', ambassadorId);
    const total = data?.reduce((s: number, p: { points: number }) => s + p.points, 0) || 0;
    if (total >= 100) await awardBadge(ambassadorId, 'rising_star');
  }

  // referral_king: approved submissions on referral-type tasks >= 3
  if (!earned.has('referral_king')) {
    const { data: referralTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('task_type', 'referral');
    const referralTaskIds = referralTasks?.map((t: { id: string }) => t.id) || [];
    if (referralTaskIds.length > 0) {
      const { count } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('ambassador_id', ambassadorId)
        .eq('status', 'approved')
        .in('task_id', referralTaskIds);
      if ((count || 0) >= 3) await awardBadge(ambassadorId, 'referral_king');
    }
  }

  // content_creator: approved submissions on content-type tasks >= 3
  if (!earned.has('content_creator')) {
    const { data: contentTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('task_type', 'content');
    const contentTaskIds = contentTasks?.map((t: { id: string }) => t.id) || [];
    if (contentTaskIds.length > 0) {
      const { count } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('ambassador_id', ambassadorId)
        .eq('status', 'approved')
        .in('task_id', contentTaskIds);
      if ((count || 0) >= 3) await awardBadge(ambassadorId, 'content_creator');
    }
  }

  // top_performer: rank #1 on org leaderboard
  if (!earned.has('top_performer')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', ambassadorId)
      .single();
    if (profile?.org_id) {
      const leaderboard = await getLeaderboard(profile.org_id);
      if (leaderboard.length > 0 && leaderboard[0].id === ambassadorId) {
        await awardBadge(ambassadorId, 'top_performer');
      }
    }
  }

  // week_streak: submissions on 7 consecutive days
  if (!earned.has('week_streak')) {
    const { data: subs } = await supabase
      .from('submissions')
      .select('submitted_at')
      .eq('ambassador_id', ambassadorId)
      .eq('status', 'approved')
      .order('submitted_at', { ascending: true });

    if (subs && subs.length >= 7) {
      const uniqueDays = [
        ...new Set(subs.map((s: { submitted_at: string }) => s.submitted_at.split('T')[0])),
      ].sort() as string[];

      let maxStreak = 1;
      let currentStreak = 1;

      for (let i = 1; i < uniqueDays.length; i++) {
        const prev = new Date(uniqueDays[i - 1]);
        const curr = new Date(uniqueDays[i]);
        const diffDays = Math.round(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }

      if (maxStreak >= 7) await awardBadge(ambassadorId, 'week_streak');
    }
  }
}

export async function getAmbassadorBadges(ambassadorId: string): Promise<Badge[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('ambassador_id', ambassadorId)
    .order('awarded_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
