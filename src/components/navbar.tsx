"use client";

import { useUser } from "@/hooks/use-user";
import { useSkeleton } from "@/hooks/use-skeleton";
import Logo from "./logo";
import Link from "next/link";
import Avatar from "./avatar";
import Button from "./button";
import { AnimatePresence, motion } from "motion/react";

export default function Navbar() {
  const links = [
    {
      label: "Lorem ipsum",
      href: "/",
    },
    {
      label: "Lorem ipsum",
      href: "/",
    },
    {
      label: "Lorem ipsum",
      href: "/",
    },
    {
      label: "Lorem ipsum",
      href: "/",
    },
  ];

  const { user, isLoading } = useUser();
  const showSkeleton = useSkeleton(isLoading);

  return (
    <nav className="fixed w-full top-0 left-0 z-50 backdrop-blur-sm bg-gradient-to-b from-background xl:to-transparent to-background/50 mask-b-from-80%">
      <div className="container flex justify-between items-center">
        <Logo />
        <ul className="flex gap-10">
          {links.map((link, index) => (
            <li key={index}>
              <Link href={link.href} className="tracking-tighter">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-5">
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
              user &&
              user.fullName && (
                <motion.a
                  key="avatar"
                  initial={{ opacity: 0, scale: 1.05, rotate: 2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotate: -2 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  href="/app"
                  className="rounded-full ring-2 ring-transparent hover:ring-foreground/25 duration-200">
                  <Avatar name={user.fullName} className="rounded-full" />
                </motion.a>
              )
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showSkeleton ? (
              <div className="w-30 py-2 bg-zinc-600 animate-pulse rounded-lg" />
            ) : (
              <Button href="/login">Zaloguj się</Button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
