import type { Metadata } from "next";
import Magnetic from "@/components/Magnetic";
import PageHeader from "@/components/PageHeader";
import Reviews from "@/components/Reviews";
import { info } from "@/lib/content";

export const metadata: Metadata = {
  title: "Press | Lulu Modern Chinese",
  description: "Press coverage and guest reviews for Lulu Modern Chinese, home of the Flaming Peking Duck in Plano, TX.",
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
        intro="Read critical coverage and reviews for Lulu Modern Chinese across Dallas-Fort Worth."
      />

      {/* Reviews and press articles. Awards go here once the client supplies real ones. */}
      <Reviews heading={false} />

      {/* Press & Media Relations Section */}
      <section className="border-t border-cream/15 bg-ink px-5 py-20 text-center sm:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl space-y-5">
          <p className="eyebrow text-gold">Media &amp; Press Inquiries</p>
          <h3 className="font-display text-3xl sm:text-4xl text-cream">
            Covering the Story of <em className="text-gold-soft font-serif italic">Lulu Modern</em>
          </h3>
          <p className="text-cream/75 text-[0.98rem] leading-relaxed">
            For press kits, high-resolution photography, filming requests, or interview inquiries with Executive Chef Natalie Deprez and Founder Sunny Chang, please contact our guest relations desk.
          </p>
          <div className="pt-3">
            <Magnetic strength={0.35}>
              <a
                href={`mailto:${info.email}?subject=Press%20Inquiry%20-%20Lulu%20Modern`}
                className="btn btn-solid shadow-lg shadow-gold/15"
              >
                Contact Press Relations ↗
              </a>
            </Magnetic>
          </div>
        </div>
      </section>
    </main>
  );
}
