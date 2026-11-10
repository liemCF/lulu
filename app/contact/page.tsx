import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import { hours, info, links } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact | Lulu Modern Chinese",
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
        image={{ src: "/images/film-plated-wide.webp", alt: "Carved Peking duck with pancakes and condiments", focus: [0.5, 0.5] }}
        mobileImage={{ src: "/images/film-feast-tall.webp", focus: [0.5, 0.5] }}
        video={{ desktop: "/video/plated-wide.mp4", mobile: "/video/feast-tall.mp4" }}
        dim={0.5}
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

      <section className="border-t border-gold/15 px-5 py-20 sm:px-10 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            {/* Left: Interactive Guest Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right: Direct Information, Hours & Map */}
            <div className="space-y-8 lg:col-span-5">
              <div className="rounded-2xl border border-cream/15 bg-night/50 p-6 sm:p-8 backdrop-blur-md space-y-7 shadow-xl">
                <div>
                  <p className="eyebrow mb-2 text-gold">Direct Line</p>
                  <a href={links.phone} className="link-line font-display text-2xl sm:text-3xl text-cream hover:text-gold transition-colors">
                    {info.phone}
                  </a>
                </div>
                <div>
                  <p className="eyebrow mb-2 text-gold">Email Concierge</p>
                  <a href={links.email} className="link-line font-display text-xl text-gold-soft hover:text-gold transition-colors">
                    {info.email}
                  </a>
                </div>
                <div>
                  <p className="eyebrow mb-3 text-gold">Hours of Hospitality</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.92rem]">
                    {hours.map((h) => (
                      <div key={h.day} className="contents">
                        <dt className="text-cream/70 font-medium">{h.day}</dt>
                        <dd className={h.time === "Closed" ? "text-gold/60" : "text-cream/90"}>{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="border-t border-cream/10 pt-5">
                  <p className="eyebrow mb-2 text-gold">Location</p>
                  <p className="text-cream font-display text-lg">{info.address}</p>
                  <p className="text-cream/70">{info.city}</p>
                  <a href={links.directions} target="_blank" rel="noreferrer" className="inline-block mt-3 text-gold hover:underline text-sm font-medium">
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>

              {/* Map embed */}
              <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-gold/20 shadow-xl">
                <iframe
                  title={`Map to ${info.name}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.3)_contrast(1.08)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
