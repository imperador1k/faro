"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const shadowDepth = "border-b-[5px] active:border-b-0";
const press = "active:translate-y-[5px]";
const base3D = `${shadowDepth} ${press}`;

const buttonVariants = cva(
  `inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default:
          `bg-[#58cc02] text-white border-[#46a302] hover:bg-[#46a302] ${base3D}`,

        destructive:
          `bg-rose-500 text-white border-rose-700 hover:bg-rose-600 ${base3D}`,

        outline:
          `bg-transparent text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 ${press}`,

        secondary:
          `bg-sky-500 text-white border-sky-700 hover:bg-sky-600 ${base3D}`,

        ghost:
          `bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 ${press}`,

        link:
          "text-[#58cc02] underline-offset-4 hover:underline",

        super:
          `bg-gradient-to-b from-amber-400 to-amber-500 text-white border-amber-600 hover:from-amber-400/90 hover:to-amber-500/90 ${base3D}`,

        locked:
          `bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed ${base3D}`,

        sidebar:
          `bg-transparent text-slate-500 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-none ${press}`,

        sidebarOutline:
          `bg-sky-500/15 text-sky-500 border-sky-300 border-2 hover:bg-sky-500/20 transition-none ${press}`,
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={onClick}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
