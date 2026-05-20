import { cva } from "class-variance-authority";

export const listVariants = cva(
  "mb-6 ml-6 list-outside last:mb-0 [&>li]:mt-2",
  {
    variants: {
      ordered: {
        true: "list-decimal",
        false: "list-disc",
      },
      nested: {
        true: "mt-1",
        false: "",
      },
      decoration: {
        underline: "underline",
        "line-through": "line-through",
      },
    },
    defaultVariants: {
      ordered: false,
      nested: false,
    },
  },
);

export const itemVariants = cva("leading-7", {
  variants: {
    decoration: {
      underline: "underline",
      "line-through": "line-through",
    },
  },
});
