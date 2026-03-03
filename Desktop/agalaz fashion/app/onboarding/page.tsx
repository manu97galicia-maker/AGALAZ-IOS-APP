'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Fingerprint, Shirt, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    title: 'Preservación Total',
    desc: 'Tus pantalones, calzado y fondo original se mantienen intactos. Solo cambiamos lo que pidas.',
    icon: Target,
    color: '#6366f1',
  },
  {
    title: 'Mapeo Facial Real',
    desc: 'Aura integra tu identidad sobre tu cuerpo real, respetando tu fisonomía y cuello.',
    icon: Fingerprint,
    color: '#10b981',
  },
  {
    title: 'Color & Estilo',
    desc: 'Extraemos el ADN de la prenda nueva y lo adaptamos a tu silueta sin deformaciones.',
    icon: Shirt,
    color: '#6366f1',
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
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
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-8">
        <div key={index} className="animate-fade-in text-center max-w-md">
          <div
            className="p-6 bg-slate-50 rounded-[2.5rem] inline-block mb-8"
          >
            <Icon size={40} style={{ color: step.color }} />
          </div>

          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            {step.title}
          </h1>

          <p className="text-slate-500 font-medium mt-4 leading-relaxed">
            {step.desc}
          </p>

          <div className="flex gap-2 justify-center mt-8">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 max-w-md mx-auto w-full">
        <button
          onClick={handleNext}
          className="w-full py-5 bg-black text-white rounded-[2rem] flex items-center justify-center gap-2 hover:bg-black/90 transition-colors cursor-pointer"
        >
          <span className="font-black uppercase tracking-widest text-xs">
            {index < 2 ? 'Siguiente' : 'Comenzar'}
          </span>
          <ArrowRight size={16} />
        </button>
      </div>
    </main>
  );
}
