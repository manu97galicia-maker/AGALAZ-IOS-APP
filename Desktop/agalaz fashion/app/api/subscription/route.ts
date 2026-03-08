import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { PLAN_CREDITS, CREDITS_RESET_DAYS, FREE_CREDITS } from '@/lib/subscription';

const NULL_STATUS = { isPro: false, plan: null, creditsRemaining: 0, creditsResetAt: null, periodEnd: null, referralCode: null };

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json(NULL_STATUS);

    const admin = createAdminClient();

    const { data: sub } = await admin
      .from('subscriptions')
      .select('status, plan, current_period_end, referral_code')
      .eq('user_id', user.id)
      .single();

    const isPro = sub?.status === 'active';

    // Get or create render_counts row
    let { data: rc } = await admin
      .from('render_counts')
      .select('credits_remaining, credits_reset_at')
      .eq('user_id', user.id)
      .single();

    if (!rc) {
      await admin
        .from('render_counts')
        .upsert({ user_id: user.id, credits_remaining: FREE_CREDITS, total_renders: 0, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      rc = { credits_remaining: FREE_CREDITS, credits_reset_at: null };
    }

    let creditsRemaining = rc.credits_remaining ?? 0;
    let creditsResetAt = rc.credits_reset_at ?? null;

    // Lazy reset: if user is Pro and reset date has passed, refill credits to 7
    if (isPro && creditsResetAt && new Date(creditsResetAt) <= new Date()) {
      const nextReset = new Date();
      nextReset.setDate(nextReset.getDate() + CREDITS_RESET_DAYS);
      creditsRemaining = PLAN_CREDITS;
      creditsResetAt = nextReset.toISOString();

      await admin
        .from('render_counts')
        .update({ credits_remaining: creditsRemaining, credits_reset_at: creditsResetAt, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      isPro,
      plan: sub?.plan || null,
      creditsRemaining,
      creditsResetAt,
      periodEnd: sub?.current_period_end || null,
      referralCode: sub?.referral_code || null,
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json(NULL_STATUS);
  }
}
