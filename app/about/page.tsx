import type { Metadata } from "next";
import MeetChef from "@/components/MeetChef";
import PageHeader from "@/components/PageHeader";
import StoryChapters from "@/components/StoryChapters";

export const metadata: Metadata = {
  title: "About | Lulu Modern Chinese",
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
        image={{ src: "/images/film-story-wide.webp", alt: "Lulu, the muse of the restaurant, in a silk qipao", focus: [0.5, 0.4] }}
        mobileImage={{ src: "/images/film-story-tall.webp", focus: [0.5, 0.45] }}
        video={{ desktop: "/video/story-wide.mp4", mobile: "/video/story-tall.mp4" }}
        dim={0.2}
      />
      <MeetChef id="chef" showCta={false} number="厨" />
      <StoryChapters />
    </main>
  );
}
