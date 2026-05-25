import { DesignSystemReference } from "./design-system-reference";

export default function TestPage() {
  return (
    <div className="theme-light py-[var(--grid-row-gap)]">
      <DesignSystemReference />
    </div>
  );
}
