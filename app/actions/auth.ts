'use server'

import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface AuthCredentials {
    email: string;
    password: string;
}

export async function login({email, password}: AuthCredentials) {

  const {data, error} = await supabase.auth.signInWithPassword({email, password})

  if(error || !data.session) {
    return error?.message
  }
  const supabaseAccessToken = data.session.access_token

  
  const cookieStore = await cookies();

  cookieStore.set('auth_token', supabaseAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax'
  });

  redirect('/tasks');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/login');
}

export async function register({email, password}: AuthCredentials){
    const {data, error} = await supabase.auth.signUp({email, password})
    if(error || !data.user){
        return error?.message
    }
    if(data.session){
        const supabaseAccessToken = data.session.access_token
  
  const cookieStore = await cookies();

  cookieStore.set('auth_token', supabaseAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax'
  });

  redirect('/tasks');
    }
}