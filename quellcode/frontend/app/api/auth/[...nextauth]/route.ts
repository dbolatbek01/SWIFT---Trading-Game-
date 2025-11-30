/**
 * API Route for NextAuth authentication
 * 
 * This route is the API endpoint for NextAuth.js, which provides server-side session
 * management and authentication. It is used to handle login, logout, and session
 * management requests from the client.
 * 
 * The route is not intended to be accessed directly by users, but rather should be
 * accessed via the `signIn`, `signOut`, and `session` methods provided by
 * `next-auth/client`.
 * 
 */

import { authConfig } from "@/lib/auth";
import NextAuth from "next-auth/next";

// handler = main entry point for the NextAuth API
const handler = NextAuth(authConfig);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST }