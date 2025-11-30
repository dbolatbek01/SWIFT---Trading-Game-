'use client';

/**
 * Renders a section displaying various features of the trading platform.
 * Each feature includes a title, description, and an icon.
 * The section is styled with a gradient background and responsive grid layout.
 */

export default function Features() {
  const features = [
    {
      title: 'Real-time Market Data',
      description: 'Access up-to-date stock prices and market information to make informed trading decisions.',
      icon: '📈'
    },
    {
      title: 'Risk-Free Trading',
      description: 'Practice with paper money and develop your skills without losing real capital.',
      icon: '🛡️'
    },
    {
      title: 'Challenge the Market',
      description: 'Try to beat the NASDAQ with your portfolio performance.', //Compete against other traders and try to beat the NASDAQ with your portfolio performance.
      icon: '🏆'
    },
    {
      title: 'Portfolio Management',
      description: 'Track your investments, analyze performance, and make strategic adjustments.',
      icon: '💼'
    },
    {
      title: 'Social Trading',
      description: 'Climb the ranks of our Leaderboard and improve your SWIFT-Value.',
      icon: '👥'
    },
    {
      title: 'Trading Metrics',
      description: 'Analyze your performance and learn from your trades.',
      icon: '📊'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-[#1a202c] via-[#2d3748] to-[#1a202c]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Game Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to practice trading and compete against others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
