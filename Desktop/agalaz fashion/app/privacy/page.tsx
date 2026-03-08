'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-white/30 text-sm font-bold hover:text-white/50 transition-colors press-scale mb-8">
          <ChevronLeft size={16} />
          Back
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-white/20 text-sm mb-8">Last updated: March 2026</p>

        <div className="space-y-6 text-white/50 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-black text-white mb-2">1. Information We Collect</h2>
            <p>Agalaz Fashion collects images you upload for virtual try-on processing. These images are processed in real-time and are <strong className="text-white/70">not stored permanently</strong> on our servers. We may collect basic usage analytics and account information if you sign in.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">2. How We Use Your Data</h2>
            <p>Your photos are used exclusively for generating virtual try-on results using AI. We do not sell, share, or use your images for training AI models. Images are processed via Google Gemini API and are subject to their privacy policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">3. Data Storage</h2>
            <p>Images uploaded for try-on are processed in memory and discarded after the session. Account data (email, name) is stored securely via Supabase with encryption at rest.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">4. Third-Party Services</h2>
            <p>We use Google Gemini for AI processing, Supabase for authentication, and Stripe for payment processing. Each service has its own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">5. Your Rights</h2>
            <p>You can request deletion of your account and all associated data at any time by contacting us. You have the right to access, correct, or delete your personal information under GDPR and applicable privacy laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">6. Contact</h2>
            <p>For privacy-related inquiries, contact us at <span className="text-indigo-400">privacy@agalaz.com</span></p>
          </section>
        </div>
      </div>
    </main>
  );
}
