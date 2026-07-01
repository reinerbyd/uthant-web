"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { magnetic } from "@/lib/anim";
import { isTouch } from "@/lib/gsap";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  cursor?: string;
  strength?: number;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/** A link that eases toward the cursor on hover (magnetic micro-interaction). */
export default function MagneticButton({
  href,
  children,
  className,
  external,
  cursor = "open",
  strength = 0.35,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isTouch() || !ref.current) return;
    return magnetic(ref.current, strength);
  }, [strength]);

  const isExternal =
    external || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel");

  if (isExternal) {
    return (
      <a
        ref={ref}
        href={href}
        className={className}
        data-cursor={cursor}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link ref={ref} href={href} className={className} data-cursor={cursor} {...rest}>
      {children}
    </Link>
  );
}
