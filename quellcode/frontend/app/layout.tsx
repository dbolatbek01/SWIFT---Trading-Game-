import './globals.css';
import { Metadata } from 'next';
import SessionProviderWrapper from '../components/SessionProviderWrapper';
import AutoLogoutProvider from '../components/AutoLogoutProvider';

export const metadata: Metadata = {
  title: {
    template: '%s | SWIFT',
    default: 'SWIFT Trading',
  },
  description: 'The official SWIFT Trading Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen text-white bg-black overflow-hidden">
        <SessionProviderWrapper>
          <AutoLogoutProvider>
            <div className="flex h-full">
              <main className="flex-1 bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] overflow-auto">
                {children}
              </main>
            </div>
          </AutoLogoutProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
