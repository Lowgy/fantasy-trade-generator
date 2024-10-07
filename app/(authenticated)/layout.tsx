import { ReactNode } from 'react';
import { validateRequest } from '@/auth';
import SessionProvider from '@/components/session-provider';
import { redirect } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await validateRequest();
  if (!session.user) {
    redirect('/login');
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider value={session}>
        <div className="min-h-screen bg-background">{children}</div>
      </SessionProvider>
    </ThemeProvider>
  );
}
