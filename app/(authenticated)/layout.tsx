import { ReactNode } from 'react';
import { validateRequest } from '@/auth';
import SessionProvider from '@/components/session-provider';
import { redirect } from 'next/navigation';

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
    <SessionProvider value={session}>
      <div className="min-h-screen bg-gray-100">{children}</div>
    </SessionProvider>
  );
}
