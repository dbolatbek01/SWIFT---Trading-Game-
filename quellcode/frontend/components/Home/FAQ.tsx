'use client';

import { useState } from 'react';

/**
 * The FAQ component displays a list of frequently asked questions about SWIFT trading simulator.
 *
 * It renders a list of questions and answers, where each question is a button that can be clicked to reveal or hide the answer.
 *
 * @returns A JSX element representing the FAQ component.
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is SWIFT completely free to use?",
      answer: "Yes, SWIFT is completely free to use. We use paper money (virtual currency) for all trading activities, so there's no real money at risk."
    },
    {
      question: "How do the daily competitions work?",
      answer: "Each day, all players try to beat the NASDAQ. You can trade throughout the day, and at the end of the trading session, your performance is measured against the NASDAQ. Winners are determined by comparing your returns against the NASDAQ." //Each day, all players start with the same amount of capital. You can trade throughout the day, and at the end of the trading session, all portfolios are automatically liquidated. Winners are determined by comparing your returns against the NASDAQ and other players
    },
    {
      question: "What stocks can I trade on SWIFT?",
      answer: "You can trade most stocks that are part of the most famous indexes. We provide real-time market data so you can practice with actual market conditions."
    },
    {
      question: "Are my trading statistics saved?",
      answer: "Yes, we save your performance history so you can track your progress over time."
    },
    {
      question: "Are there trading fees in the simulation?",
      answer: "Yes, we simulate realistic trading fees to help you learn about the impact of transaction costs on your overall returns. This creates a more authentic trading experience."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-[#1a202c] via-[#2d3748] to-[#1a202c]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about SWIFT trading simulator.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className={`w-full text-left p-4 flex justify-between items-center rounded-lg ${openIndex === index ? 'bg-blue-600' : 'bg-gray-800'} transition-colors duration-300`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-white flex items-center">
                  {faq.question}
                  {(faq.question === "Can I create private groups with my friends?" ||
                    faq.question === "Are there trading fees in the simulation?") && (
                    <span className="ml-3 inline-block bg-yellow-400 text-slate-900 font-bold rounded-lg px-3 py-1 text-xs">
                      COMING SOON
                    </span>
                  )}
                </span>
                <span className="text-white ml-2">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-800 rounded-b-lg mt-px">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
