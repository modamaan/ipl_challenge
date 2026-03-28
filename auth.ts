import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !user.name) return false;

      // Check if user exists in database
      const existingUser = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
      
      // If not, create them
      if (existingUser.length === 0) {
        await db.insert(users).values({
          name: user.name,
          email: user.email,
          image: user.image || null,
        });
      }
      return true;
    },
    async session({ session }) {
      if (session.user && session.user.email) {
        // Fetch user from DB to attach ID to the session
        const dbUser = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
        if (dbUser.length > 0) {
          session.user.id = dbUser[0].id;
        }
      }
      return session;
    }
  }
});
