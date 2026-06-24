"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

type CounterProps = {
  value: number;
  duration?: number;
  suffix?: string;
};

export default function Counter({
  value,
  duration = 1.25,
  suffix,
}: CounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    latest % 1 === 0 ? latest.toFixed(0) : latest.toFixed(1),
  );

  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (v) => {
      setDisplay(v);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, count, rounded]);

  return (
    <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {display}
      {suffix}
    </motion.span>
  );
}
