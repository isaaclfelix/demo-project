"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import Link from "next/link";
import { SunDimIcon } from "@phosphor-icons/react";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/blog">Blog</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="lg">
            <SunDimIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="lg">Login</Button>
          <Button variant="secondary" size="lg">
            Register
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </header>
  );
}
