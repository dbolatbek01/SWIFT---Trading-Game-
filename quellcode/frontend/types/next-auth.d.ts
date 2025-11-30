import "next-auth";

/**
 * Extends the NextAuth.js Session and JWT types
 * to include an optional accessToken property.
 * This allows TypeScript to recognize session.accessToken and token.accessToken
 * throughout the project when using next-auth.
 */
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  
  interface JWT {
    accessToken?: string;
  }
}