import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      className={`text-3xl tracking-tighter font-bold text-foreground duration-300 ${className}`}
      href={"/"}>
      schedify
    </Link>
  );
}
