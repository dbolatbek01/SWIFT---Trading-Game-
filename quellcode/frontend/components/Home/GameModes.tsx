'use client';

import Link from 'next/link';

/**
 * Renders the Services section, displaying various trading game modes. 
 * Each mode includes a title, description, and a link to participate.
 */

export default function Services() {
  const gameTypes = [
    {
      title: 'Daily Challenge',
      description: 'Compete in 24-hour trading sessions where you need to beat the NASDAQ.',
      color: 'from-blue-600 to-blue-400',
      link: '/home'
    },
    {
      title: 'Seasonal Competitions',
      description: 'Join our long-term seasonal competitions where you can track your progress over time.',
      color: 'from-green-600 to-green-400',
      link: '/home'
    }
  ];

  return (
    <section id="game-modes" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Game Modes
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Different ways to test your trading skills and compete with others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gameTypes.map((gameType, index) => (
            <div key={index} className="relative overflow-hidden rounded-xl group">
              <div className={`absolute inset-0 bg-gradient-to-br ${gameType.color} opacity-90 group-hover:opacity-100 transition duration-300`}></div>
              <div className="relative p-8 h-full flex flex-col items-center min-h-[300px]">
                <h3 className="text-2xl font-bold mb-4 text-white flex items-center justify-center">
                  {gameType.title}
                </h3>
                <p className="text-white/80 mb-6 text-center">{gameType.description}</p>
                <div className="mt-auto flex items-center justify-center">
                  <Link href={gameType.link}>
                    <button className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition duration-300 backdrop-blur-sm">
                      Play Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

