'use client';

import { useRouter } from 'next/navigation';
import { X, Zap, Check, CreditCard, Sparkles, Star, Shield } from 'lucide-react';
import { useLang } from '@/components/LanguageProvider';

export default function PaywallPage() {
  const router = useRouter();
  const { t } = useLang();

  const features = [
    t.payFeat1,
    t.payFeat2,
    t.payFeat3,
    t.payFeat4,
    t.payFeat5,
  ];

  return (
    <main className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="animate-fade-in-up flex-1 px-6 pt-4 pb-8 max-w-md mx-auto w-full flex flex-col relative z-10">
        {/* Close → go to try-on (skip paywall) */}
        <button
          onClick={() => router.push('/try-on')}
          className="self-end p-2.5 glass rounded-full mb-6 hover:bg-white/10 transition-colors press-scale"
        >
          <X size={20} className="text-white/60" />
        </button>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full w-fit shadow-lg shadow-indigo-500/25">
            <Zap size={14} className="text-white fill-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {t.auraPro}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black text-white tracking-tight leading-[1]">
            {t.precisionTitle}
            <br />
            <span className="text-gradient italic">{t.precisionTotal}.</span>
          </h1>

          {/* Features */}
          <div className="space-y-4 py-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 opacity-0 animate-fade-in"
                style={{ animationDelay: `${(i + 1) * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <Check size={14} className="text-indigo-400" />
                </div>
                <span className="text-white/70 font-bold text-[15px]">{feature}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-black flex items-center justify-center">
                  <Star size={12} className="text-white fill-white" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-[10px] text-white/30 font-bold mt-0.5">+10,000 Pro users</p>
            </div>
          </div>
        </div>

        {/* Purchase buttons */}
        <div className="space-y-3 mt-6">
          {/* Price card */}
          <div className="glass rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-black text-lg">$4.99<span className="text-white/30 text-sm font-bold">/mo</span></p>
              <p className="text-white/25 text-[10px] font-bold">Cancel anytime</p>
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Best Value</span>
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all press-scale shadow-xl shadow-indigo-500/25 animate-glow">
            <CreditCard size={18} className="text-white" />
            <span className="text-white font-black uppercase tracking-widest text-xs">
              {t.getPro}
            </span>
          </button>

          <button className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 press-scale">
            <Shield size={14} className="text-white/20" />
            <span className="text-white/20 font-bold text-xs">{t.restorePurchase}</span>
          </button>
        </div>
      </div>
    </main>
  );
}
