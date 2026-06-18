/**
 * The signature "pulse" — an ECG/heartbeat line in amber.
 * Ported from the Stitch ANIMATION_2 SVG export. `animate` toggles the
 * drawing animation (used as the loading state on the generate screen).
 */
export function PulseLine({
  className = "",
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <div className={className}>
      <svg viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M0,50 L400,50 L410,30 L425,75 L440,10 L455,90 L470,40 L480,50 L1000,50"
          fill="none"
          stroke="#F5A623"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 4px rgba(245, 166, 35, 0.6))" }}
        >
          {animate && (
            <animate
              attributeName="stroke-dasharray"
              dur="3s"
              from="0,1000"
              to="1000,0"
              repeatCount="indefinite"
            />
          )}
        </path>
      </svg>
    </div>
  );
}
