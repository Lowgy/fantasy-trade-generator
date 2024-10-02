'use client';

import { useState, useTransition } from 'react';
import { loginSchema, LoginValues } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from './actions';
import LoadingButton from '@/components/loading-button';
import { PasswordInput } from '@/components/password-input';

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await login(values);
      if (error) {
        setError(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <MailIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="m@example.com"
                    {...field}
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" className="w-full" loading={isPending}>
          Login
        </LoadingButton>
      </form>
    </Form>
  );
}
