"use client"

import Image from "next/image";
import googleLogo from "@/public/google.png"
import { signIn } from "next-auth/react";

/**
 * A button component that signs in with Google using next-auth.
 * @returns A JSX button element.
 */
export function GoogleSignInButton() {
    /**
     * Handles the button click event to sign in with Google.
     * Initiates the sign-in process using NextAuth's signIn method,
     * redirecting the user to the home page upon successful authentication.
     */
    const handleClick = () => {
        signIn("google", { callbackUrl: "/home" });
    };

    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl  transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-400 cursor-pointer"
        >
            <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
            <span className="ml-4">Continue with Google</span>
        </button>
    );
}

/* export function NewSignInButton () {
    ... e.g. GitLab, GitHub, etc.
} */