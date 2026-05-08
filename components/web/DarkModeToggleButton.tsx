"use client";

import { MoonIcon, SunDimIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

type DarkModeToggleButtonProps = {
  label?: string;
};

export function DarkModeToggleButton({
  label,
}: DarkModeToggleButtonProps): React.ReactNode {
  const { setTheme, resolvedTheme } = useTheme();

  const handleToggleDarkMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="lg"
      aria-label="Toggle dark mode button"
      onClick={handleToggleDarkMode}
    >
      {resolvedTheme === "dark" ? <MoonIcon /> : <SunDimIcon />}
      {label && <span>{label}</span>}
    </Button>
  );
}
