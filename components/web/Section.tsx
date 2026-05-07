import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type SectionProps = PropsWithChildren & {
  className?: string;
};

export function Section({
  className,
  children,
}: SectionProps): React.ReactNode {
  const userClasses = className ? className.split(" ") : [];

  const defaultClasses = ["mx-auto", "max-w-7xl", "p-6", "lg:px-8"];

  const componentClasses = [...defaultClasses, ...userClasses];

  return <section className={cn(...componentClasses)}>{children}</section>;
}
