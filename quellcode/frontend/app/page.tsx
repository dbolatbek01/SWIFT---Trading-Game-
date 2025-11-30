'use client';

import Hero from '../components/Home/Hero';
import StockTickers from '../components/Home/StockTickers';
import About from '../components/Home/About';
import HowItWorks from '../components/Home/HowItWorks';
import Features from '../components/Home/Features';
import Services from '../components/Home/GameModes';
import Cta from '../components/Home/Cta';
import Testimonials from '../components/Home/Testimonials';
import Newsletter from '../components/Home/Newsletter';
import FAQ from '../components/Home/FAQ';
import ScrollToTop from '../components/ScrollToTop';

/**
 * The WelcomePage component renders the main landing page of the Swift app.
 * It is the first page users see when they open the app.
 */
export default function WelcomePage() {
  return (
    <>
      <Hero />
      <StockTickers />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Newsletter />
      <FAQ />
      <ScrollToTop />
    </>
  );
}