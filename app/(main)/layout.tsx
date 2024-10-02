import { ReactNode } from 'react';
import { validateRequest } from '@/auth';
import NavBar from '@/components/nav-bar';
import SessionProvider from './session-provider';
import { redirect } from 'next/navigation';

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await validateRequest();
  if (!session.user) {
    redirect('/login');
  }
  return (
    <SessionProvider value={session}>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
