import { ReactNode } from "react";

export default function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center my-8 gap-3 relative z-10">
      <hr className="flex-grow border-zinc-400" />
      <span className="text-zinc-600 font-medium">{children}</span>
      <hr className="flex-grow border-zinc-400" />
    </div>
  );
}
