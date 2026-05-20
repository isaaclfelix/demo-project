import { cva } from "class-variance-authority";

export const variants = cva(
  "mt-8 mb-4 scroll-m-20 tracking-tight text-balance last:mb-0",
  {
    variants: {
      level: {
        "level-1": "text-4xl",
        "level-2": "text-3xl",
        "level-3": "text-2xl",
        "level-4": "text-xl",
        "level-5": "text-lg",
        "level-6": "text-base",
      },
      textAlign: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      decoration: {
        underline: "underline",
        "line-through": "line-through",
      },
      defaultVariants: {
        level: "level-1",
        textAlign: "left",
      },
    },
  },
);
