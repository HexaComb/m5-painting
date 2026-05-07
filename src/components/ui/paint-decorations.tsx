/**
 * Paint-themed decorative SVG components.
 * Bold, visible, intentional — not invisible 4% opacity blobs.
 */

/* ───────────────────────────────────────────
   Paint Drip — organic section divider.
   Sits between sections, dripping downward.
   ─────────────────────────────────────────── */
export function PaintDrip({
  color = "currentColor",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`block w-full ${flip ? "rotate-180" : ""} ${className}`}
      style={{ height: "clamp(48px, 7vw, 100px)" }}
      aria-hidden="true"
    >
      <path
        d={`
          M0,0 L1440,0
          L1440,30
          C1380,32 1340,28 1300,30
          C1240,36 1200,48 1160,42
          C1120,36 1100,28 1060,32
          C1020,38 1000,52 960,46
          C920,38 900,32 860,34
          C800,40 780,62 740,72
          C720,78 710,84 700,88
          C692,94 688,100 684,88
          C678,72 670,52 640,42
          C600,28 560,34 520,32
          C480,28 440,42 400,48
          C360,54 340,62 300,56
          C280,52 270,72 260,82
          C252,90 248,98 244,92
          C236,78 220,48 180,40
          C140,28 100,34 60,32
          C30,30 10,32 0,32
          Z
        `}
        fill={color}
      />
    </svg>
  );
}

/* ───────────────────────────────────────────
   Paint Drip Alt — second variation with
   different drip positions.
   ─────────────────────────────────────────── */
export function PaintDripAlt({
  color = "currentColor",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`block w-full ${flip ? "rotate-180" : ""} ${className}`}
      style={{ height: "clamp(48px, 7vw, 100px)" }}
      aria-hidden="true"
    >
      <path
        d={`
          M0,0 L1440,0
          L1440,30
          C1400,32 1380,28 1340,30
          C1300,38 1280,58 1240,62
          C1220,66 1210,78 1200,88
          C1192,96 1188,100 1184,90
          C1176,72 1160,42 1120,34
          C1080,26 1040,32 1000,30
          C960,26 920,38 880,42
          C840,48 800,34 760,32
          C720,28 680,40 640,48
          C600,56 580,66 540,62
          C500,54 480,32 440,30
          C400,26 360,42 320,52
          C300,58 290,72 280,82
          C272,92 268,100 264,90
          C256,74 240,42 200,34
          C160,24 120,32 80,34
          C40,38 20,32 0,32
          Z
        `}
        fill={color}
      />
    </svg>
  );
}

/* ───────────────────────────────────────────
   Brush Stroke Underline — decorative accent
   under headings. Visible and bold.
   ─────────────────────────────────────────── */
export function BrushStroke({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      className={`h-2.5 w-36 sm:w-44 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M3,9 C18,4 38,7 58,5 C78,3 98,8 118,6 C138,4 158,9 178,5 C188,4 194,7 197,6"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}

/* ───────────────────────────────────────────
   Paint Swatch — bold color block accent
   used as background decoration.
   ─────────────────────────────────────────── */
export function PaintSwatch({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="8"
        y="8"
        width="104"
        height="104"
        rx="4"
        fill={color}
        opacity="0.08"
        transform="rotate(3, 60, 60)"
      />
      <rect
        x="12"
        y="12"
        width="96"
        height="96"
        rx="3"
        fill={color}
        opacity="0.05"
        transform="rotate(-2, 60, 60)"
      />
    </svg>
  );
}

/* ───────────────────────────────────────────
   Roller Edge — rough horizontal edge like
   a paint roller pass. Used as a subtle
   section top/bottom accent.
   ─────────────────────────────────────────── */
export function RollerEdge({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 8"
      preserveAspectRatio="none"
      className={`h-1.5 w-full ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0,4 C10,2 20,6 40,3 C60,1 80,6 100,4 C120,2 140,5 160,3 C180,1 200,6 220,4 C240,2 260,5 280,3 C300,1 320,6 340,4 C360,2 380,5 400,4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.25"
      />
    </svg>
  );
}
