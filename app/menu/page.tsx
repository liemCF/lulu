import type { Metadata } from "next";
import MenuBoard from "@/components/MenuBoard";
import PageHeader from "@/components/PageHeader";
import { links } from "@/lib/content";

export const metadata: Metadata = {
  title: "Menu | Lulu Modern Chinese",
  description: "Dim sum, Flaming Peking Duck, wok classics, signature cocktails and bottle service at Lulu Modern Chinese, Plano.",
};

export default function MenuPage() {
  return (
    <main>
      <PageHeader
        eyebrow="The Menu"
        cn="菜单"
        title={
          <>
            Inspired by Asia. <em className="gold-foil">Designed for Today.</em>
          </>
        }
        intro="From signature duck and dim sum favorites to chef-driven creations, every dish reflects our commitment to quality ingredients, bold flavors, and elevated hospitality."
        image={{ src: "/images/film-feast-wide.webp", alt: "A table laid with dishes from across the menu", focus: [0.5, 0.5] }}
        mobileImage={{ src: "/images/film-steam-tall.webp", focus: [0.5, 0.5] }}
        video={{ desktop: "/video/feast-wide.mp4", mobile: "/video/steam-tall.mp4" }}
        dim={0.42}
      >
        <div className="flex flex-wrap gap-3">
          <a href={links.reserve} target="_blank" rel="noreferrer" className="btn btn-solid">
            Reserve a Table
          </a>
          <a href={links.order} target="_blank" rel="noreferrer" className="btn text-cream">
            Order Online
          </a>
        </div>
      </PageHeader>
      <MenuBoard />
    </main>
  );
}
