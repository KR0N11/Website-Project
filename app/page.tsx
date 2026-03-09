import Navbar     from "@/components/Navbar";
import Hero       from "@/components/Hero";
import Facilities from "@/components/Facilities";
import Booking    from "@/components/Booking";
import Stats      from "@/components/Stats";
import FAQ        from "@/components/FAQ";
import Footer     from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Facilities />
        <Booking />
        <Stats />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
