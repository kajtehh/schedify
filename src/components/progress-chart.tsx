"use client";

import { motion } from "motion/react";

type ProgressChartProps = {
  completion: number;
  className?: string;
  bars?: number;
  baseHeight?: number;
  animationDuration?: number;
};

export default function ProgressChart({
  completion,
  className = "",
  bars = 10,
  baseHeight = 30,
  animationDuration = 0.4,
}: ProgressChartProps) {
  const fullBars = Math.floor((completion / 100) * bars);
  const fractional = (completion / 100) * bars - fullBars;

  return (
    <div className={`flex items-end gap-2 ${className}`}>
      {Array.from({ length: bars }).map((_, index) => {
        const height = baseHeight + index * (baseHeight * 0.5);
        const fillHeight =
          index < fullBars
            ? height
            : index === fullBars && fractional > 0
            ? height * fractional
            : 0;

        return (
          <motion.div
            key={index}
            className="w-5 rounded-sm bg-zinc-300 overflow-hidden relative"
            style={{ height }}>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: fillHeight }}
              transition={{
                duration: animationDuration,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 right-0 bg-green-600"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
