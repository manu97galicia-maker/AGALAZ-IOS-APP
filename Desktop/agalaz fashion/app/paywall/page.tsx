'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Zap, Check, CreditCard, Star, Shield, Crown, Loader2 } from 'lucide-react';
import { useLang } from '@/components/LanguageProvider';

type Plan = 'weekly' | 'yearly';

export default function PaywallPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const en = lang === 'en';
  const [selected, setSelected] = useState<Plan>('yearly');
  const [loading, setLoading] = useState(false);

  const features = [
    t.payFeat1,
    t.payFeat2,
    t.payFeat3,
    t.payFeat4,
    t.payFeat5,
  ];

  const plans = {
    weekly: {
      price: '$4.99',
      period: en ? '/week' : '/semana',
      perDay: en ? '$0.71/day' : '0,71€/día',
      label: en ? 'Weekly' : 'Semanal',
      badge: null,
      cta: en ? 'Start Weekly Plan' : 'Empezar Plan Semanal',
    },
    yearly: {
      price: '$59.99',
      period: en ? '/year' : '/año',
      perDay: en ? '$0.16/day' : '0,16€/día',
      label: en ? 'Yearly' : 'Anual',
      badge: en ? 'Save 77%' : 'Ahorra 77%',
      cta: en ? 'Start Yearly Plan' : 'Empezar Plan Anual',
    },
  };

  const activePlan = plans[selected];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selected }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error creating checkout session');
      }
    } catch {
      alert(en ? 'Connection error. Try again.' : 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="animate-fade-in-up flex-1 px-6 pt-4 pb-8 max-w-md mx-auto w-full flex flex-col relative z-10">
        {/* Close */}
        <button
          onClick={() => router.push('/try-on')}
          className="self-end p-2.5 glass rounded-full mb-4 hover:bg-white/10 transition-colors press-scale"
        >
          <X size={20} className="text-white/60" />
        </button>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full w-fit shadow-lg shadow-indigo-500/25">
            <Zap size={14} className="text-white fill-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {t.auraPro}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black text-white tracking-tight leading-[1]">
            {en ? 'Unlimited' : 'Renders'}
            <br />
            <span className="text-gradient italic">{en ? 'Try-Ons.' : 'Ilimitados.'}</span>
          </h1>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 opacity-0 animate-fade-in"
                style={{ animationDelay: `${(i + 1) * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <Check size={12} className="text-indigo-400" />
                </div>
                <span className="text-white/60 font-bold text-[14px]">{feature}</span>
              </div>
            ))}
          </div>

          {/* Plan selector */}
          <div className="space-y-2.5 pt-2">
            {/* Yearly plan */}
            <button
              onClick={() => setSelected('yearly')}
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all press-scale ${
                selected === 'yearly'
                  ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border-2 border-indigo-500/50 ring-1 ring-indigo-500/20'
                  : 'glass border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected === 'yearly' ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'
                }`}>
                  {selected === 'yearly' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-[15px]">{plans.yearly.label}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                      {plans.yearly.badge}
                    </span>
                  </div>
                  <span className="text-white/25 text-[11px] font-bold">{plans.yearly.perDay}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white font-black text-lg">{plans.yearly.price}</span>
                <span className="text-white/30 text-xs font-bold">{plans.yearly.period}</span>
              </div>
            </button>

            {/* Weekly plan */}
            <button
              onClick={() => setSelected('weekly')}
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all press-scale ${
                selected === 'weekly'
                  ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border-2 border-indigo-500/50 ring-1 ring-indigo-500/20'
                  : 'glass border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected === 'weekly' ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'
                }`}>
                  {selected === 'weekly' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="text-left">
                  <span className="text-white font-black text-[15px]">{plans.weekly.label}</span>
                  <br />
                  <span className="text-white/25 text-[11px] font-bold">{plans.weekly.perDay}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white font-black text-lg">{plans.weekly.price}</span>
                <span className="text-white/30 text-xs font-bold">{plans.weekly.period}</span>
              </div>
            </button>
          </div>

          {/* Social proof */}
          <div className="glass rounded-2xl p-3.5 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-black flex items-center justify-center">
                  <Star size={10} className="text-white fill-white" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={9} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-[9px] text-white/25 font-bold mt-0.5">
                {en ? '+10,000 Pro users' : '+10.000 usuarios Pro'}
              </p>
            </div>
          </div>
        </div>

        {/* Purchase buttons */}
        <div className="space-y-3 mt-4">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all press-scale shadow-xl shadow-indigo-500/25 animate-glow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="text-white animate-spin" />
            ) : (
              <Crown size={18} className="text-white" />
            )}
            <span className="text-white font-black uppercase tracking-widest text-xs">
              {loading ? (en ? 'Loading...' : 'Cargando...') : activePlan.cta}
            </span>
          </button>

          <div className="flex items-center justify-center gap-4">
            <button className="flex items-center gap-1.5 press-scale py-2">
              <Shield size={12} className="text-white/15" />
              <span className="text-white/15 font-bold text-[11px]">{t.restorePurchase}</span>
            </button>
            <span className="text-white/10">·</span>
            <span className="text-white/15 text-[10px] font-bold">
              {en ? 'Cancel anytime' : 'Cancela cuando quieras'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
