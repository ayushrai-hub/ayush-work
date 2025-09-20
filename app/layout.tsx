import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../src/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ayush Rai | AI Engineer & Full Stack Developer',
  description: 'Portfolio of Ayush Rai – AI Engineer, Developer, and Polymath specializing in Generative AI, Web Development, and Data Science.',
  keywords: 'AI Engineer, Machine Learning, Full Stack Developer, Data Science, RLHF, LLM',
  authors: [{ name: 'Ayush Rai' }],
  openGraph: {
    title: 'Ayush Rai | Portfolio',
    description: 'AI Engineer, Developer, and Polymath',
    type: 'website',
    url: 'https://ayush-me.netlify.app/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VBS0YJ07R8"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VBS0YJ07R8');
            `,
          }}
        />
        {/* Suppress hydration warnings for browser extension attributes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('hydration')) {
                  // Suppress hydration errors caused by browser extensions
                  console.warn('Hydration warning suppressed (likely browser extension)');
                  e.preventDefault();
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 safe-area`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
