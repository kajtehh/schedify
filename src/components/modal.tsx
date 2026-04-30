"use client";

import { XIcon } from "lucide-react";
import Card from "./card";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useCallback, useEffect } from "react";

export default function Modal({
  children,
  open,
  setOpen,
  onClose,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose?: () => void;
}) {
  const handleClose = () => {
    setOpen(false);
    if (onClose) setTimeout(onClose, 250);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence mode="popLayout">
      {open && (
        <motion.div
          key="backdrop"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-md flex items-center justify-center">
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="relative w-full max-w-2xl mx-5"
            onClick={(e) => e.stopPropagation()}>
            <Card className="p-6 shadow-md bg-zinc-50 rounded-2xl overflow-hidden">
              <button
                aria-label="Close Modal"
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-zinc-200 transition-colors">
                <XIcon className="w-5 h-5" />
              </button>
              {children}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
