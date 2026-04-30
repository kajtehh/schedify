"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "solid" | "outline";
  disabled?: boolean;
  className?: string;
  href?: string;
}

export default function Button({
  children,
  variant = "solid",
  disabled = false,
  className = "",
  href,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-6 py-2 font-medium tracking-tighter rounded-lg cursor-pointer select-none transition-colors duration-200";

  const variantStyles = {
    solid:
      "bg-foreground text-background hover:bg-foreground/85 disabled:bg-foreground/90",
    outline: "bg-zinc-300 hover:bg-zinc-400/50 border border-foreground/30",
  };

  const finalStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${finalStyles} ${disabled ? "pointer-events-none opacity-60" : ""}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={finalStyles}
      {...props}>
      {children}
    </button>
  );
}
