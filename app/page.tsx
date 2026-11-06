import HeroFlame from "@/components/home/HeroFlame";
import MenuCard from "@/components/home/MenuCard";
import { DuckSection, GuestsSection, NightSection } from "@/components/home/Sections";

// Test redesign (Nov 2026): blue-and-white porcelain, one motion moment in the hero.
export default function Home() {
  return (
    <main>
      <HeroFlame />
      <DuckSection />
      <MenuCard />
      <NightSection />
      <GuestsSection />
    </main>
  );
}
