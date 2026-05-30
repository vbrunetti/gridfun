export default function EffectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-light min-h-dvh bg-[var(--surface-light)]" data-chrome-surface="light">
      {children}
    </div>
  );
}
