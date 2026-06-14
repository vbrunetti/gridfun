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
  default: "logo-mark-placeholder logo-mark-placeholder--default",
  reversed: "logo-mark-placeholder logo-mark-placeholder--reversed",
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
          className={`logo-mark-placeholder ${placeholderClasses[variant]}`}
          aria-hidden
        >
          LOGO
        </div>
      )}
    </Link>
  );
}
