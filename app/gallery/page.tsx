import type { Metadata } from "next";
import GalleryWall from "@/components/GalleryWall";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Gallery | Lulu Modern Chinese",
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
        image={{ src: "/images/film-bar-wide.webp", alt: "The back bar at Lulu Modern at night", focus: [0.4, 0.5] }}
        mobileImage={{ src: "/images/film-pour-tall.webp", focus: [0.5, 0.5] }}
        video={{ desktop: "/video/bar-wide.mp4", mobile: "/video/pour-tall.mp4" }}
        dim={0.3}
      />
      <GalleryWall />
    </main>
  );
}
