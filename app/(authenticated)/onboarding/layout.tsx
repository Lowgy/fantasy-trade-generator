import { ReactNode } from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
  );
}
