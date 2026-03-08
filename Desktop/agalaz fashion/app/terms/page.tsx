'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-white/30 text-sm font-bold hover:text-white/50 transition-colors press-scale mb-8">
          <ChevronLeft size={16} />
          Back
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
        <p className="text-white/20 text-sm mb-8">Last updated: March 2026</p>

        <div className="space-y-6 text-white/50 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-black text-white mb-2">1. Acceptance of Terms</h2>
            <p>By using Aura Fashion AI, you agree to these terms. If you do not agree, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">2. Service Description</h2>
            <p>Aura Fashion AI provides AI-powered virtual clothing try-on. Results are generated using artificial intelligence and may not perfectly represent real-world appearance. The service is provided &ldquo;as is&rdquo; without guarantees of accuracy.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">3. Free & Pro Plans</h2>
            <p>Free users receive 10 renders. Pro subscriptions at $4.99/month provide unlimited renders and are billed monthly. You can cancel at any time through your account settings or the App Store.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">4. User Content</h2>
            <p>You retain all rights to images you upload. By using our service, you grant us a temporary, limited license to process your images for the purpose of generating try-on results. We do not claim ownership of your content.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">5. Prohibited Use</h2>
            <p>You may not use this service for generating inappropriate, harmful, or misleading content. We reserve the right to terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">6. Limitation of Liability</h2>
            <p>Aura Labs shall not be liable for any indirect, incidental, or consequential damages arising from the use of this service.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-2">7. Contact</h2>
            <p>For questions about these terms, contact us at <span className="text-indigo-400">legal@agalaz.com</span></p>
          </section>
        </div>
      </div>
    </main>
  );
}
