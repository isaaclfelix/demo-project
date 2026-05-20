import { cva } from "class-variance-authority";

export const variants = cva("mb-4 leading-7 last:mb-0", {
  variants: {
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
      textAlign: "left",
    },
  },
});
