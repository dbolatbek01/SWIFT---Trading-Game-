'use client';

import Link from 'next/link';

/**
 * Cta component renders a call-to-action section encouraging users to test
 * their trading skills with the SWIFT application.
 */

export default function Cta() {
  return (
    <section id="cta" className="py-20 bg-gradient-to-r from-[#4fbcd9] via-[#1ca7d1] to-[#028bb8]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Test Your Trading Skills?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of traders already using SWIFT to practice strategies and compete risk-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition duration-300">
                Create Account
              </button>
            </Link>
            {/* <Link href="/leaderboard">
              <button className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition duration-300">
                View Leaderboard
              </button>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}
