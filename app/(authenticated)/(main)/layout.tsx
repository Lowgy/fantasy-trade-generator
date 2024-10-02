import { ReactNode } from 'react';
import NavBar from '@/components/nav-bar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
