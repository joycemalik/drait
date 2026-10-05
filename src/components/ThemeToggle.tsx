"use client";
import { useSyncExternalStore } from "react";

type Theme = "system" | "day" | "dusk";
const next: Record<Theme, Theme> = { system: "day", day: "dusk", dusk: "system" };
const label: Record<Theme, string> = { system: "Follow the sky", day: "Day", dusk: "Dusk" };

const EVENT = "themechange";
function read(): Theme {
  try {
    const t = localStorage.getItem("theme");
    return t === "day" || t === "dusk" ? t : "system";
  } catch {
    return "system";
  }
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "system" as Theme);

  function cycle() {
    const t = next[theme];
    const root = document.documentElement;
    if (t === "system") delete root.dataset.theme;
    else root.dataset.theme = t;
    try {
      if (t === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", t);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      onClick={cycle}
      className={className}
      title={`Theme: ${label[theme]}. Click to change.`}
      aria-label={`Theme: ${label[theme]}. Click to change.`}
      style={{ color: "var(--ink-soft)", padding: "0.25rem", lineHeight: 0 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {theme === "dusk" ? (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        ) : theme === "day" ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M5.2 18.8l1.6-1.6M17.2 6.8l1.6-1.6" />
          </>
        ) : (
          <>
            <path d="M3 17h18" />
            <path d="M7 17a5 5 0 0 1 10 0" />
            <path d="M12 6.5v2M5.5 10l1.4 1.2M18.5 10l-1.4 1.2" />
          </>
        )}
      </svg>
    </button>
  );
}
