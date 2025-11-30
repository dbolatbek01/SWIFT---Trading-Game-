'use client';

/**
 * A component that renders a section with quotes from people who use SWIFT.
 *
 * This is done by mapping over an array of testimonial objects.
 *
 */
export default function Testimonials() {
  const testimonials = [
    {
      quote: "SWIFT has completely changed how I approach trading. I can test strategies without risking real money, and the daily competition keep me engaged.",
      author: "Paul Lorenz",
      position: "Professional Trader, 1 Year with SWIFT"
    },
    {
      quote: "The portfolio page has given me insights I never had before. I've been able to identify my trading patterns and improve my decision-making.",
      author: "Enrico Wölck",
      position: "Business Student, 1 Year with SWIFT"
    },
    {
      quote: "Competing against the NASDAQ has made learning about the stock market actually fun! We've all improved so much since we started.",
      author: "Niels Grosche",
      position: "Finance Guy, 1 year with SWIFT"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-[#1a202c] via-[#2d3748] to-[#1a202c]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            What Our Players Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from traders who use SWIFT to practice and improve their skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="text-2xl text-blue-400 mb-4">👤</div>
              <p className="text-gray-300 mb-6">{testimonial.quote}</p>
              <div>
                <p className="font-bold text-white">{testimonial.author}</p>
                <p className="text-gray-400 text-sm">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
