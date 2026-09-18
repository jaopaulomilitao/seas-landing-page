// src/app/layout.tsx
import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SEAS - I Semana da Escrita Acadêmica de Sobral',
  description: 'Onde sua pesquisa ganha forma e voz.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning é adicionado ao html e body
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${jakartaSans.variable} light`} suppressHydrationWarning>
      <body 
        className="bg-seas-bgLight text-gray-900 dark:bg-seas-bgDark dark:text-gray-100 font-sans antialiased overflow-x-hidden relative"
        suppressHydrationWarning
      >
        {children}
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />
      </body>
    </html>
  );
}