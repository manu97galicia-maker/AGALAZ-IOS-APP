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
} from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    title: 'Preservación Total',
    desc: 'Tus pantalones, calzado y fondo original se mantienen intactos. Solo cambiamos lo que pidas.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Fingerprint,
    title: 'Mapeo Facial Real',
    desc: 'Aura integra tu identidad sobre tu cuerpo real, respetando tu fisonomía y cuello.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Shirt,
    title: 'Color & Estilo',
    desc: 'Extraemos el ADN de la prenda nueva y lo adaptamos a tu silueta sin deformaciones.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
            <span className="text-black font-bold text-xl italic">A</span>
          </div>
          <span className="text-xl font-black text-white tracking-tight">Aura</span>
        </div>
        <Link
          href="/try-on"
          className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-indigo-500 transition-colors"
        >
          Empezar
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 rounded-full w-fit border border-indigo-500/20 mb-8">
            <Sparkles size={12} className="text-indigo-400 fill-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              Virtual Try-On con IA
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
            PRUEBA
            <br />
            <span className="text-indigo-400 italic">ANTES DE</span>
            <br />
            COMPRAR.
          </h1>

          <p className="text-lg text-white/50 font-medium leading-relaxed mt-8 max-w-xl">
            Sube tu foto, elige cualquier prenda y ve cómo te queda al instante.
            IA que respeta tu cuerpo real.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <span className="text-xs text-white/40 font-bold">
              +10,000 usuarios activos
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Link
              href="/try-on"
              className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-white/90 transition-colors"
            >
              <Sparkles size={18} />
              Probar Ahora Gratis
            </Link>
            <Link
              href="/onboarding"
              className="flex items-center justify-center gap-2 px-10 py-5 bg-white/5 border border-white/10 text-white/60 font-bold text-sm rounded-[2rem] hover:bg-white/10 transition-colors"
            >
              Cómo funciona
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Precisión <span className="text-indigo-400 italic">Quirúrgica</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-lg mx-auto">
            Motor de componentes V7.0 — cada píxel preservado, cada prenda respetada.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors"
            >
              <div className={`p-4 ${f.bg} rounded-2xl w-fit mb-6`}>
                <f.icon size={28} className={f.color} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">{f.title}</h3>
              <p className="text-white/40 font-medium leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            3 Fotos. <span className="text-indigo-400 italic">1 Render.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', icon: Fingerprint, label: 'ID Rostro', desc: 'Sube una foto de tu cara para el mapeo facial.' },
            { step: '02', icon: ShieldCheck, label: 'Foto Base', desc: 'Una foto de cuerpo completo — preservamos todo excepto la prenda superior.' },
            { step: '03', icon: Shirt, label: 'Prenda Nueva', desc: 'Elige la prenda que quieres probar — extraemos su color y estilo.' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl font-black text-white/5 mb-4">{item.step}</div>
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <item.icon size={28} className="text-white/40" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">{item.label}</h3>
              <p className="text-white/40 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-12 md:p-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap size={16} className="text-indigo-400 fill-indigo-400" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
              Comienza Gratis
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Tu Estilo, <span className="italic text-indigo-400">Preservado.</span>
          </h2>
          <p className="text-white/40 mb-10 max-w-md mx-auto">
            10 renders gratuitos. Sin tarjeta de crédito. Sin compromisos.
          </p>
          <Link
            href="/try-on"
            className="inline-flex items-center gap-3 px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-white/90 transition-colors"
          >
            <Sparkles size={18} />
            Probar Ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
              <span className="text-black font-bold italic text-sm">A</span>
            </div>
            <span className="font-black text-white/60 text-sm">Aura Fashion AI</span>
          </div>
          <p className="text-white/20 text-xs">
            &copy; 2025 Aura Labs. Motor de Precisión V7.0
          </p>
        </div>
      </footer>
    </main>
  );
}
