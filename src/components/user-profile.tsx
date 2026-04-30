"use client";

import { useSkeleton } from "@/hooks/use-skeleton";
import { useUser } from "@/hooks/use-user";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { LogOut, Sun, User } from "lucide-react";
import { useState } from "react";
import Avatar from "./avatar";

export default function UserProfile({ isHidden }: { isHidden: boolean }) {
  const { user, isLoading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const showSkeleton = useSkeleton(isLoading);

  async function handleLogout() {
    const loggedOut = await logout();

    if (loggedOut) {
      toast.success("Wylogowano!");
      redirect("/login");
    }
  }

  return (
    <div className="relative inline-block text-left w-full">
      <div
        className={`flex items-center justify-between rounded-4xl duration-300 cursor-pointer relative ${
          isHidden ? "justify-center p-1" : "hover:bg-zinc-800/75 p-2"
        }`}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        tabIndex={0}
        onFocus={() => setMenuOpen(true)}
        onBlur={() => setMenuOpen(false)}
        aria-haspopup="true">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {showSkeleton ? (
              <motion.div
                key="avatar-skeleton"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="size-10 bg-zinc-600 animate-pulse rounded-full"
              />
            ) : (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, scale: 1.05, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={`overflow-hidden rounded-full`}>
                <Avatar name={user?.fullName || "no-name"} />
              </motion.div>
            )}
          </AnimatePresence>

          {!isHidden && (
            <div className="space-y-1">
              <AnimatePresence mode="wait">
                {showSkeleton ? (
                  <motion.div
                    key="name-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-3.5 bg-zinc-600 animate-pulse rounded-full w-24"
                  />
                ) : (
                  <motion.h5
                    key="name"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold leading-none text-background">
                    {user?.fullName}
                  </motion.h5>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {showSkeleton ? (
                  <motion.div
                    key="email-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-4 bg-zinc-600 animate-pulse rounded-full w-32"
                  />
                ) : (
                  <motion.p
                    key="email"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-zinc-200">
                    {user?.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && !isHidden && (
          <motion.div
            key="profile-menu"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="fixed sm:left-64 left-16 sm:bottom-8 bottom-20 min-w-48 bg-foreground shadow-2xl p-3 rounded-xl z-50 border border-zinc-800 flex flex-col gap-2"
            style={{ minWidth: 192 }}
            tabIndex={-1}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
            aria-label="User menu">
            <div className="absolute sm:-left-2 sm:bottom-4 -bottom-2 left-4/5 size-4 bg-foreground sm:border-l border-b sm:border-r-0 border-r border-zinc-800 rotate-45 z-0 shadow-md" />

            <button className="text-zinc-200 cursor-pointer transition-colors hover:bg-zinc-800 hover:text-background p-2 rounded-xl gap-2 flex items-center text-sm w-full text-left focus:outline-none focus:ring-2 focus:ring-zinc-400">
              <Sun size={20} /> Przełącz motyw
            </button>
            <button className="text-zinc-200 cursor-pointer transition-colors hover:bg-zinc-800 hover:text-background p-2 rounded-xl gap-2 flex items-center text-sm w-full text-left focus:outline-none focus:ring-2 focus:ring-zinc-400">
              <User size={20} /> Mój profil
            </button>
            <div className="my-1 border-t border-zinc-700" />
            <button
              onClick={handleLogout}
              className="text-zinc-200 cursor-pointer transition-colors hover:bg-zinc-800 hover:text-background p-2 rounded-xl gap-2 flex items-center text-sm w-full text-left focus:outline-none focus:ring-2 focus:ring-zinc-400">
              <LogOut size={20} /> Wyloguj się
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
