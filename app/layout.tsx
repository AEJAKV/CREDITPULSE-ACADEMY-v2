import type { Metadata } from 'next';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './globals.css';
import './premium.css';
import { ExperienceMotion } from '@/components/experience';
export const metadata: Metadata = {
  title: { default: 'Credit Pulse Academy', template: '%s · Credit Pulse Academy' },
  description:
    'Private learning for Credit Pulse members. Your course, your progress, and a clear path from Starter to Elite.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <ExperienceMotion />
      </body>
    </html>
  );
}
