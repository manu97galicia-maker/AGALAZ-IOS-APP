import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura Fashion AI - Prueba Ropa con Inteligencia Artificial',
  description:
    'Sube tu foto, elige cualquier prenda y ve cómo te queda al instante. Virtual Try-On con IA que respeta tu cuerpo real. Preservación total de outfit, mapeo facial sin costuras.',
  keywords: [
    'virtual try-on',
    'prueba de ropa virtual',
    'inteligencia artificial moda',
    'AI fashion',
    'probador virtual',
    'Aura Fashion',
  ],
  openGraph: {
    title: 'Aura Fashion AI - Virtual Try-On con IA',
    description:
      'Prueba cualquier prenda antes de comprar. IA que respeta tu cuerpo real con preservación total de outfit.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Aura Fashion AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Fashion AI - Virtual Try-On con IA',
    description:
      'Prueba cualquier prenda antes de comprar. IA que respeta tu cuerpo real.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
