import { Navigation } from "@/components/web/Navigation";

export default function Home() {
  return (
    <div>
      <Navigation />
      <main className="bg-secondary">
        <h1 className="font-mono text-secondary-foreground">Hello World!</h1>
      </main>
    </div>
  );
}
