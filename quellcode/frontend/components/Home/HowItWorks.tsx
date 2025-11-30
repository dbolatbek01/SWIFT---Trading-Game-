'use client';

/**
 * The HowItWorks component explains the basic steps to get started with SWIFT.
 *
 * It displays four steps: Sign Up, Build Portfolio, Trade & Compete, and Track Results.
 *
 * @returns {JSX.Element} The HowItWorks component.
 */
export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account in seconds and get ready to start trading with $10K in paper money.'
    },
    {
      number: '02',
      title: 'Build Portfolio',
      description: 'Research and select stocks to create your trading portfolio within a daily trading session.'
    },
    {
      number: '03',
      title: 'Trade & Compete',
      description: 'Buy and sell stocks throughout the day to maximize your returns and beat the NASDAQ.'
    },
    {
      number: '04',
      title: 'Track Results',
      description: 'Oversee your portfolio and compare it to the NASDAQ.' // Compare your performance against others and see if you made the leaderboard as a top trader.
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get started with SWIFT in four simple steps and test your trading skills against the market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition duration-300">
              <div className="text-blue-500 font-bold text-xl mb-4">{step.number}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
