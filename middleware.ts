import { NextRequest, NextResponse } from 'next/server'
 
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
 
export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = origin === (process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || "http://localhost:3000");
 
  const isPreflight = request.method === 'OPTIONS';
 
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders });
  }
 
  const response = NextResponse.next();
 
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
 
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  })
 
  return response;
}
 
export const config = {
  matcher: '/api/:path*',
}