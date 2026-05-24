import Link from "next/link";
import Image from "next/image";

type LogoMarkVariant = "default" | "reversed";

type LogoMarkProps = {
  onNavigate?: () => void;
  variant?: LogoMarkVariant;
};

/**
 * Square logo — add `/public/logo-light.png` and `/public/logo-dark.png`.
 */
const placeholderClasses: Record<LogoMarkVariant, string> = {
  default:
    "border-[var(--rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)]",
  reversed:
    "border-[var(--color-paper)] bg-[var(--color-paper)] text-[var(--color-ink)]",
};

export function LogoMark({ onNavigate, variant = "default" }: LogoMarkProps) {
  const hasAssets = false;

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="chrome-hit-target block transition-opacity hover:opacity-70"
      aria-label="Home"
    >
      {hasAssets ? (
        <Image
          src={variant === "reversed" ? "/logo-dark.png" : "/logo-light.png"}
          alt=""
          width={44}
          height={44}
          className="aspect-square h-full w-full object-contain"
          priority
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center border transition-colors duration-150 text-[0.5rem] font-bold tracking-widest ${placeholderClasses[variant]}`}
          aria-hidden
        >
          LOGO
        </div>
      )}
    </Link>
  );
}
