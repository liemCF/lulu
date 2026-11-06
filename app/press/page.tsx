import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reviews from "@/components/Reviews";
import { info, links } from "@/lib/content";

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
        intro="Coverage, awards and guest reviews for Lulu Modern and the Flaming Peking Duck."
        image={{ src: "/images/duck-neon.webp", alt: "The Flaming Peking Duck set alight tableside" }}
      />
      <Reviews />
      <section className="px-5 py-24 sm:px-10 lg:py-32 lg:pl-24">
        <p className="eyebrow mb-4">Media inquiries</p>
        <h2 className="t-h2 max-w-2xl">For interviews, features and photography, get in touch with the team.</h2>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={links.phone} className="btn btn-solid">
            Call {info.phone}
          </a>
          <a href={links.instagram} target="_blank" rel="noreferrer" className="btn text-cream">
            Instagram ↗
          </a>
        </div>
      </section>
    </main>
  );
}
