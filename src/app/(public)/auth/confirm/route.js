import { createClient } from '@/utils/supabase/server-supabase-instance'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard' // Default to dashboard

  if (code) {
    const supabase = await createClient()

    // Exchange the code for a session with PKCE flow
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect user to specified redirect URL or dashboard
      redirect(next)
    }
  }

  // Redirect the user to an error page with some instructions
  redirect('/auth/auth-code-error')
}