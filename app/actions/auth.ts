'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function signUp(name: string, email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) {
      console.error('Error creating user in Supabase Auth:', error.message);
      throw new Error('Failed to create user in Supabase Auth');
    }

    if (!data || !data.user) {
      throw new Error('User creation failed, no user data returned');
    }

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'An error occurred during signup' };
  }
}
