'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Fingerprint, Shirt, ArrowRight, Sparkles } from 'lucide-react';
import { useLang } from '@/components/LanguageProvider';

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { t } = useLang();

  const STEPS = [
    {
      title: t.feat1Title,
      desc: t.feat1Desc,
      icon: Target,
      gradient: 'from-indigo-500 to-violet-600',
      bgGlow: 'bg-indigo-500/10',
    },
    {
      title: t.feat2Title,
      desc: t.feat2Desc,
      icon: Fingerprint,
      gradient: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/10',
    },
    {
      title: t.feat3Title,
      desc: t.feat3Desc,
      icon: Shirt,
      gradient: 'from-amber-500 to-orange-600',
      bgGlow: 'bg-amber-500/10',
    },
  ];

  const step = STEPS[index];
  const Icon = step.icon;

  const handleNext = () => {
    if (index < 2) {
      setIndex((i) => i + 1);
    } else {
      router.push('/try-on');
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end px-6 pt-6">
        <button
          onClick={() => router.push('/try-on')}
          className="text-white/30 text-xs font-bold tracking-widest uppercase hover:text-white/50 transition-colors press-scale"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div key={index} className="animate-fade-in-up text-center max-w-sm">
          {/* Glowing icon */}
          <div className="relative inline-block mb-10">
            <div className={`absolute inset-0 ${step.bgGlow} rounded-[2rem] blur-2xl scale-150`} />
            <div className={`relative p-7 bg-gradient-to-br ${step.gradient} rounded-[2rem] shadow-2xl`}>
              <Icon size={44} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
            {step.title}
          </h1>

          <p className="text-white/40 font-medium mt-5 leading-relaxed text-[15px]">
            {step.desc}
          </p>

          {/* Dots */}
          <div className="flex gap-2 justify-center mt-10">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? 'w-10 bg-gradient-to-r from-indigo-500 to-violet-500'
                    : i < index
                    ? 'w-2 bg-indigo-500/50'
                    : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 pb-10 max-w-sm mx-auto w-full">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all press-scale shadow-xl shadow-indigo-500/20"
        >
          {index < 2 ? (
            <>
              <span className="font-black uppercase tracking-widest text-xs">{t.next}</span>
              <ArrowRight size={16} />
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span className="font-black uppercase tracking-widest text-xs">{t.begin}</span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}
