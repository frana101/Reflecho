export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.08] mix-blend-soft-light"
    >
      <div className="absolute inset-[-50%] bg-grain animate-grain" />
    </div>
  );
}
