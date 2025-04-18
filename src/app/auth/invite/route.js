import { createClient } from '@/utils/supabase/server-supabase-instance';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('access_token');
  const type = searchParams.get('type')

  if (token_hash && type) {
    const supabase = await createClient();

    // Verify the token and authenticate the user
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBIC_URL}/auth/error`); // Handle errors
    }

    // Redirect to the desired page after successful auth
    return NextResponse.redirect(`${process.env.NEXT_PUBIC_URL}/auth/complete-signup`);
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBIC_URL}/auth/error`); // Fallback for invalid params
}