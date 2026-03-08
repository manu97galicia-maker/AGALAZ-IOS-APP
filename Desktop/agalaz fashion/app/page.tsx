'use client';

import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Star,
  Target,
  Fingerprint,
  Shirt,
  Zap,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useLang } from '@/components/LanguageProvider';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function HomePage() {
  const { t } = useLang();

  const FEATURES = [
    {
      icon: Target,
      title: t.feat1Title,
      desc: t.feat1Desc,
      gradient: 'from-indigo-500/20 to-violet-500/20',
      iconColor: 'text-indigo-400',
    },
    {
      icon: Fingerprint,
      title: t.feat2Title,
      desc: t.feat2Desc,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Shirt,
      title: t.feat3Title,
      desc: t.feat3Desc,
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xl italic">A</span>
          </div>
          <div>
            <span className="text-lg font-black text-white tracking-tight">Aura</span>
            <span className="text-[9px] font-bold text-indigo-400 block -mt-1 tracking-widest">FASHION AI</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/try-on"
            className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all press-scale"
          >
            {t.start}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full w-fit mb-8">
            <Sparkles size={12} className="text-indigo-400 fill-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              Virtual Try-On AI
            </span>
          </div>

          <h1 className="text-[3.5rem] md:text-[7rem] font-black text-white tracking-tighter leading-[0.85]">
            {t.heroLine1}
            <br />
            <span className="text-gradient italic">{t.heroLine2}</span>
            <br />
            {t.heroLine3}
          </h1>

          <p className="text-base md:text-lg text-white/40 font-medium leading-relaxed mt-8 max-w-xl">
            {t.heroDesc}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs text-white/30 font-bold">{t.activeUsers}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link
              href="/try-on"
              className="flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:opacity-90 transition-all press-scale shadow-xl shadow-indigo-500/25 animate-glow"
            >
              <Sparkles size={18} />
              {t.tryNow}
            </Link>
            <Link
              href="/onboarding"
              className="flex items-center justify-center gap-2 px-10 py-4 glass text-white/60 font-bold text-sm rounded-2xl hover:bg-white/10 transition-all press-scale"
            >
              {t.howItWorks}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-14 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {t.featuresTitle}{' '}
            <span className="text-gradient italic">{t.featuresTitleHighlight}</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-7 rounded-3xl glass hover:bg-white/[0.06] transition-all press-scale opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className={`p-4 bg-gradient-to-br ${f.gradient} rounded-2xl w-fit mb-5`}>
                <f.icon size={26} className={f.iconColor} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-white/35 font-medium leading-relaxed text-[13px]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {t.stepsTitle}{' '}
            <span className="text-gradient italic">{t.stepsTitleHighlight}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: Fingerprint, label: t.step1Label, desc: t.step1Desc, color: 'text-indigo-400' },
            { step: '02', icon: ShieldCheck, label: t.step2Label, desc: t.step2Desc, color: 'text-emerald-400' },
            { step: '03', icon: Shirt, label: t.step3Label, desc: t.step3Desc, color: 'text-amber-400' },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 200}ms`, animationFillMode: 'forwards' }}
            >
              <div className="text-7xl font-black text-white/[0.03] mb-4">{item.step}</div>
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                <item.icon size={28} className={item.color} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">{item.label}</h3>
              <p className="text-white/35 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-indigo-600/5 border border-indigo-500/15 rounded-[2rem] p-10 md:p-16 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap size={16} className="text-indigo-400 fill-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              {t.ctaLabel}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {t.ctaTitle}{' '}
            <span className="italic text-gradient">{t.ctaTitleHighlight}</span>
          </h2>
          <p className="text-white/35 mb-8 max-w-md mx-auto text-sm">{t.ctaDesc}</p>
          <Link
            href="/try-on"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/90 transition-all press-scale"
          >
            <Sparkles size={18} />
            {t.tryNow}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold italic text-sm">A</span>
            </div>
            <span className="font-black text-white/40 text-sm">Aura Fashion AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/20 text-xs hover:text-white/40 transition-colors">
              {t.privacy}
            </Link>
            <Link href="/terms" className="text-white/20 text-xs hover:text-white/40 transition-colors">
              {t.terms}
            </Link>
          </div>
          <p className="text-white/15 text-xs">{t.footerCopy}</p>
        </div>
      </footer>
    </main>
  );
}
