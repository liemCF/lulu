import type { Metadata } from "next";
import MeetChef from "@/components/MeetChef";
import PageHeader from "@/components/PageHeader";
import StoryChapters from "@/components/StoryChapters";

export const metadata: Metadata = {
  title: "About — Lulu Modern Chinese",
  description:
    "Lulu Modern was born from the Asian American experience. Meet Executive Chef Natalie Deprez and read the full founder story.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About"
        cn="品味"
        compact
        title={
          <>
            Rooted in Culture. <em className="gold-foil">Inspired by Evolution.</em>
          </>
        }
        intro="Lulu Modern was born from the Asian American experience: tradition and innovation, side by side."
        image={{ src: "/images/night-room.webp", alt: "The dining room at Lulu on a full night" }}
      />
      <MeetChef id="chef" showCta={false} />
      <StoryChapters />
    </main>
  );
}
