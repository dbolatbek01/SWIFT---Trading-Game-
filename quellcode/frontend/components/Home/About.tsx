'use client';

import Image from "next/image";

/**
 * The About component renders a page section that presents information about the SWIFT platform.
 */
export default function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#1a202c] via-[#2d3748] to-[#1a202c]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              About SWIFT
            </h2>
            <p className="text-gray-300 mb-6">
              SWIFT is a realistic trading simulator that lets you practice stock trading with paper money. Challenge yourself against the NASDAQ index and develop your trading skills in a risk-free environment.
            </p>
            <p className="text-gray-300 mb-6">
              Our mission is to help aspiring traders learn the ins and outs of the market without risking real capital, focusing on what truly matters - building experience and confidence.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div>
                <p className="text-3xl font-bold text-blue-500 mb-2">Unlimited</p>
                <p className="text-gray-400">Daily Trades</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-500 mb-2">7</p>
                <p className="text-gray-400">Active Developers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-500 mb-2">$10K</p>
                <p className="text-gray-400">Starting Capital</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-500 mb-2">900+</p>
                <p className="text-gray-400">Available Stocks</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 rounded-xl overflow-hidden relative aspect-video flex items-center justify-center bg-black">
            <Image
              src="/HomePage.png" // <-- Passe den Pfad ggf. an!
              alt="Trading View Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="p-10 text-center relative z-10">
              <p className="text-2xl text-white font-bold">SWIFT</p>
              <p className="text-white opacity-90">Trade. Learn. Compete.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
