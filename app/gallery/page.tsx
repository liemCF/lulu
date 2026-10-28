import type { Metadata } from "next";
import GalleryWall from "@/components/GalleryWall";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Gallery — Lulu Modern Chinese",
  description: "The duck, the dim sum, the bar and the late nights at Lulu Modern Chinese in Plano.",
};

export default function GalleryPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Gallery"
        cn="影"
        title={
          <>
            Follow the <em className="gold-foil">Experience</em>
          </>
        }
        intro="Signature tableside presentations, the room on a full night, and everything in between."
      />
      <GalleryWall />
    </main>
  );
}
