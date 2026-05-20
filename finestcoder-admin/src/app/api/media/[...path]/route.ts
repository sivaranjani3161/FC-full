import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/backendUrl';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  // path = ['uploads', 'filename.jpg'] → fetch from backend at /uploads/filename.jpg
  const target = `${BACKEND_URL}/${path.join('/')}`;

  try {
    const upstream = await fetch(target, { cache: 'no-store' });
    const buf = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    return new NextResponse(buf, {
      status: upstream.status,
      headers: { 'content-type': contentType, 'cache-control': 'public, max-age=86400' },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
