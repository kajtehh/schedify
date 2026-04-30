"use client";

import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

const MenuContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function Menu({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div
        ref={ref}
        className={`relative ${className}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}

export function MenuTrigger({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function MenuContent({ children }: { children: ReactNode }) {
  const ctx = useContext(MenuContext);
  if (!ctx) return null;

  return (
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          key="menu-content"
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed left-64 bottom-8 min-w-48 bg-foreground shadow-2xl p-3 rounded-xl z-50 border border-zinc-800 flex flex-col gap-2">
          <div className="absolute -left-2 bottom-4 size-4 bg-foreground border-l border-b border-zinc-800 rotate-45 z-0 shadow-md" />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MenuItem({
  icon,
  children,
  onClick,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-background p-2 rounded-xl gap-2 flex items-center text-sm w-full text-left focus:outline-none focus:ring-2 focus:ring-zinc-400">
      {icon}
      {children}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="my-1 border-t border-zinc-700" />;
}
