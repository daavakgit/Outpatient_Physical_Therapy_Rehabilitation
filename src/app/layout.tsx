import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RehabPulse — Outpatient Physical Therapy Rehabilitation Milestone Tracker',
  description: 'Clinical-grade outpatient physical therapy milestone tracking and patient portal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-glacier-bg text-slate-900 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
