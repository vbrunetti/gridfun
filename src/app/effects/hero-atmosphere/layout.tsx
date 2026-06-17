export default function HeroAtmosphereLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="atmosphere-playground-route theme-dark-lift min-h-dvh"
      data-chrome-surface="dark"
    >
      {children}
    </div>
  );
}
