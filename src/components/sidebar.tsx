"use client";

import Link from "next/link";
import Logo from "./logo";
import { ChartPie, LayoutDashboard, Menu, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import UserProfile from "./user-profile";

export default function Sidebar() {
  const links = [
    {
      label: "Panel",
      href: "/app",
      icon: <LayoutDashboard className="size-6" />,
    },
    {
      label: "Analiza",
      href: "/app/analytics",
      icon: <ChartPie className="size-6" />,
    },
    {
      label: "Ustawienia",
      href: "/app/settings",
      icon: <Settings className="size-6" />,
    },
  ];

  const [isHidden, setHidden] = useState(false);

  return (
    <motion.aside
      className="fixed top-0 left-0 h-screen xl:w-64 w-0 bg-zinc-200 flex flex-col justify-between border-r border-zinc-300 shadow-inner z-40"
      animate={{
        width: isHidden ? 64 : 256,
      }}
      transition={{ duration: 0.2 }}>
      <div className={`${isHidden ? "p-2" : "p-4"} overflow-hidden`}>
        <div
          className={`flex justify-between items-center ${
            isHidden ? "flex-col" : ""
          }`}>
          <Logo className={isHidden ? "text-sm" : ""} />

          <button
            aria-label="Toggle Sidebar"
            onClick={() => setHidden(!isHidden)}
            className="p-2 rounded-lg hover:bg-zinc-300 transition-colors cursor-pointer">
            <Menu className="size-6 text-zinc-600" />
          </button>
        </div>

        <nav className="mt-10">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-800 transition-colors hover:bg-zinc-300 hover:text-foreground`}>
                  {link.icon}
                  {!isHidden && (
                    <span className="font-medium">{link.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-10 border-t bg-foreground shadow-sm rounded-t-4xl p-2.5">
        <UserProfile isHidden={isHidden} />
      </div>
    </motion.aside>
  );
}
