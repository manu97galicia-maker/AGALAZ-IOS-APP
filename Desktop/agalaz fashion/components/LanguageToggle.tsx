'use client';

import { useLang } from './LanguageProvider';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all text-xs font-bold tracking-wide ${className}`}
    >
      <span className={lang === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
      <span className="text-white/20">|</span>
      <span className={lang === 'es' ? 'opacity-100' : 'opacity-40'}>ES</span>
    </button>
  );
}
