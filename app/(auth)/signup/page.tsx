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
import SignUpForm from './sign-up-form';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-dark-charcoal">
      <Card className="w-full max-w-md bg-white dark:bg-lighter-charcoal border-divider-light dark:border-darker-gray">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-dark-gray dark:text-almost-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-gray dark:text-light-gray-dark">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray dark:text-light-gray-dark w-full">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue hover:text-blue/90 dark:text-light-blue dark:hover:text-light-blue/90 hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
