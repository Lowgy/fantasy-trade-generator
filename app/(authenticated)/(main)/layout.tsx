import { ReactNode } from 'react';
import NavBar from '@/components/nav-bar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}
