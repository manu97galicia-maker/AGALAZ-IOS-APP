'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, ArrowRight, User, Shirt, Palette, Calendar,
  Flame, DollarSign, ShoppingBag, Zap, Crown, Heart,
  Sun, Moon, Star, Target, Gem, Watch, Glasses,
} from 'lucide-react';
import { useLang } from '@/components/LanguageProvider';
import { LanguageToggle } from '@/components/LanguageToggle';

interface QuestionOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  type: 'single' | 'multi';
  options: QuestionOption[];
}

const useQuestions = (): Question[] => {
  const { lang } = useLang();
  const en = lang === 'en';

  return [
    {
      id: 1,
      title: en ? 'What brings you here?' : '¿Qué te trae por aquí?',
      subtitle: en ? 'Choose your main goal' : 'Elige tu objetivo principal',
      type: 'single',
      options: [
        { id: 'tryon', label: en ? 'Try clothes before buying' : 'Probar ropa antes de comprar', icon: <Shirt size={24} />, gradient: 'from-indigo-500 to-violet-600' },
        { id: 'style', label: en ? 'Discover my style' : 'Descubrir mi estilo', icon: <Sparkles size={24} />, gradient: 'from-amber-500 to-orange-600' },
        { id: 'save', label: en ? 'Save money on returns' : 'Ahorrar en devoluciones', icon: <DollarSign size={24} />, gradient: 'from-emerald-500 to-teal-600' },
        { id: 'fun', label: en ? 'Just for fun' : 'Solo por diversión', icon: <Heart size={24} />, gradient: 'from-pink-500 to-rose-600' },
      ],
    },
    {
      id: 2,
      title: en ? 'How do you identify?' : '¿Cómo te identificas?',
      subtitle: en ? 'This helps us personalize your experience' : 'Esto nos ayuda a personalizar tu experiencia',
      type: 'single',
      options: [
        { id: 'woman', label: en ? 'Woman' : 'Mujer', icon: <User size={24} />, gradient: 'from-pink-500 to-fuchsia-600' },
        { id: 'man', label: en ? 'Man' : 'Hombre', icon: <User size={24} />, gradient: 'from-blue-500 to-indigo-600' },
        { id: 'nonbinary', label: en ? 'Non-binary' : 'No binario', icon: <Star size={24} />, gradient: 'from-violet-500 to-purple-600' },
        { id: 'notsay', label: en ? 'Prefer not to say' : 'Prefiero no decir', icon: <Heart size={24} />, gradient: 'from-slate-500 to-slate-600' },
      ],
    },
    {
      id: 3,
      title: en ? 'What\'s your style vibe?' : '¿Cuál es tu onda de estilo?',
      subtitle: en ? 'Pick the one that feels most like you' : 'Elige el que más te represente',
      type: 'single',
      options: [
        { id: 'minimal', label: en ? 'Minimalist' : 'Minimalista', icon: <Target size={24} />, gradient: 'from-slate-400 to-slate-600' },
        { id: 'streetwear', label: 'Streetwear', icon: <Flame size={24} />, gradient: 'from-red-500 to-orange-600' },
        { id: 'elegant', label: en ? 'Elegant' : 'Elegante', icon: <Crown size={24} />, gradient: 'from-amber-500 to-yellow-600' },
        { id: 'casual', label: 'Casual', icon: <Sun size={24} />, gradient: 'from-sky-500 to-blue-600' },
        { id: 'bold', label: en ? 'Bold & Creative' : 'Atrevido y Creativo', icon: <Palette size={24} />, gradient: 'from-fuchsia-500 to-pink-600' },
      ],
    },
    {
      id: 4,
      title: en ? 'Favorite colors to wear?' : '¿Colores favoritos para vestir?',
      subtitle: en ? 'Select up to 3' : 'Selecciona hasta 3',
      type: 'multi',
      options: [
        { id: 'black', label: en ? 'Black' : 'Negro', icon: <Moon size={24} />, gradient: 'from-gray-700 to-gray-900' },
        { id: 'white', label: en ? 'White' : 'Blanco', icon: <Sun size={24} />, gradient: 'from-gray-200 to-gray-400' },
        { id: 'blue', label: en ? 'Blue' : 'Azul', icon: <Palette size={24} />, gradient: 'from-blue-500 to-blue-700' },
        { id: 'earth', label: en ? 'Earth tones' : 'Tonos tierra', icon: <Palette size={24} />, gradient: 'from-amber-600 to-amber-800' },
        { id: 'pastel', label: en ? 'Pastels' : 'Pastel', icon: <Palette size={24} />, gradient: 'from-pink-300 to-violet-400' },
        { id: 'bold', label: en ? 'Bold colors' : 'Colores vivos', icon: <Palette size={24} />, gradient: 'from-red-500 to-fuchsia-600' },
      ],
    },
    {
      id: 5,
      title: en ? 'What do you shop for most?' : '¿Qué compras más?',
      subtitle: en ? 'Select all that apply' : 'Selecciona todos los que apliquen',
      type: 'multi',
      options: [
        { id: 'tops', label: en ? 'Tops & Shirts' : 'Camisetas y Tops', icon: <Shirt size={24} />, gradient: 'from-indigo-500 to-violet-600' },
        { id: 'jackets', label: en ? 'Jackets & Coats' : 'Chaquetas y Abrigos', icon: <Shirt size={24} />, gradient: 'from-slate-500 to-slate-700' },
        { id: 'dresses', label: en ? 'Dresses' : 'Vestidos', icon: <Gem size={24} />, gradient: 'from-rose-500 to-pink-600' },
        { id: 'sportswear', label: 'Sportswear', icon: <Zap size={24} />, gradient: 'from-emerald-500 to-green-600' },
        { id: 'accessories', label: en ? 'Accessories' : 'Accesorios', icon: <Watch size={24} />, gradient: 'from-amber-500 to-orange-600' },
      ],
    },
    {
      id: 6,
      title: en ? 'Dress up for?' : '¿Te vistes para...?',
      subtitle: en ? 'Pick your most common scenarios' : 'Elige tus escenarios más comunes',
      type: 'multi',
      options: [
        { id: 'work', label: en ? 'Work / Office' : 'Trabajo / Oficina', icon: <Glasses size={24} />, gradient: 'from-blue-500 to-indigo-600' },
        { id: 'casual', label: en ? 'Everyday casual' : 'Día a día casual', icon: <Sun size={24} />, gradient: 'from-amber-400 to-orange-500' },
        { id: 'night', label: en ? 'Night out' : 'Salir de noche', icon: <Moon size={24} />, gradient: 'from-violet-600 to-purple-800' },
        { id: 'events', label: en ? 'Special events' : 'Eventos especiales', icon: <Crown size={24} />, gradient: 'from-amber-500 to-yellow-600' },
        { id: 'sport', label: en ? 'Gym / Sports' : 'Gimnasio / Deporte', icon: <Zap size={24} />, gradient: 'from-emerald-500 to-teal-600' },
      ],
    },
    {
      id: 7,
      title: en ? 'How adventurous are you?' : '¿Qué tan aventurero/a eres?',
      subtitle: en ? 'When it comes to trying new looks' : 'A la hora de probar nuevos looks',
      type: 'single',
      options: [
        { id: 'safe', label: en ? 'I stick to what I know' : 'Me quedo con lo que conozco', icon: <Target size={24} />, gradient: 'from-slate-500 to-slate-600' },
        { id: 'sometimes', label: en ? 'Open to suggestions' : 'Abierto/a a sugerencias', icon: <Sparkles size={24} />, gradient: 'from-indigo-500 to-violet-600' },
        { id: 'always', label: en ? 'I love experimenting' : 'Me encanta experimentar', icon: <Flame size={24} />, gradient: 'from-red-500 to-orange-600' },
        { id: 'trendsetter', label: en ? 'I set the trends' : 'Yo marco tendencia', icon: <Crown size={24} />, gradient: 'from-amber-500 to-yellow-600' },
      ],
    },
    {
      id: 8,
      title: en ? 'What\'s your budget?' : '¿Cuál es tu presupuesto?',
      subtitle: en ? 'Per clothing item on average' : 'Por prenda en promedio',
      type: 'single',
      options: [
        { id: 'budget', label: en ? 'Under $30' : 'Menos de 30€', icon: <DollarSign size={24} />, gradient: 'from-emerald-500 to-green-600' },
        { id: 'mid', label: en ? '$30 – $100' : '30€ – 100€', icon: <DollarSign size={24} />, gradient: 'from-blue-500 to-indigo-600' },
        { id: 'premium', label: en ? '$100 – $300' : '100€ – 300€', icon: <Gem size={24} />, gradient: 'from-violet-500 to-purple-600' },
        { id: 'luxury', label: en ? '$300+' : '300€+', icon: <Crown size={24} />, gradient: 'from-amber-500 to-yellow-600' },
      ],
    },
    {
      id: 9,
      title: en ? 'How often do you shop?' : '¿Con qué frecuencia compras?',
      subtitle: en ? 'Be honest, we won\'t judge!' : '¡Sé sincero/a, no juzgamos!',
      type: 'single',
      options: [
        { id: 'rarely', label: en ? 'Rarely' : 'Raramente', icon: <Calendar size={24} />, gradient: 'from-slate-500 to-slate-600' },
        { id: 'monthly', label: en ? 'Once a month' : 'Una vez al mes', icon: <ShoppingBag size={24} />, gradient: 'from-blue-500 to-indigo-600' },
        { id: 'weekly', label: en ? 'Weekly' : 'Semanalmente', icon: <ShoppingBag size={24} />, gradient: 'from-violet-500 to-purple-600' },
        { id: 'addicted', label: en ? 'I can\'t stop!' : '¡No puedo parar!', icon: <Flame size={24} />, gradient: 'from-red-500 to-orange-600' },
      ],
    },
    {
      id: 10,
      title: '',
      subtitle: '',
      type: 'single',
      options: [],
    },
  ];
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const router = useRouter();
  const { lang } = useLang();
  const en = lang === 'en';
  const questions = useQuestions();
  const question = questions[step];
  const totalSteps = questions.length;
  const progress = ((step + 1) / (totalSteps - 1)) * 100;

  const handleSelect = (optionId: string) => {
    if (isAnimating) return;

    const current = answers[question.id] || [];

    if (question.type === 'multi') {
      if (current.includes(optionId)) {
        setAnswers({ ...answers, [question.id]: current.filter(id => id !== optionId) });
      } else if (current.length < 3) {
        setAnswers({ ...answers, [question.id]: [...current, optionId] });
      }
    } else {
      setAnswers({ ...answers, [question.id]: [optionId] });
      setTimeout(() => goNext(), 350);
    }
  };

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (step < totalSteps - 2) {
      setTimeout(() => {
        setStep(s => s + 1);
        setIsAnimating(false);
      }, 250);
    } else {
      setTimeout(() => {
        setStep(totalSteps - 1);
        setShowSummary(true);
        setIsAnimating(false);
      }, 250);
    }
  };

  const goBack = () => {
    if (step > 0 && !isAnimating) {
      setIsAnimating(true);
      setShowSummary(false);
      setTimeout(() => {
        setStep(s => s - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const isSelected = (optionId: string) => (answers[question.id] || []).includes(optionId);
  const hasAnswer = (answers[question.id] || []).length > 0;

  // ──── SUMMARY SCREEN (Step 10) ────
  if (showSummary) {
    return (
      <main className="min-h-screen bg-black flex flex-col relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 animate-fade-in-up">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl scale-150 animate-pulse-soft" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-float">
              <Sparkles size={48} className="text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-white text-center tracking-tight leading-tight">
            {en ? 'Your AI Stylist' : 'Tu Estilista IA'}
            <br />
            <span className="text-gradient italic">{en ? 'is Ready.' : 'está Listo.'}</span>
          </h1>

          <p className="text-white/35 text-center mt-4 max-w-xs text-[15px] leading-relaxed">
            {en
              ? 'We\'ve personalized your experience. Try on any clothing instantly with AI precision.'
              : 'Hemos personalizado tu experiencia. Prueba cualquier prenda al instante con precisión IA.'}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-10 w-full max-w-sm">
            {[
              { value: '10K+', label: en ? 'Users' : 'Usuarios' },
              { value: '50K+', label: en ? 'Try-ons' : 'Pruebas' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-4 text-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${(i + 1) * 200}ms`, animationFillMode: 'forwards' }}
              >
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] font-bold text-white/25 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-10 max-w-sm mx-auto w-full relative z-10">
          <button
            onClick={() => router.push('/paywall')}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center gap-3 press-scale shadow-xl shadow-indigo-500/25 animate-glow"
          >
            <Zap size={18} className="fill-white" />
            <span className="font-black uppercase tracking-widest text-xs">
              {en ? 'Continue' : 'Continuar'}
            </span>
          </button>
        </div>
      </main>
    );
  }

  // ──── QUESTION SCREENS (1–9) ────
  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={goBack} className="text-white/40 text-lg font-bold press-scale p-1">
            ←
          </button>
        ) : (
          <LanguageToggle />
        )}
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
          {step + 1} / {totalSteps - 1}
        </span>
        <button
          onClick={() => router.push('/paywall')}
          className="text-white/20 text-[11px] font-bold tracking-widest uppercase hover:text-white/40 transition-colors press-scale"
        >
          {en ? 'Skip' : 'Saltar'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-6">
        <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 flex flex-col">
        <div key={step} className={`flex-1 flex flex-col ${isAnimating ? 'opacity-0 transition-opacity duration-200' : 'animate-fade-in-up'}`}>
          <div className="mb-7">
            <h1 className="text-[1.7rem] font-black text-white tracking-tight leading-tight">
              {question.title}
            </h1>
            <p className="text-white/30 text-sm font-medium mt-2">{question.subtitle}</p>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto hide-scrollbar pb-4">
            {question.options.map((option, i) => {
              const selected = isSelected(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 press-scale opacity-0 animate-fade-in ${
                    selected
                      ? 'bg-gradient-to-r ' + option.gradient + ' shadow-lg ring-1 ring-white/20'
                      : 'glass hover:bg-white/[0.06]'
                  }`}
                  style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'forwards' }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    selected ? 'bg-white/20' : 'bg-gradient-to-br ' + option.gradient
                  }`}>
                    <div className="text-white">{option.icon}</div>
                  </div>
                  <span className={`text-[15px] font-bold text-left flex-1 ${
                    selected ? 'text-white' : 'text-white/60'
                  }`}>
                    {option.label}
                  </span>
                  {selected && (
                    <div className="w-6 h-6 bg-white/25 rounded-full flex items-center justify-center animate-fade-in-scale">
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue (multi-select only) */}
        {question.type === 'multi' && (
          <div className="py-5">
            <button
              onClick={goNext}
              disabled={!hasAnswer}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all press-scale ${
                hasAnswer
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <span className={`font-black uppercase tracking-widest text-xs ${hasAnswer ? 'text-white' : 'text-white/20'}`}>
                {en ? 'Continue' : 'Continuar'}
              </span>
              <ArrowRight size={16} className={hasAnswer ? 'text-white' : 'text-white/20'} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
