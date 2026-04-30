export default function Input({
  type = "text",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={`p-3 w-full rounded-xl font-medium focus:outline-none 
                  focus:ring-2 focus:ring-zinc-600 border border-solid border-zinc-500 duration-200 ease-in-out hover:enabled:border-foreground 
                  focus:border-zinc-400
                  disabled:opacity-80
                  ${className ?? ""}`}
      {...props}
    />
  );
}
