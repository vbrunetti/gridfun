export default function SecondarySparkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="secondary-spark-playground-route theme-dark-lift min-h-dvh"
      data-chrome-surface="dark"
    >
      {children}
    </div>
  );
}
