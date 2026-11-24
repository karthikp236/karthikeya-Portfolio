import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'P Karthikeya — AI & Full-Stack Developer',
  description: 'Portfolio of P Karthikeya, a computer science undergraduate building intelligent, scalable web applications and AI-powered products.',
  openGraph: { title: 'P Karthikeya — AI & Full-Stack Developer', description: 'Building intelligent digital experiences.', type: 'website' },
  keywords: ['P Karthikeya', 'AI Developer', 'Full-Stack Developer', 'React', 'Next.js', 'LangChain', 'LangGraph', 'MCP'],
  authors: [{ name: 'P Karthikeya' }],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
