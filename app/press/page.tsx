import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reviews from "@/components/Reviews";

export const metadata: Metadata = {
  title: "Press — Lulu Modern Chinese",
  description: "Press, awards and guest reviews for Lulu Modern Chinese, home of the Flaming Peking Duck in Plano, TX.",
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
        image={{ src: "/images/duck-neon.webp", alt: "The Flaming Peking Duck set alight tableside" }}
      />
      <Reviews />
    </main>
  );
}
