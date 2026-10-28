import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PrivateEvents from "@/components/PrivateEvents";
import { links } from "@/lib/content";

export const metadata: Metadata = {
  title: "Private Dining & Events — Lulu Modern Chinese",
  description:
    "Private dining, full buy-outs and cocktail receptions in Plano: seated dinners up to 120 guests, standing events for 150+.",
};

export default function PrivateDiningPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Private Dining & Events"
        cn="宴"
        title={
          <>
            For Every <em className="gold-foil">Occasion</em>
          </>
        }
        intro="Host your next celebration at Lulu. From corporate dinners to private parties, we offer tailored menus, flexible layouts, and attentive service."
        image={{ src: "/images/private-table.webp", alt: "A long table set for a celebration" }}
      >
        <div className="flex flex-wrap gap-3">
          <a href={links.phone} className="btn btn-solid">
            Plan Your Event
          </a>
          <a href={links.privateInquiry} target="_blank" rel="noreferrer" className="btn text-cream">
            Enquiry form ↗
          </a>
        </div>
      </PageHeader>
      <PrivateEvents />
    </main>
  );
}
