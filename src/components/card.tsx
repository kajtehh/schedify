import { ReactNode, HTMLAttributes } from "react";

type CardProps = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div className={`rounded-3xl w-full ${className}`} {...props}>
      {children}
    </div>
  );
}
