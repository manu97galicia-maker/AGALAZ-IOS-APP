import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabaseAdmin';

// POST: Apply a referral code (called before checkout)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing referral code' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();
    const admin = createAdminClient();

    // Find referrer by code
    const { data: referrer } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('referral_code', normalizedCode)
      .single();

    if (!referrer) {
      return NextResponse.json({ error: 'INVALID_CODE' }, { status: 404 });
    }

    // Can't refer yourself
    if (referrer.user_id === user.id) {
      return NextResponse.json({ error: 'SELF_REFERRAL' }, { status: 400 });
    }

    // Check if user already has a referral
    const { data: existing } = await admin
      .from('referrals')
      .select('id')
      .eq('referred_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'ALREADY_REFERRED' }, { status: 400 });
    }

    // Create referral entry (bonus will be credited when user pays)
    await admin.from('referrals').insert({
      referrer_id: referrer.user_id,
      referred_id: user.id,
      referral_code: normalizedCode,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Referral error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
