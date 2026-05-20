import { NextRequest } from 'next/server';
import { forwardToBackend } from '@/lib/api/proxy';

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(req: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return forwardToBackend(req, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
