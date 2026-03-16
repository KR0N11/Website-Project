import Navbar           from "@/components/Navbar";
import Hero             from "@/components/Hero";
import Services         from "@/components/Services";
import Facilities       from "@/components/Facilities";
import Pricing          from "@/components/Pricing";
import Booking          from "@/components/Booking";
import FAQ              from "@/components/FAQ";
import Stats            from "@/components/Stats";
import Footer           from "@/components/Footer";
import FloatingReserve  from "@/components/FloatingReserve";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Booking />
        <Services />
        <Facilities />
        <Pricing />
        <FAQ />
        <Stats />
      </main>
      <Footer />
      <FloatingReserve />
    </>
  );
}
