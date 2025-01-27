'use server';

import prisma from '@/lib/prisma';
import { lucia } from '@/auth';
import { LoginValues, loginSchema } from '@/lib/validation';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { verify } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(
  credentials: LoginValues
): Promise<{ error: string }> {
  try {
    const { email, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return { error: 'Invalid email or password.' };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return { error: 'Invalid email or password.' };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    console.log(existingUser.onboarded);

    if (existingUser.onboarded) {
      return redirect('/generator');
    } else {
      return redirect('/onboarding');
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: 'An error occurred. Please try again.' };
  }
}
