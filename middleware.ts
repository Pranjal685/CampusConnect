import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (path.startsWith('/org') || path.startsWith('/ambassador')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (path.startsWith('/org') && profile?.role !== 'org') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (path.startsWith('/ambassador') && profile?.role !== 'ambassador') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  if (path === '/auth' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Fix 3: no profile row = orphaned auth user (signup profile insert failed)
    // Sign out to clear the bad session — prevents /auth ↔ /dashboard redirect loop.
    // supabase.auth.signOut() calls setAll which writes cleared cookies onto `response`,
    // so returning `response` here serves /auth with a clean session state.
    if (!profile) {
      await supabase.auth.signOut();
      return response;
    }

    const dest = profile.role === 'org' ? '/org/dashboard' : '/ambassador/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/org/:path*', '/ambassador/:path*', '/auth'],
};
