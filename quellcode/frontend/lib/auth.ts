import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { custom } from "openid-client";
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch, { RequestInit } from 'node-fetch';
import { GoogleTokenResponse } from "@/types/interfaces";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

// Interface for token refresh
interface RefreshTokenRequest {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
}

/**
 * Optional HTTP proxy configuration for OpenID client requests.
 * If enabled, sets all outgoing openid-client requests to use the provided proxy.
 */
const proxyON = true;
if (proxyON) {
  // Proxy URL for outgoing requests
  const proxy = 'http://proxy.th-wildau.de:8080';

  // Create a proxy agent for HTTPS requests
  const agent = new HttpsProxyAgent(proxy);

  // Set the proxy agent as the default for all requests made by openid-client
  custom.setHttpOptionsDefaults({
    timeout: 3500,  // Set request timeout (in ms)
    agent: agent,   // Use the proxy agent
  });
}

/**
 * NextAuth configuration object for authentication.
 * - Uses Google as the OAuth provider.
 * - Passes the accessToken from the provider to both JWT token and session object.
 */
/**
 * Refreshes an expired Google access token using the refresh token
 */
async function refreshAccessToken(token: RefreshTokenRequest) {
  try {
    if (!token.refreshToken) {
      throw new Error('No refresh token available');
    }

    const url = "https://oauth2.googleapis.com/token";
    const body = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    });

    // Proxy-Agent für Token-Refresh verwenden
    const proxy = 'http://proxy.th-wildau.de:8080';
    const agent = new HttpsProxyAgent(proxy);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: body,
      agent,
    } as RequestInit);

    const refreshedTokens = await response.json() as GoogleTokenResponse;

    if (!response.ok) {
      console.error("Token refresh failed:", refreshedTokens);
      throw refreshedTokens;
    }

    console.log("Successfully refreshed access token");
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Keep old refresh token if no new one
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authConfig: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    scope: "openid email profile",
                    access_type: "offline", // This is crucial for getting refresh token
                    prompt: "consent", // Forces consent screen to get refresh token
                },
            },
        }),
    ],
    events: {
        /**
         * Triggered after successful sign-in
         * Automatically loads stocks in the background
         */
        async signIn({ account }) {
            if (account?.access_token) {
                // Load stocks in the background using our service
                const { loadStocksOnSignIn } = await import('./stockService');
                await loadStocksOnSignIn(account.access_token);
            }
        }
    },
    callbacks: {
        /**
         * JWT callback.
         * Handles access token and refresh token management.
         */
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at! * 1000; // Convert to milliseconds
                return token;
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Access token has expired, try to refresh it
            return refreshAccessToken(token);
        },
        /**
         * Session callback.
         * Adds the access token from the JWT to the session object.
         */
        async session({ session, token }) {
            if (token.error) {
                // Force sign out if refresh failed
                session.error = "RefreshAccessTokenError";
            }
            session.accessToken = token.accessToken as string;
            return session;
        },

    },
}