import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import StoryChapters from "@/components/StoryChapters";

export const metadata: Metadata = {
  title: "Our Story — Lulu Modern Chinese",
  description:
    "Lulu Modern Chinese was born from the Asian American experience: Chinese flavors and family traditions, reimagined with New York energy.",
};

export default function StoryPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Story"
        cn="品味"
        compact
        title={
          <>
            Where tradition, culture, and Asian American creativity <em className="gold-foil">come together.</em>
          </>
        }
        image={{ src: "/images/night-room.webp", alt: "The dining room at Lulu on a full night" }}
      />
      <StoryChapters />
    </main>
  );
}
