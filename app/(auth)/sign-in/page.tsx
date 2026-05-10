import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { SignInForm } from "@/components/web/auth/SignInForm";
import { Section } from "@/components/web/Section";

export const metadata: Metadata = {
  title: "bed.dev | Sign In",
  description:
    "Sign in to get started with the demo application using Next.js and Convex",
};

export default function SignInPage(): React.ReactNode {
  return (
    <Section>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="w-full text-center text-2xl font-bold">Sign In</h1>
          <p className="w-full text-center text-sm text-muted-foreground">
            Provide your credentials to get started
          </p>
        </div>

        <Separator className="my-4 w-full max-w-sm" />

        <SignInForm />
      </div>
    </Section>
  );
}
