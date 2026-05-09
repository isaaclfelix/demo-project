"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";

import { useClerk } from "@clerk/nextjs";
import { ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useConvexAuth } from "convex/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DarkModeToggleButton } from "@/components/web/DarkModeToggleButton";
import { cn } from "@/lib/utils";

type NavigationLinkObject = {
  key: string;
  node: React.ReactNode;
};

type NavigationLinkProps = {
  className?: string;
};

function getNavigationLinks({
  className,
}: NavigationLinkProps = {}): NavigationLinkObject[] {
  return [
    {
      key: "home",
      node: (
        <Link href="/" aria-label="Home link" className={className}>
          Home
        </Link>
      ),
    },
    {
      key: "blog",
      node: (
        <Link href="/blog" aria-label="Blog link" className={className}>
          Blog
        </Link>
      ),
    },
  ];
}

function NavigationSignInButton(): React.ReactNode {
  return (
    <Button variant="outline" size="lg" aria-label="Sign in button" asChild>
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}

function NavigationRegisterButton(): React.ReactNode {
  return (
    <Button variant="outline" size="lg" aria-label="Register button" asChild>
      <Link href="/sign-up">Sign up</Link>
    </Button>
  );
}

type NavigationSignOutButtonProps = {
  handleSigningOut?: null | Dispatch<SetStateAction<boolean>>;
};

function NavigationSignOutButton({
  handleSigningOut = null,
}: NavigationSignOutButtonProps): React.ReactNode {
  const { signOut } = useClerk();

  /**
   * Handles the sign out action.
   * Redirects the user to the home page.
   */
  const handleSignOut = async () => {
    if (handleSigningOut) {
      handleSigningOut(true);
    }

    try {
      await signOut({ redirectUrl: "/" });
    } finally {
      if (handleSigningOut) {
        handleSigningOut(false);
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      aria-label="Sign out button"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
}

function NavigationSearchInput(): React.ReactNode {
  return (
    <InputGroup className="h-9">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-start">
        <MagnifyingGlassIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}

type NavigationClientProps = {
  isInitiallyAuthenticated: boolean;
};

export function NavigationClient({
  isInitiallyAuthenticated,
}: NavigationClientProps): React.ReactNode {
  const { resolvedTheme } = useTheme();

  const shadowColor = resolvedTheme === "dark" ? "shadow-input" : "";

  const { isLoading: isConvexLoading, isAuthenticated: isConvexAuthenticated } =
    useConvexAuth();

  const isAuthenticated = isConvexLoading
    ? isInitiallyAuthenticated
    : isConvexAuthenticated;

  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "z-50",
        "bg-background",
        "shadow-sm",
        shadowColor,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:p-8">
        <div className="flex items-center lg:gap-4">
          <div className="text-2xl font-bold tracking-tight">
            <Link href="/" aria-label="Home link">
              bed.dev
            </Link>
          </div>

          <div className="hidden border-l lg:block lg:h-8" />

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {getNavigationLinks().map((link) => (
                <NavigationMenuItem key={link.key}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.node}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <ButtonGroup className="hidden lg:flex" aria-label="Navigation actions">
          <ButtonGroup>
            <NavigationSearchInput aria-label="Search bar input" />
          </ButtonGroup>
          <ButtonGroup>
            <DarkModeToggleButton />
          </ButtonGroup>
          {isSigningOut ? (
            <Skeleton className="h-9 w-36" />
          ) : isAuthenticated ? (
            <ButtonGroup>
              <NavigationSignOutButton handleSigningOut={setIsSigningOut} />
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <NavigationSignInButton />
              <NavigationRegisterButton />
            </ButtonGroup>
          )}
        </ButtonGroup>

        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <ListIcon />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Navigation</DrawerTitle>
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              <NavigationSearchInput aria-label="Search bar" />
              <Separator className="my-4" />
              <ul>
                {getNavigationLinks({
                  className: "block w-full py-2 text-base",
                }).map((link) => (
                  <li key={link.key}>{link.node}</li>
                ))}
              </ul>
              <Separator className="my-4" />
              <ButtonGroup orientation="vertical" className="w-full">
                <DarkModeToggleButton label="Toggle dark mode" />

                {isSigningOut ? (
                  <>
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </>
                ) : isAuthenticated ? (
                  <NavigationSignOutButton handleSigningOut={setIsSigningOut} />
                ) : (
                  <>
                    <NavigationSignInButton />
                    <NavigationRegisterButton />
                  </>
                )}
              </ButtonGroup>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
