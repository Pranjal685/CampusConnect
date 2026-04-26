import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { processApprovedSubmission } from '@/lib/points';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // SECURITY FIX: require authenticated session — prevents unauthenticated AI scoring (cost exploit)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch submission + task
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('*, task:tasks(*)')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // SECURITY FIX: idempotency check — prevents double-scoring and double point awards
    if (submission.ai_score !== null) {
      return NextResponse.json({ error: 'Already scored' }, { status: 409 });
    }

    const task = submission.task;

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
    }

    // Call OpenRouter API (OpenAI-compatible)
    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'CampusConnect',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert evaluator for campus ambassador tasks. Score the submission strictly based on quality, effort, and relevance to the task. Return ONLY a JSON object: { "score": number (0-100), "feedback": string (max 2 sentences) }',
          },
          {
            role: 'user',
            content: `Task: ${task.title} — ${task.description}\nTask Type: ${task.task_type}\nAmbassador Submission: ${submission.proof_text}\nProof URL provided: ${submission.proof_url ? 'yes' : 'no'}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResponse.ok) {
      return NextResponse.json({ error: 'AI scoring failed' }, { status: 502 });
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '{}';

    let score: number;
    let feedback: string;

    try {
      const parsed = JSON.parse(rawContent);
      score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
      feedback = String(parsed.feedback || '');
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 502 });
    }

    // Save ai_score, ai_feedback, and approve the submission
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ ai_score: score, ai_feedback: feedback, status: 'approved' })
      .eq('id', submissionId);

    if (updateError) throw updateError;

    // Award points and check badges
    const pointsAwarded = await processApprovedSubmission(submissionId);

    return NextResponse.json({ score, feedback, pointsAwarded });
  } catch (err) {
    console.error('score-submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
