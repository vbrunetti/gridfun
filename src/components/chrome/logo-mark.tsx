import Link from "next/link";
import Image from "next/image";

type LogoMarkVariant = "default" | "reversed";

type LogoMarkProps = {
  onNavigate?: () => void;
  variant?: LogoMarkVariant;
};

/** Site mark — white-on-transparent PNG, tinted per chrome colorway. */
const LOGO_SRC = "/portfolio/logos/vb_logo.png";

export function LogoMark({ onNavigate, variant = "default" }: LogoMarkProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="chrome-hit-target block transition-opacity hover:opacity-70"
      aria-label="Home"
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={44}
        height={49}
        className={`logo-mark h-full w-full object-contain ${
          variant === "reversed" ? "logo-mark--reversed" : "logo-mark--default"
        }`}
        priority
      />
    </Link>
  );
}
