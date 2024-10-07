'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/session-provider';
import { logout } from '@/app/(auth)/actions';
import { TrophyIcon } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

function AuthButton() {
  const { user } = useSession();

  const handleSignOut = () => {
    logout();
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-dark-gray dark:text-almost-white">
          {user.name}
        </span>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="border-light-blue text-light-blue hover:bg-light-blue hover:text-white"
        >
          Sign out
        </Button>
      </div>
    );
  }

  return null;
}

export default function NavBar() {
  return (
    <nav className="bg-white dark:bg-lighter-charcoal shadow-sm border-b border-divider-light dark:border-darker-gray">
      <div className="w-full">
        <div className="flex justify-between h-16 px-4">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <TrophyIcon className="h-8 w-8 text-blue dark:text-light-blue" />
              <span className="ml-2 text-xl font-bold text-dark-gray dark:text-almost-white">
                FantasyTradePro
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                href="/generator"
                className="border-transparent text-gray dark:text-light-gray-dark hover:border-blue dark:hover:border-light-blue hover:text-blue dark:hover:text-light-blue inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Generator
              </Link>
              <Link
                href="/settings"
                className="border-transparent text-gray dark:text-light-gray-dark hover:border-blue dark:hover:border-light-blue hover:text-blue dark:hover:text-light-blue inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Settings
              </Link>
            </div>
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
