'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSession } from '@/app/(main)/session-provider';
import { logout } from '@/app/(auth)/actions';

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
}

export default function NavBar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/placeholder.svg?height=32&width=32&text=FTP"
                alt="FantasyTradePro Logo"
                width={32}
                height={32}
              />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
          </div>
          <div className="flex items-center">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
