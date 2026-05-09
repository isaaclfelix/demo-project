import { Separator } from "@/components/ui/separator";

export function Footer(): React.ReactNode {
  return (
    <footer>
      <Separator />
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} bed.dev. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
