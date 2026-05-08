import Image, { type ImageProps } from "next/image";

import { Section } from "@/components/web/Section";
import { cn } from "@/lib/utils";

type HeroWrapperProps = React.PropsWithChildren & {
  className?: string;
};

function HeroWrapper({
  className,
  children,
}: HeroWrapperProps): React.ReactNode {
  return <div className={cn("bg-background", className)}>{children}</div>;
}

type HeroProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  actions?: React.ReactNode;
  image: ImageProps;
};

function HeroContent({
  title,
  body,
  actions,
  image,
}: HeroProps): React.ReactNode {
  return (
    <Section>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4 lg:gap-8">
          <h1 className="w-full text-center font-heading text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl lg:text-left">
            {title}
          </h1>
          <p className="w-full text-center text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8 lg:text-left">
            {body}
          </p>
          {actions && (
            <div className="flex w-full items-center justify-center lg:justify-start">
              {actions}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          {/* The image prop is typed with the ImageProps type from next/image. */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image {...image} />
        </div>
      </div>
    </Section>
  );
}

function HeroDefault(props: HeroProps): React.ReactNode {
  return (
    <HeroWrapper>
      <HeroContent {...props} />
    </HeroWrapper>
  );
}

export const Hero = Object.assign(HeroDefault, {
  Wrapper: HeroWrapper,
  Content: HeroContent,
});
