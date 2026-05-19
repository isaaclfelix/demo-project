import Link from "next/link";

type AnchorProps = {
  children: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
};

export function Anchor({ children, ...props }: AnchorProps) {
  return (
    <Link
      className="font-medium text-primary-foreground no-underline underline-offset-4 visited:text-primary-foreground visited:underline hover:text-primary-foreground hover:underline"
      {...props}
    >
      {children}
    </Link>
  );
}
