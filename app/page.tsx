import Celebrations from "@/components/Celebrations";
import Hero from "@/components/Hero";
import MeetChef from "@/components/MeetChef";
import MenuShowcase from "@/components/MenuShowcase";
import Panorama from "@/components/Panorama";
import Reviews from "@/components/Reviews";
import SignatureDish from "@/components/SignatureDish";
import TwoWorlds from "@/components/TwoWorlds";

// Homepage order and copy follow the client's "Recommended Homepage Structure" doc exactly:
// Experience → Signature Dish → Menu → Chef → Story → Social Proof → Private Dining → Instagram → Reservation.
export default function Home() {
  return (
    <main>
      {/* 1. Hero */}
      <Hero />
      {/* 2. The Signature Experience: The Dish Everyone Talks About */}
      <SignatureDish />
      {/* 3. New Asian Menu */}
      <MenuShowcase />
      {/* 4. Meet the Chef */}
      <MeetChef />
      {/* 5. Our Story */}
      <TwoWorlds />
      {/* 6. Featured Recognition: What People Are Saying */}
      <Reviews />
      {/* 7. Private Dining & Celebrations */}
      <Celebrations />
      {/* 8. Instagram Gallery */}
      <Panorama />
      {/* 9. Final CTA: "Experience Lulu Modern" is the top of the site footer (Visit) */}
    </main>
  );
}
