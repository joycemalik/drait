"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { blobPath, hashString } from "@/lib/noise";
import { toggleRsvp } from "@/lib/actions";
import { signInWithGoogle } from "@/components/AuthButton";
import type { Announcement, Event } from "@/lib/types";

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export type NoteItem = { kind: "event"; event: Event } | { kind: "announcement"; announcement: Announcement };

export default function PaperNote({
  item,
  going,
  count,
  configured,
  onRsvpChange,
  onClose,
}: {
  item: NoteItem;
  going: boolean;
  count: number;
  configured: boolean;
  onRsvpChange: (going: boolean) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; signIn?: boolean } | null>(null);
  const id = item.kind === "event" ? item.event.id : item.announcement.id;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function rsvp() {
    if (item.kind !== "event") return;
    const next = !going;
    onRsvpChange(next);
    setMessage(null);
    startTransition(async () => {
      const res = await toggleRsvp(item.event.id);
      if (!res.ok) {
        onRsvpChange(!next);
        setMessage({ text: res.error, signIn: res.needsSignIn });
      }
    });
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.kind === "event" ? item.event.title : item.announcement.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "grid",
        placeItems: "center",
        padding: "1.25rem",
        background: "color-mix(in srgb, var(--paper) 55%, transparent)",
        backdropFilter: "blur(3px)",
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.55, rotate: -7, y: 30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
        exit={{ scale: 0.7, rotate: 4, opacity: 0 }}
        transition={{ type: "spring", stiffness: 170, damping: 18 }}
        style={{ position: "relative", width: "min(30rem, 100%)", padding: "2.4rem 2.4rem 2.1rem" }}
      >
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 18px 30px rgba(31,42,68,0.22))",
          }}
        >
          <path d={blobPath(hashString(id), 100, 100, 97, 96, 0.035, 14)} style={{ fill: "color-mix(in srgb, var(--paper-raised) 92%, var(--ink))" }} stroke="var(--rule)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        </svg>

        <div style={{ position: "relative" }}>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            style={{ position: "absolute", top: "-0.9rem", right: "-0.9rem", color: "var(--ink-soft)", padding: "0.3rem" }}
          >
            <X size={18} />
          </button>

          {item.kind === "event" ? (
            <EventBody
              event={item.event}
              going={going}
              count={count}
              pending={pending}
              configured={configured}
              onRsvp={rsvp}
            />
          ) : (
            <AnnouncementBody a={item.announcement} />
          )}

          {message && (
            <p role="status" style={{ marginTop: "0.9rem", fontSize: "0.85rem", color: "var(--laterite)" }}>
              {message.text}{" "}
              {message.signIn && (
                <button
                  onClick={() => signInWithGoogle(location.pathname)}
                  style={{ textDecoration: "underline", textUnderlineOffset: 3, color: "var(--ink)" }}
                >
                  Sign in with Google
                </button>
              )}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ClubLine({ slug, name, color }: { slug: string; name: string; color: string }) {
  return (
    <Link
      href={`/clubs/${slug}`}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.85rem", color: "var(--ink-soft)", textDecoration: "none" }}
    >
      <span style={{ width: 10, height: 10, background: color, borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%" }} />
      {name}
    </Link>
  );
}

function EventBody({
  event,
  going,
  count,
  pending,
  configured,
  onRsvp,
}: {
  event: Event;
  going: boolean;
  count: number;
  pending: boolean;
  configured: boolean;
  onRsvp: () => void;
}) {
  const left = event.maxSeats ? Math.max(0, event.maxSeats - count) : null;
  const external = event.registrationLink && event.registrationLink !== "#" ? event.registrationLink : null;
  return (
    <>
      <ClubLine slug={event.clubSlug} name={event.clubName} color={event.clubColor} />
      <h2 className="font-display" style={{ fontSize: "1.75rem", lineHeight: 1.12, margin: "0.5rem 0 0.75rem", fontWeight: 500 }}>
        {event.title}
      </h2>
      <p style={{ fontSize: "0.92rem", color: "var(--ink)", lineHeight: 1.55 }}>
        {longDate(event.date)}
        <br />
        {event.time}
        {event.endTime ? ` – ${event.endTime}` : ""} · {event.venue}
      </p>
      {event.description && (
        <p style={{ marginTop: "0.8rem", fontSize: "0.9rem", lineHeight: 1.6, color: "var(--ink-soft)" }}>{event.description}</p>
      )}

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.9rem", marginTop: "1.3rem" }}>
        <button
          onClick={onRsvp}
          disabled={pending || (!going && left === 0)}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "999px 999px 999px 999px / 900px 999px 950px 999px",
            fontSize: "0.9rem",
            fontWeight: 600,
            background: going ? "transparent" : "var(--ink)",
            color: going ? "var(--ink)" : "var(--paper)",
            boxShadow: going ? "inset 0 0 0 1.5px var(--ink)" : "none",
            opacity: pending ? 0.7 : 1,
          }}
        >
          {going ? "You're going ✓" : left === 0 ? "Full" : "I'll be there"}
        </button>
        <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
          {count === 0 ? "No RSVPs yet" : `${count} going`}
          {left !== null && left > 0 ? ` · ${left} ${left === 1 ? "seat" : "seats"} left` : ""}
        </span>
      </div>
      {!configured && (
        <p style={{ marginTop: "0.7rem", fontSize: "0.75rem", color: "var(--ink-faint)" }}>Sample data: RSVPs aren&apos;t saved in this copy.</p>
      )}
      {external && (
        <a href={external} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "0.8rem", fontSize: "0.85rem", color: "var(--river-deep)" }}>
          The club&apos;s own form ↗
        </a>
      )}
    </>
  );
}

function AnnouncementBody({ a }: { a: Announcement }) {
  return (
    <>
      <ClubLine slug={a.clubSlug} name={a.clubName} color={a.clubColor} />
      <h2 className="font-display" style={{ fontSize: "1.6rem", lineHeight: 1.15, margin: "0.5rem 0 0.75rem", fontWeight: 500 }}>
        {a.title}
      </h2>
      <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--ink-soft)" }}>{a.body}</p>
      <p style={{ marginTop: "0.9rem", fontSize: "0.8rem", color: "var(--ink-faint)" }}>
        {a.author} ·{" "}
        {new Date(a.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
      </p>
    </>
  );
}
