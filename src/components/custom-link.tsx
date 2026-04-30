import Link from "next/link";
import { LinkIcon } from "./icons";

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function CustomLink({
  href,
  children,
  className = "",
}: CustomLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex gap-0.5 items-center ${className}`}>
      {children}
      <LinkIcon />
    </Link>
  );
}
