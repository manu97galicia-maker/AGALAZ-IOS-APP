'use client';

import { useRouter } from 'next/navigation';
import { X, Zap, Check, CreditCard } from 'lucide-react';

const FEATURES = [
  'Preservación de outfit original',
  'Mapeo facial sin costuras',
  'Renders ilimitados',
  'Fondo y entorno protegidos',
  'Soporte para prendas complejas',
];

export default function PaywallPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col">
      <div className="animate-fade-in flex-1 px-8 pt-6 pb-8 max-w-lg mx-auto w-full flex flex-col">
        {/* Close */}
        <button
          onClick={() => router.back()}
          className="self-end p-2 bg-white/10 rounded-full mb-8 hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-full w-fit">
            <Zap size={12} className="text-white fill-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Aura Pro
            </span>
          </div>

          <h1
            className="text-5xl font-black text-white tracking-tight"
            style={{ lineHeight: 1.1 }}
          >
            Precisión
            <br />
            <span className="text-indigo-400">Total.</span>
          </h1>

          <div className="space-y-5 py-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center shrink-0">
                  <Check size={14} className="text-indigo-400" />
                </div>
                <span className="text-slate-300 font-bold">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase */}
        <button className="w-full py-5 bg-indigo-600 rounded-[2rem] flex items-center justify-center gap-3 mb-4 hover:bg-indigo-500 transition-colors cursor-pointer">
          <CreditCard size={18} className="text-white" />
          <span className="text-white font-black uppercase tracking-widest text-xs">
            Obtener Pro $4.99/mes
          </span>
        </button>
      </div>
    </main>
  );
}
