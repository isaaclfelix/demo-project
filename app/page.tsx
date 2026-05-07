import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Hero } from "@/components/web/Hero";
import { Navigation } from "@/components/web/Navigation";
import HeroImage from "@/assets/hero_image.webp";

export default function Home() {
  return (
    <div>
      <Navigation />
      <main>
        <Hero.Wrapper className="bg-background">
          <Hero.Content
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
              <ButtonGroup>
                <Button>Get started</Button>
                <Button variant="outline">Learn more</Button>
              </ButtonGroup>
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
        </Hero.Wrapper>
      </main>
    </div>
  );
}
