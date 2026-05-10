import { redirect } from "next/navigation";

import { getCurrentConvexUser } from "@/lib/auth/getCurrentConvexUser";

export default async function AuthLayout({
  children,
}: React.PropsWithChildren): Promise<React.ReactNode> {
  const user = await getCurrentConvexUser();

  if (user) {
    redirect("/");
  }

  return <>{children}</>;
}
