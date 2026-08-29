import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Routes to protect
  const isAdminRoute = pathname.startsWith('/admin');
  const isUploadApi = pathname.startsWith('/api/upload');
  const isSeriesMutation = pathname.startsWith('/api/series') && req.method !== 'GET';

  if (isAdminRoute || isUploadApi || isSeriesMutation) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Now using email = password concept or default admin/gts2026
      const validUser = process.env.ADMIN_USER || 'admin@gts.sn';
      const validPassword = process.env.ADMIN_PASSWORD || 'gts2026';

      if (user === validUser && pwd === validPassword) {
        return NextResponse.next();
      }
    }
    
    return new NextResponse('Accès refusé', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Espace Admin GTS"',
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/upload', '/api/series'],
};
