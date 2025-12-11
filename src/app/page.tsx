import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';


import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Benefits />
      <Pricing />
      <div className="border-t border-[#DCD8D3]" />
      <FAQ />
      <Footer />
    </div>
  );
}
