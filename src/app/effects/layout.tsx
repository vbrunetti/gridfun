export default function EffectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-light min-h-dvh" data-chrome-surface="light">
      {children}
    </div>
  );
}
