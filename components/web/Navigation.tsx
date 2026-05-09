import { NavigationClient } from "@/components/web/NavigationClient";
import { isAuthenticated } from "@/lib/auth/isAuthenticated";

export async function Navigation(): Promise<React.ReactNode> {
  const isClerkAuthenticated = await isAuthenticated();

  return <NavigationClient isInitiallyAuthenticated={isClerkAuthenticated} />;
}
