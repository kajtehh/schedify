export default function Loader({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  return (
    <div
      className={`size-5 rounded-full border-t border-l animate-spin ${variant === "light" ? "border-background" : "border-foreground"}`}
    />
  );
}
