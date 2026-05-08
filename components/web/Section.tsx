import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type SectionProps = PropsWithChildren & {
  className?: string;
};

export function Section({
  className,
  children,
}: SectionProps): React.ReactNode {
  return (
    <section className={cn("mx-auto max-w-7xl p-6 lg:px-8", className)}>
      {children}
    </section>
  );
}
