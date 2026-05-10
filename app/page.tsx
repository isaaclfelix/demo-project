import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Hero } from "@/components/web/Hero";
import HeroImage from "@/assets/hero_image.webp";

export const metadata: Metadata = {
  title: "bed.dev | Home",
  description: "A demo application using Next.js and Convex",
};

export default function Home() {
  return (
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
          alt: "Next.js + Convex",
          width: 600,
          height: 600,
          priority: true,
          fetchPriority: "high",
          style: { objectFit: "cover" },
        }}
      />
    </main>
  );
}
