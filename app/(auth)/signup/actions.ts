'use server';

import prisma from '@/lib/prisma';
import { lucia } from '@/auth';
import { SignUpValues, signUpSchema } from '@/lib/validation';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string }> {
  try {
    const { email, name, password } = signUpSchema.parse(credentials);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    if (existingUser) {
      return {
        error: 'An account with this email already exists.',
      };
    }

    await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect('/login');
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: 'Something went wrong. Please try again.',
    };
  }
}
