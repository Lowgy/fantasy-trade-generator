import { ReactNode } from 'react';
import { getSession } from 'next-auth/react';
import SessionProvider from '@/components/session-provider';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FantasyTradePro',
  description: 'AI-powered fantasy football trade generator',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
