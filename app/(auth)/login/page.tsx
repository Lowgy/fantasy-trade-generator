'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-charcoal">
      <Card className="w-full max-w-md bg-white dark:bg-lighter-charcoal border-divider-light dark:border-darker-gray">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-dark-gray dark:text-almost-white">
            Login
          </CardTitle>
          <CardDescription className="text-center text-gray dark:text-light-gray-dark">
            Enter your details to log in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray dark:text-light-gray-dark">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-blue hover:text-blue/90 dark:text-light-blue dark:hover:text-light-blue/90 hover:underline"
            >
              Sign up
            </Link>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-center text-blue hover:text-blue/90 dark:text-light-blue dark:hover:text-light-blue/90 hover:underline"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
