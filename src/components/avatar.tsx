export default function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      src={`https://ui-avatars.com/api/?name=${name}&background=random`}
      alt="Avatar"
      width={40}
      height={40}
      className={`size-10 object-cover ${className ?? ""}`.trim()}
    />
  );
}
