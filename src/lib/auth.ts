import { supabase } from './supabase';
import type { Profile } from './supabase';

export async function signUp(email: string, password: string, fullName: string, role: 'org' | 'ambassador') {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role } },
  });
  if (error) throw error;

  if (data.user) {
    await supabase.from('profiles').insert({ id: data.user.id, full_name: fullName, email, role });
    if (role === 'org') {
      await supabase.from('organizations').insert({
        name: `${fullName}'s Organization`,
        description: 'Welcome to your campus ambassador program!',
        created_by: data.user.id,
      });
    }
  }
  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<Profile | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return profile;
}

export async function getUserRole(): Promise<string | null> {
  const profile = await getCurrentUser();
  return profile?.role || null;
}
