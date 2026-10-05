import type { Event } from "@/lib/types";

export default function PaperBoat({
  event,
  x,
  y,
  scale,
  going,
  delay,
  onOpen,
}: {
  event: Event;
  x: number;
  y: number;
  scale: number;
  going: boolean;
  delay: number;
  onOpen: () => void;
}) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <g
        className="boat"
        role="button"
        tabIndex={0}
        aria-label={`${event.title}, ${event.clubName}, ${event.time}. Open details.`}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        style={{ animationDelay: `${-delay}s`, cursor: "pointer" }}
      >
        <g transform={`scale(${scale.toFixed(2)})`}>
          {/* hit area */}
          <ellipse cx="0" cy="-8" rx="34" ry="30" fill="transparent" />
          <path
            d="M-30 13 q7.5 -3.5 15 0 t15 0 t15 0 t15 0"
            fill="none"
            stroke="var(--river-deep)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M-25 -1 Q0 2.5 25 -1 L16.5 9.5 Q0 11.5 -16.5 9.5 Z"
            fill="var(--paper-raised)"
            stroke="var(--ink)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M-2.5 -1 L1 -31 L15 -1.5 Z"
            fill={event.clubColor}
            fillOpacity="0.88"
            stroke="var(--ink)"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M-15.5 -1.2 L-3.5 -19 L-2.5 -1 Z"
            fill={event.clubColor}
            fillOpacity="0.45"
            stroke="var(--ink)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M1 -31 L1.6 -2" stroke="var(--ink)" strokeWidth="0.7" opacity="0.5" />
          {going && (
            <path d="M1 -31 L1 -40 L11 -37 L1 -34" fill="var(--turmeric)" stroke="var(--ink)" strokeWidth="0.8" strokeLinejoin="round" />
          )}
        </g>
      </g>
    </g>
  );
}
