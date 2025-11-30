import type { NextConfig } from 'next'

/**
 * Next.js configuration object for the application.
 * - Configures the Next.js Image component to allow loading images from 'lh3.googleusercontent.com' via HTTPS.
 * - This is required for displaying Google profile images.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig