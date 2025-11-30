'use client';
 
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import ScrollToTop from "@/components/ScrollToTop";
import { GoogleSignInButton } from "@/components/Login/authButtons";
import { isMaintenanceTime } from "@/components/Login/MaintenanceConfig";
import { MaintenanceMessage } from "@/components/Login/MaintenanceMessage";

/**
 * The login page content component.
 * 
 * This component is responsible for rendering the login page content. It is a
 * wrapper around the GoogleSignInButton component, and renders a heading and a
 * background gradient.
 * 
 * The isSignup variable is used to determine whether the heading should be
 * "Create a new account" or "Login to your account".
 * 
 * During the configured maintenance window, login is disabled and
 * a maintenance message is displayed.
 */
function LoginContent() {
  const searchParams = useSearchParams();
  const isSignup = searchParams.get('mode') === 'signup';
  const [isMaintenance, setIsMaintenance] = useState(false);
  
  useEffect(() => {
    // Check maintenance status on mount
    const maintenanceStatus = isMaintenanceTime();
    
    setIsMaintenance(maintenanceStatus);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a202c] via-[#2d3748] to-[#1a202c] px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {isSignup ? 'Create a new account' : 'Login to your account'}
          </h2>
        </div>
        
        {isMaintenance ? (
          <MaintenanceMessage />
        ) : (
          <GoogleSignInButton />
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}
 
/**
 * LoginPage
 * 
 * This component serves as the main login page of the application.
 * It wraps the LoginContent component with React's Suspense to handle
 * asynchronous loading. While the LoginContent is being loaded, a
 * fallback loading message is displayed to the user.
 */

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}