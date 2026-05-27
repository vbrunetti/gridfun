import { EffectsSubnav } from "@/components/effects/effects-subnav";

export default function EffectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-light min-h-dvh bg-[var(--surface-light)]">
      <EffectsSubnav />
      {children}
    </div>
  );
}
