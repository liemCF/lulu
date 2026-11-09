import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { hours, info, links } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact — Lulu Modern Chinese",
  description: `Find Lulu Modern Chinese at ${info.address}, ${info.city}. Hours, directions, phone and reservations.`,
};

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${info.name}, ${info.address}, ${info.city}`)}&output=embed`;

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        cn="访"
        title="Contact"
        intro={
          <>
            {info.address}, {info.city}
          </>
        }
      >
        <div className="flex flex-wrap gap-3">
          <a href={links.reserve} target="_blank" rel="noreferrer" className="btn btn-solid">
            Reserve a Table
          </a>
          <a href={links.directions} target="_blank" rel="noreferrer" className="btn text-cream">
            Get Directions ↗
          </a>
        </div>
      </PageHeader>

      <section className="grid gap-12 border-t border-gold/15 px-5 py-20 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:py-28 lg:pl-24">
        <div className="space-y-10 lg:col-span-4">
          <div>
            <p className="eyebrow mb-3">Call</p>
            <a href={links.phone} className="link-line font-display text-3xl">
              {info.phone}
            </a>
          </div>
          <div>
            <p className="eyebrow mb-3">Hours</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
              {hours.map((h) => (
                <div key={h.day} className="contents">
                  <dt className="text-cream/65">{h.day}</dt>
                  <dd className={h.time === "Closed" ? "text-cream/55" : "text-cream/90"}>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="eyebrow mb-3">Order & events</p>
            <div className="flex flex-col gap-1.5">
              <a href={links.order} target="_blank" rel="noreferrer" className="link-line w-fit text-cream/85">
                Order online (Toast) ↗
              </a>
              <a href="/private-dining" className="link-line w-fit text-cream/85">
                Private dining & events
              </a>
            </div>
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-[1rem_4rem_1rem_4rem] lg:col-span-8 lg:min-h-[520px]">
          <iframe
            title={`Map to ${info.name}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.4)_contrast(1.05)]"
          />
        </div>
      </section>
    </main>
  );
}
