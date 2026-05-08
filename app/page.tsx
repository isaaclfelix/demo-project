import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Hero } from "@/components/web/Hero";
import { Navigation } from "@/components/web/Navigation";
import HeroImage from "@/assets/hero_image.webp";

export default function Home() {
  return (
    <div>
      <Navigation />
      <main>
        <Hero
          title={
            <>
              Next.js <br />+<br /> Convex
            </>
          }
          body={
            <>
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
            </>
          }
          actions={
            <Button size="lg" aria-label="Go to blog link" asChild>
              <Link href="/blog">See it in action</Link>
            </Button>
          }
          image={{
            src: HeroImage,
            alt: "Next.js + WordPress",
            width: 600,
            height: 600,
            priority: true,
            fetchPriority: "high",
            style: { objectFit: "cover" },
          }}
        />
      </main>
    </div>
  );
}
