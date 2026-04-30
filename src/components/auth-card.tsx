import { ReactNode } from "react";
import Card from "./card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AuthCard({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 lg:px-4 px-2 relative overflow-hidden">
      <Link
        href={"/"}
        className="fixed top-5 left-5 flex items-center gap-1 text-sm font-semibold transition-colors hover:text-zinc-700">
        <ChevronLeft size={16} /> Dom
      </Link>
      <Card className="shadow-lg lg:p-10 p-8 border border-foreground/10 max-w-xl bg-zinc-200">
        <header className="mb-8 relative z-10">
          {subtitle && (
            <p className="text-sm font-medium tracking-tighter text-zinc-700">
              {subtitle}
            </p>
          )}

          <h4 className="text-3xl font-semibold tracking-tighter text-zinc-900">
            {title}
          </h4>
        </header>
        {children}
      </Card>
    </div>
  );
}
