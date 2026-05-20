import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { BACKEND_URL } from '@/lib/api/backendUrl';
import type { PermissionsMap } from '@/types/auth';

const MODULES = ['courses', 'blogs', 'gallery', 'enquiries', 'testimonials'] as const;
const OPS = ['create', 'read', 'update', 'delete', 'custom'] as const;

function buildPermissionsMap(
  permissions: Array<{ code: string }> = [],
): PermissionsMap {
  const permsMap: PermissionsMap = {};
  for (const mod of MODULES) {
    permsMap[mod] = {};
    for (const op of OPS) {
      permsMap[mod][op] = permissions.some((p) => p.code === `${mod}:${op}`);
    }
  }
  return permsMap;
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    '⚠️  NEXTAUTH_SECRET is not set. Generate one with: openssl rand -base64 32',
  );
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    '⚠️  Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are not configured',
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login?error=Configuration',
  },
  secret:
    process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user?.email) {
        try {
          const res = await fetch(
            `${BACKEND_URL}/api/users/by-email/${encodeURIComponent(user.email)}`,
          );
          if (res.ok) {
            const dbUser = await res.json();
            token.role = dbUser.role?.code ?? 'viewer';
            token.roleId = dbUser.roleId;
            token.roleName = dbUser.role?.name ?? 'Viewer';
            token.dbUserId = dbUser.id;
            token.permissions = buildPermissionsMap(dbUser.role?.permissions);
          } else {
            token.role = 'unauthorized';
            token.permissions = {};
          }
        } catch (e) {
          console.error('Failed to fetch user from DB:', e);
          token.role = 'unauthorized';
          token.permissions = {};
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as import('@/types/auth').SessionUser;
        u.role = token.role as string;
        u.roleId = token.roleId as number;
        u.roleName = token.roleName as string;
        u.dbUserId = token.dbUserId as number;
        u.permissions = token.permissions as PermissionsMap;
      }
      return session;
    },
  },
};
