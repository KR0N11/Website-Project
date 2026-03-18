import Navbar     from "@/components/Navbar";
import Hero       from "@/components/Hero";
import Services   from "@/components/Services";
import Facilities from "@/components/Facilities";
import Pricing    from "@/components/Pricing";
import FAQ        from "@/components/FAQ";
import Stats      from "@/components/Stats";
import Footer     from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Facilities />
        <Pricing />
        <FAQ />
        <Stats />
      </main>
      <Footer />
    </>
  );
}
