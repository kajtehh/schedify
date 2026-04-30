"use client";

import { ReactNode } from "react";
import Button from "./button";
import { motion } from "motion/react";
import Loader from "./loader";

interface LoadingButtonProps {
  children: ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "solid" | "outline";
}

export default function LoadingButton({
  children,
  loading = false,
  className = "",
  onClick,
  type = "button",
  variant = "solid",
}: LoadingButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading}
      variant={variant}
      className={`w-full px-12 flex justify-center items-center h-10 relative ${className}`}>
      <motion.div
        initial={false}
        animate={{
          opacity: loading ? 1 : 0,
          scale: loading ? 1 : 0.8,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute">
        {loading && <Loader variant={variant === "solid" ? "light" : "dark"} />}
      </motion.div>

      <motion.span
        initial={false}
        animate={{
          opacity: loading ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute">
        {children}
      </motion.span>
    </Button>
  );
}
