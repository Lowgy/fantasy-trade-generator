'use client';

import { useState, useTransition } from 'react';
import { signUpSchema, SignUpValues } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from './actions';

import { UserIcon, MailIcon } from 'lucide-react';
import LoadingButton from '@/components/loading-button';
import { PasswordInput } from '@/components/password-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function SignUpForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await signUp(values);
      if (error) {
        setError(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-center text-red dark:text-red">{error}</p>}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-gray dark:text-almost-white">
                Name
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray dark:text-light-gray-dark"
                    size={20}
                  />
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="pl-10 bg-light-gray dark:bg-dark-charcoal text-dark-gray dark:text-almost-white border-divider-light dark:border-darker-gray focus:ring-2 focus:ring-blue dark:focus:ring-light-blue"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red dark:text-red" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-gray dark:text-almost-white">
                Email
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <MailIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray dark:text-light-gray-dark"
                    size={20}
                  />
                  <Input
                    placeholder="m@example.com"
                    {...field}
                    className="pl-10 bg-light-gray dark:bg-dark-charcoal text-dark-gray dark:text-almost-white border-divider-light dark:border-darker-gray focus:ring-2 focus:ring-blue dark:focus:ring-light-blue"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red dark:text-red" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark-gray dark:text-almost-white">
                Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Password"
                  {...field}
                  className="bg-light-gray dark:bg-dark-charcoal text-dark-gray dark:text-almost-white border-divider-light dark:border-darker-gray focus:ring-2 focus:ring-blue dark:focus:ring-light-blue"
                />
              </FormControl>
              <FormMessage className="text-red dark:text-red" />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isPending}
          type="submit"
          className="w-full bg-blue text-white hover:bg-blue/90 dark:bg-light-blue dark:text-dark-charcoal dark:hover:bg-light-blue/90"
        >
          Create account
        </LoadingButton>
      </form>
    </Form>
  );
}
