import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { PLAN_CREDITS, CREDITS_RESET_DAYS, REFERRAL_BONUS_WEEKLY, REFERRAL_BONUS_YEARLY } from '@/lib/subscription';
import Stripe from 'stripe';

function getPeriodEnd(sub: any): string {
  const ts = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end ?? 0;
  return new Date(ts * 1000).toISOString();
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      const userId = session.client_reference_id || await getUserIdByCustomer(admin, customerId);
      if (!userId) break;

      const sub = await getStripe().subscriptions.retrieve(subscriptionId) as any;
      const interval = sub.items?.data?.[0]?.price?.recurring?.interval;
      const plan = interval === 'year' ? 'yearly' : 'weekly';

      // Set credits: 7 credits, reset in 7 days
      const creditsResetAt = new Date();
      creditsResetAt.setDate(creditsResetAt.getDate() + CREDITS_RESET_DAYS);

      // Upsert subscription with referral code
      const { data: existingSub } = await admin
        .from('subscriptions')
        .select('referral_code')
        .eq('user_id', userId)
        .single();

      await admin.from('subscriptions').upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan,
          status: 'active',
          current_period_end: getPeriodEnd(sub),
          referral_code: existingSub?.referral_code || generateReferralCode(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

      // Set 7 credits for the user
      await admin.from('render_counts').upsert(
        {
          user_id: userId,
          credits_remaining: PLAN_CREDITS,
          credits_reset_at: creditsResetAt.toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

      // Handle referral bonus
      await processReferralBonus(admin, userId, plan);

      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription as string;
      if (!subscriptionId) break;

      const sub = await getStripe().subscriptions.retrieve(subscriptionId) as any;
      const customerId = invoice.customer as string;

      // Check if this is a renewal (not first payment)
      const billingReason = invoice.billing_reason;

      await admin
        .from('subscriptions')
        .update({
          status: 'active',
          current_period_end: getPeriodEnd(sub),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId);

      // On renewal, reset credits to 7
      if (billingReason === 'subscription_cycle') {
        const { data: subData } = await admin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (subData?.user_id) {
          const creditsResetAt = new Date();
          creditsResetAt.setDate(creditsResetAt.getDate() + CREDITS_RESET_DAYS);

          await admin.from('render_counts').update({
            credits_remaining: PLAN_CREDITS,
            credits_reset_at: creditsResetAt.toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('user_id', subData.user_id);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as any;
      const customerId = sub.customer as string;
      const status =
        sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled';

      await admin
        .from('subscriptions')
        .update({
          status,
          current_period_end: getPeriodEnd(sub),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as any;
      const customerId = sub.customer as string;

      await admin
        .from('subscriptions')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function getUserIdByCustomer(admin: ReturnType<typeof createAdminClient>, customerId: string): Promise<string | null> {
  const { data } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
  return data?.user_id || null;
}

async function processReferralBonus(
  admin: ReturnType<typeof createAdminClient>,
  referredUserId: string,
  plan: string,
) {
  // Check if this user was referred by someone
  const { data: referral } = await admin
    .from('referrals')
    .select('id, referrer_id, bonus_credited')
    .eq('referred_id', referredUserId)
    .eq('bonus_credited', false)
    .single();

  if (!referral) return;

  const bonus = plan === 'yearly' ? REFERRAL_BONUS_YEARLY : REFERRAL_BONUS_WEEKLY;

  // Credit bonus to referrer
  const { data: referrerRc } = await admin
    .from('render_counts')
    .select('credits_remaining')
    .eq('user_id', referral.referrer_id)
    .single();

  if (referrerRc) {
    await admin.from('render_counts').update({
      credits_remaining: (referrerRc.credits_remaining || 0) + bonus,
      updated_at: new Date().toISOString(),
    }).eq('user_id', referral.referrer_id);
  }

  // Credit bonus to referred user
  const { data: referredRc } = await admin
    .from('render_counts')
    .select('credits_remaining')
    .eq('user_id', referredUserId)
    .single();

  if (referredRc) {
    await admin.from('render_counts').update({
      credits_remaining: (referredRc.credits_remaining || 0) + bonus,
      updated_at: new Date().toISOString(),
    }).eq('user_id', referredUserId);
  }

  // Mark referral as credited
  await admin.from('referrals').update({
    bonus_credited: true,
    plan_purchased: plan,
  }).eq('id', referral.id);
}
