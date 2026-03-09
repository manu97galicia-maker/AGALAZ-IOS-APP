import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICES: Record<string, string> = {
  weekly: process.env.STRIPE_PRICE_WEEKLY!,
  yearly: process.env.STRIPE_PRICE_YEARLY!,
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || !PRICES[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://agalaz.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICES[plan],
          quantity: 1,
        },
      ],
      success_url: `${origin}/try-on?subscribed=true`,
      cancel_url: `${origin}/paywall`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
