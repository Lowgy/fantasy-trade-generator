'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/session-provider';
import { logout } from '@/app/(auth)/actions';
import { TrophyIcon } from 'lucide-react';

function AuthButton() {
  const { user } = useSession();

  const handleSignOut = () => {
    logout();
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
        <Button onClick={handleSignOut} variant="outline" size="sm">
          Sign out
        </Button>
      </div>
    );
  }

  return null;
}

export default function NavBar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full">
        <div className="flex justify-between h-16 px-4">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <TrophyIcon className="h-8 w-8 text-gray-800" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                FantasyTradePro
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                href="/generator"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Generator
              </Link>
              <Link
                href="/settings"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Settings
              </Link>
            </div>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
