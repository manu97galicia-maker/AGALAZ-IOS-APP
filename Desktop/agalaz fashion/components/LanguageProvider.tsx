'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Lang = 'en' | 'es';

const translations = {
  en: {
    // Nav & general
    start: 'Get Started',
    tryNow: 'Try Now Free',
    howItWorks: 'How it works',

    // Hero
    heroLine1: 'TRY IT',
    heroLine2: 'BEFORE YOU',
    heroLine3: 'BUY.',
    heroDesc: 'Upload your photo, pick any clothing item and see how it looks on you instantly. AI that respects your real body.',
    activeUsers: '+10,000 active users',

    // Features
    featuresTitle: 'Surgical',
    featuresTitleHighlight: 'Precision',
    featuresSubtitle: 'Component Engine V7.0 — every pixel preserved, every garment respected.',
    feat1Title: 'Total Preservation',
    feat1Desc: 'Your pants, shoes and original background stay untouched. We only change what you ask.',
    feat2Title: 'Real Face Mapping',
    feat2Desc: 'Agalaz integrates your identity onto your real body, respecting your features and neckline.',
    feat3Title: 'Color & Style',
    feat3Desc: 'We extract the DNA of the new garment and adapt it to your silhouette without distortion.',

    // How it works
    stepsTitle: '3 Photos.',
    stepsTitleHighlight: '1 Render.',
    step1Label: 'Face ID',
    step1Desc: 'Upload a photo of your face for facial mapping.',
    step2Label: 'Base Photo',
    step2Desc: 'A full-body photo — we preserve everything except the top garment.',
    step3Label: 'New Garment',
    step3Desc: 'Choose the garment you want to try on — we extract its color and style.',

    // CTA
    ctaLabel: 'Start Free',
    ctaTitle: 'Your Style,',
    ctaTitleHighlight: 'Preserved.',
    ctaDesc: '10 free renders. No credit card. No commitment.',

    // Footer
    footerCopy: '© 2025 Agalaz Labs. Precision Engine V7.0',
    privacy: 'Privacy',
    terms: 'Terms',

    // Try-on
    preserveTitle: 'Preserve',
    preserveHighlight: 'Your Style.',
    preserveDesc: 'We only change the top garment and your face.',
    faceLabel: 'Face ID',
    bodyLabel: 'Base Photo (Body)',
    clothingLabel: 'Top Garment / Color',
    renderBtn: 'Render with Precision',
    uploadPhoto: 'Upload Photo',
    uploadGarment: 'Upload Garment',
    missingPhotos: 'Missing photos for rendering.',
    protectingOutfit: 'Protecting outfit and background...',
    engineError: 'Component engine failure.',
    precisionError: 'Precision error. Try with frontal photos.',
    updateError: 'Visual update error.',
    editBtn: 'Edit',
    chatPlaceholder: 'Change color, long sleeves...',
    outfitPreserved: 'Outfit Preserved',
    seamlessId: 'Seamless ID',
    segmented: 'Outfit segmented. Pants and background preserved.',

    // Onboarding
    next: 'Next',
    begin: 'Begin',

    // Paywall
    auraPro: 'Agalaz Pro',
    precisionTotal: 'Total',
    precisionTitle: 'Precision',
    getPro: 'Get Pro $4.99/mo',
    payFeat1: 'Original outfit preservation',
    payFeat2: 'Seamless face mapping',
    payFeat3: 'Unlimited renders',
    payFeat4: 'Background & environment protected',
    payFeat5: 'Support for complex garments',
    restorePurchase: 'Restore Purchase',
  },
  es: {
    start: 'Empezar',
    tryNow: 'Probar Ahora Gratis',
    howItWorks: 'Cómo funciona',

    heroLine1: 'PRUEBA',
    heroLine2: 'ANTES DE',
    heroLine3: 'COMPRAR.',
    heroDesc: 'Sube tu foto, elige cualquier prenda y ve cómo te queda al instante. IA que respeta tu cuerpo real.',
    activeUsers: '+10,000 usuarios activos',

    featuresTitle: 'Precisión',
    featuresTitleHighlight: 'Quirúrgica',
    featuresSubtitle: 'Motor de componentes V7.0 — cada píxel preservado, cada prenda respetada.',
    feat1Title: 'Preservación Total',
    feat1Desc: 'Tus pantalones, calzado y fondo original se mantienen intactos. Solo cambiamos lo que pidas.',
    feat2Title: 'Mapeo Facial Real',
    feat2Desc: 'Agalaz integra tu identidad sobre tu cuerpo real, respetando tu fisonomía y cuello.',
    feat3Title: 'Color & Estilo',
    feat3Desc: 'Extraemos el ADN de la prenda nueva y lo adaptamos a tu silueta sin deformaciones.',

    stepsTitle: '3 Fotos.',
    stepsTitleHighlight: '1 Render.',
    step1Label: 'ID Rostro',
    step1Desc: 'Sube una foto de tu cara para el mapeo facial.',
    step2Label: 'Foto Base',
    step2Desc: 'Una foto de cuerpo completo — preservamos todo excepto la prenda superior.',
    step3Label: 'Prenda Nueva',
    step3Desc: 'Elige la prenda que quieres probar — extraemos su color y estilo.',

    ctaLabel: 'Comienza Gratis',
    ctaTitle: 'Tu Estilo,',
    ctaTitleHighlight: 'Preservado.',
    ctaDesc: '10 renders gratuitos. Sin tarjeta de crédito. Sin compromisos.',

    footerCopy: '© 2025 Agalaz Labs. Motor de Precisión V7.0',
    privacy: 'Privacidad',
    terms: 'Términos',

    preserveTitle: 'Preservar',
    preserveHighlight: 'Tu Estilo.',
    preserveDesc: 'Solo cambiamos la prenda superior y tu rostro.',
    faceLabel: 'ID Rostro',
    bodyLabel: 'Foto Base (Cuerpo)',
    clothingLabel: 'Color/Prenda Superior',
    renderBtn: 'Renderizar con Precisión',
    uploadPhoto: 'Subir Foto',
    uploadGarment: 'Subir Prenda',
    missingPhotos: 'Faltan fotos para el renderizado.',
    protectingOutfit: 'Protegiendo outfit y fondo...',
    engineError: 'Falla en el motor de componentes.',
    precisionError: 'Error de precisión. Intenta con fotos frontales.',
    updateError: 'Error en la actualización visual.',
    editBtn: 'Editar',
    chatPlaceholder: 'Solo cambiar color, manga larga...',
    outfitPreserved: 'Outfit Preservado',
    seamlessId: 'Seamless ID',
    segmented: 'Outfit segmentado. Pantalones y fondo preservados.',

    next: 'Siguiente',
    begin: 'Comenzar',

    auraPro: 'Agalaz Pro',
    precisionTotal: 'Total',
    precisionTitle: 'Precisión',
    getPro: 'Obtener Pro $4.99/mes',
    payFeat1: 'Preservación de outfit original',
    payFeat2: 'Mapeo facial sin costuras',
    payFeat3: 'Renders ilimitados',
    payFeat4: 'Fondo y entorno protegidos',
    payFeat5: 'Soporte para prendas complejas',
    restorePurchase: 'Restaurar Compra',
  },
} as const;

type Translations = (typeof translations)[Lang];

type TranslationKeys = { [K in keyof typeof translations.en]: string };

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationKeys;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en as TranslationKeys,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(c => c.startsWith('agalaz-lang='));
    const saved = cookie?.split('=')[1] as Lang | undefined;
    if (saved === 'es' || saved === 'en') {
      setLangState(saved);
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
      setLangState(browserLang);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    document.cookie = `agalaz-lang=${newLang}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax`;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] as TranslationKeys }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
