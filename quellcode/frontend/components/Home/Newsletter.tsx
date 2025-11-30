'use client';

/**
 * Newsletter component renders a subscription section for users to stay updated
 * with trading tips, market insights, and SWIFT competition announcements.
 */

export default function Newsletter() {
  return (
    <section id="newsletter" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Stay Updated
            <span className="ml-3 inline-block bg-yellow-400 text-slate-900 font-bold rounded-lg px-3 py-1 text-xs">
              COMING SOON
            </span>
          </h2>
          <p className="text-gray-400 mb-8">
            Subscribe to our newsletter for trading tips, market insights, and SWIFT competition announcements.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Subscribe
            </button>
          </form>
          <p className="text-gray-500 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
