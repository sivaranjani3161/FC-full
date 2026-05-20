import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    "⚠️  NEXTAUTH_SECRET is not set. Generate one with: openssl rand -base64 32"
  );
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    "⚠️  Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are not configured"
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login?error=Configuration",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-production",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // On first sign-in, look up the user in the DB
      if (account && user?.email) {
        try {
          const res = await fetch(
            `${BACKEND_URL}/api/users/by-email/${encodeURIComponent(user.email)}`
          );
          if (res.ok) {
            const dbUser = await res.json();
            token.role = dbUser.role?.code ?? "viewer";
            token.roleId = dbUser.roleId;
            token.roleName = dbUser.role?.name ?? "Viewer";
            token.dbUserId = dbUser.id;
            // Build permissions map from role.permissions array
            const permsMap: Record<string, Record<string, boolean>> = {};
            const MODULES = ["courses","blogs","gallery","enquiries","testimonials"];
            const OPS = ["create","read","update","delete","custom"];
            for (const mod of MODULES) {
              permsMap[mod] = {};
              for (const op of OPS) {
                permsMap[mod][op] = (dbUser.role?.permissions || []).some(
                  (p: { code: string }) => p.code === `${mod}:${op}`
                );
              }
            }
            token.permissions = permsMap;
          } else {
            // User not found in DB — mark as unauthorized
            token.role = "unauthorized";
            token.permissions = {};
          }
        } catch (e) {
          console.error("Failed to fetch user from DB:", e);
          token.role = "unauthorized";
          token.permissions = {};
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).roleId = token.roleId;
        (session.user as any).roleName = token.roleName;
        (session.user as any).dbUserId = token.dbUserId;
        (session.user as any).permissions = token.permissions;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
