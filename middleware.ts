import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Routes to protect
  const isAdminRoute = pathname.startsWith('/admin');
  const isUploadApi = pathname.startsWith('/api/upload');
  const isSeriesMutation = pathname.startsWith('/api/series') && req.method !== 'GET';
  const isPaiementApi = pathname.startsWith('/api/paiements'); // Assuming this exists

  if (isAdminRoute || isUploadApi || isSeriesMutation || isPaiementApi) {
    const token = req.cookies.get('gts_session')?.value;

    if (!token) {
      // Pas de token, redirection vers login si c'est une page
      if (isAdminRoute && !pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return new NextResponse('Accès refusé', { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      if (isAdminRoute && !pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return new NextResponse('Session invalide', { status: 401 });
    }

    // Gestion des rôles
    const role = payload.role;

    // Règles pour l'admin (qui gère PDFs mais PAS paiements)
    if (role === 'admin') {
      if (pathname.startsWith('/admin/paiements') || isPaiementApi) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    // Règles pour le prof (qui gère paiements mais PAS PDFs)
    if (role === 'prof') {
      if (
        (isAdminRoute && !pathname.startsWith('/admin/paiements') && !pathname.startsWith('/admin/profil')) ||
        isUploadApi ||
        isSeriesMutation
      ) {
        return NextResponse.redirect(new URL('/admin/paiements', req.url));
      }
    }

    // Tout est bon
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/upload', '/api/series', '/api/paiements/:path*'],
};
