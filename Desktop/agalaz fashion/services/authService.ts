import { createBrowserClient } from '@supabase/ssr';
import type { AppUser } from '@/types';
export type { AppUser };
import type { User } from '@supabase/supabase-js';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

export const signInWithGoogle = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://agalaz.com/try-on' },
  });
  if (error) throw error;
};

export const signInWithApple = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: 'https://agalaz.com/try-on' },
  });
  if (error) throw error;
};

export const signOut = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const mapUser = (user: User): AppUser => {
  const meta = user.user_metadata || {};
  return {
    name: meta.full_name || meta.name || user.email?.split('@')[0] || 'Usuario',
    email: user.email || '',
    avatar: meta.avatar_url || meta.picture || '',
    provider: user.app_metadata?.provider || 'email',
  };
};

export const onAuthStateChange = (callback: (user: AppUser | null) => void) => {
  const supabase = getSupabase();
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback(mapUser(session.user));
    } else {
      callback(null);
    }
  });
};
