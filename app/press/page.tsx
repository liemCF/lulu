import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reviews from "@/components/Reviews";

export const metadata: Metadata = {
  title: "Press | Lulu Modern Chinese",
  description: "Press and guest reviews for Lulu Modern Chinese, home of the Flaming Peking Duck in Plano, TX.",
};

export default function PressPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Press"
        cn="誉"
        title={
          <>
            What People <em className="gold-foil">Are Saying</em>
          </>
        }
        image={{ src: "/images/film-hero-wide.webp", alt: "The Flaming Peking Duck set alight tableside", focus: [0.4, 0.5] }}
        mobileImage={{ src: "/images/film-hero-tall.webp", focus: [0.5, 0.6] }}
        video={{ desktop: "/video/hero-wide.mp4", mobile: "/video/hero-tall.mp4" }}
        dim={0.3}
      />
      <Reviews heading={false} />
    </main>
  );
}
