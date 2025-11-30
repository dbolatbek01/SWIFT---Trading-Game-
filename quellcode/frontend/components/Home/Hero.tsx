'use client';

import Link from 'next/link';

/**
 * The Hero component is the main landing page component that displays the introduction
 * to the SWIFT Inc. trading simulator. It contains a call-to-action button to start
 * trading, a link to the "How It Works" section, and a link to the "About" section.
 */
export default function Hero() {
  return (
    <section id="hero" className="py-60 bg-gradient-to-b from-[#1a202c] via-[#2d3748] to-[#1a202c] relative">
      {/* Top Right Auth Buttons */}
      <div className="absolute top-8 right-8 flex gap-4">
        <Link href="/login" className="px-6 py-2 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition duration-300">
          Login
        </Link>
        <Link href="/login?mode=signup" className="px-6 py-2 bg-gradient-to-r from-[#4fbcd9] via-[#1ca7d1] to-[#028bb8] text-white font-medium rounded-lg hover:opacity-90 transition duration-300">
          Sign Up
        </Link>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Master 
            </span>{" "}
            the Market with
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              SWIFT Inc.
            </span>{" "}
          </h2>        
          <p className="text-xl text-gray-300 mb-10">
            <span className="inline">
            The ultimate trading simulator to
            </span>{" "}
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
            test your skills
            </span>{" "}
            against the NASDAQ with zero risk
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-12 py-4 flex items-center justify-center bg-gradient-to-r from-[#4fbcd9] via-[#1ca7d1] to-[#028bb8] text-white font-medium rounded-lg hover:opacity-90 transition duration-300">
              Start Trading
            </Link>
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-12 py-4 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition duration-300"
            >
              How It Works
            </a>
          </div>
          <p className="text-gray-400 mt-6">
            Or <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text"
            >
              Learn More
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
