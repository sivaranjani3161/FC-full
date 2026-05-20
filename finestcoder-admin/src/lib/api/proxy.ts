import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from './backendUrl';

export async function forwardToBackend(req: NextRequest, path: string[]) {
  const joinedPath = path.join('/');
  const query = req.nextUrl.search || '';
  const target = `${BACKEND_URL}/api/${joinedPath}${query}`;

  const headers = new Headers();
  const incomingContentType = req.headers.get('content-type');
  if (incomingContentType) headers.set('content-type', incomingContentType);

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: 'no-store',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (incomingContentType?.includes('multipart/form-data')) {
      init.body = await req.formData();
      headers.delete('content-type');
    } else {
      init.body = await req.text();
    }
  }

  try {
    const upstream = await fetch(target, init);
    const body = await upstream.text();

    if (!upstream.ok) {
      console.error(
        `[proxy] ${req.method} ${target} → ${upstream.status} ${upstream.statusText}\n`,
        body.slice(0, 500),
      );
    }

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to connect to backend';
    console.error(`[proxy] fetch failed for ${target}:`, message);
    return NextResponse.json(
      {
        error: 'Backend service unavailable',
        details: message,
        target,
      },
      { status: 502 },
    );
  }
}
