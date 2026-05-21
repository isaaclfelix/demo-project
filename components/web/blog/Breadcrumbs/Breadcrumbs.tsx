import Link from "next/link";

export type BreadcrumbItem = { label: string; href: string };

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** Index of the item that is the current page (no link). Defaults to last. */
  currentIndex?: number;
};

export function Breadcrumbs({ items, currentIndex }: BreadcrumbsProps) {
  const current = currentIndex ?? items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="underline-offset-4 hover:underline">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.href}-${i}`} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {i === current ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
