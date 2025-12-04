import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="border-t border-[#DCD8D3]" />
      <Benefits />
      <div className="border-t border-[#DCD8D3]" />
      <Pricing />
      <div className="border-t border-[#DCD8D3]" />
      <FAQ />
    </main>
  );
}
