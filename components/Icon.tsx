import type { CSSProperties } from "react";

/** Material Symbols Outlined — loaded via the font link in layout.tsx. */
export function Icon({
  name,
  className = "",
  size,
  style,
}: {
  name: string;
  className?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={size ? { fontSize: `${size}px`, ...style } : style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
