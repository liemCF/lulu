import AfterDark from "@/components/AfterDark";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import MenuShowcase from "@/components/MenuShowcase";
import PrivateDining from "@/components/PrivateDining";
import Reviews from "@/components/Reviews";
import Signature from "@/components/Signature";
import Story from "@/components/Story";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Signature />
      <MenuShowcase />
      <AfterDark />
      <Story />
      <Reviews />
      <PrivateDining />
      <Gallery />
    </main>
  );
}
