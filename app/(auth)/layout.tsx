import { redirect } from "next/navigation";

import { getCurrentConvexUser } from "@/lib/auth/getCurrentConvexUser";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentConvexUser();

  if (user) {
    redirect("/");
  }

  return <>{children}</>;
}
