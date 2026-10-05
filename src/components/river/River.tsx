"use client";
import "./river.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { buildRiver, type Orientation, type RiverModel } from "./geometry";
import PaperBoat from "./PaperBoat";
import Village from "./Village";
import PaperNote, { type NoteItem } from "./PaperNote";
import RiverList from "./RiverList";
import { addDays, daysBetween, weekdayShort } from "@/lib/dates";
import { hashString, rng, smoothPath } from "@/lib/noise";
import type { Announcement, Club, Event } from "@/lib/types";

export interface RiverProps {
  today: string;
  days: number;
  events: Event[];
  clubs: Club[];
  announcements: Announcement[];
  rsvps: string[];
  configured: boolean;
}

export default function River(props: RiverProps) {
  const { events, configured } = props;
  const [view, setView] = useState<"river" | "list">("river");
  const [note, setNote] = useState<NoteItem | null>(null);
  const [going, setGoing] = useState(() => new Set(props.rsvps));
  const [delta, setDelta] = useState<Record<string, number>>({});

  const countOf = (e: Event) => e.registeredCount + (delta[e.id] ?? 0);
  const setRsvp = (id: string, on: boolean) => {
    setGoing((g) => {
      const n = new Set(g);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });
    setDelta((d) => ({ ...d, [id]: (d[id] ?? 0) + (on ? 1 : -1) }));
  };

  const shared = {
    ...props,
    going,
    countOf,
    open: (e: Event) => setNote({ kind: "event", event: e }),
    openNotice: (a: Announcement) => setNote({ kind: "announcement", announcement: a }),
  };

  return (
    <section id="river" aria-label="The next two weeks at AIT" style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          padding: "0 clamp(1.25rem, 5vw, 4rem)",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <p className="section-label">Events</p>
          <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.4rem)", fontWeight: 500, lineHeight: 1.1 }}>
            {events.length === 0 ? "No events in the next two weeks." : "Upcoming events, next 14 days."}
          </h2>
        </div>
        <button
          onClick={() => setView((v) => (v === "river" ? "list" : "river"))}
          style={{ fontSize: "0.85rem", color: "var(--ink-soft)", textDecoration: "underline", textUnderlineOffset: 4 }}
        >
          {view === "river" ? "View as list" : "View timeline"}
        </button>
      </div>

      {view === "list" ? (
        <RiverList {...shared} />
      ) : (
        <>
          <div className="river-across">
            <AcrossRiver {...shared} />
          </div>
          <div className="river-down">
            <DownRiver {...shared} />
          </div>
        </>
      )}

      <AnimatePresence>
        {note && (
          <PaperNote
            key={note.kind === "event" ? note.event.id : note.announcement.id}
            item={note}
            going={note.kind === "event" && going.has(note.event.id)}
            count={note.kind === "event" ? countOf(note.event) : 0}
            configured={configured}
            onRsvpChange={(on) => note.kind === "event" && setRsvp(note.event.id, on)}
            onClose={() => setNote(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

type Shared = RiverProps & {
  going: Set<string>;
  countOf: (e: Event) => number;
  open: (e: Event) => void;
  openNotice: (a: Announcement) => void;
};

/* ── Layout of things on the water ─────────────────────────── */

function placeBoats(model: RiverModel, today: string, events: Event[], countOf: (e: Event) => number) {
  const byDay = new Map<number, Event[]>();
  for (const e of events) {
    const i = daysBetween(today, e.date);
    if (i < 0 || i >= model.days) continue;
    byDay.set(i, [...(byDay.get(i) ?? []), e]);
  }
  const max = Math.max(1, ...events.map(countOf));
  const boats: { e: Event; t: number; c: number; scale: number; tier: number }[] = [];
  for (const [i, list] of byDay) {
    list.forEach((e, k) => {
      const t = model.dayStart(i) + (model.dayLen * (k + 1)) / (list.length + 1);
      const lane = list.length > 1 ? (k % 2 ? 1 : -1) * model.half(t) * 0.22 : 0;
      boats.push({
        e,
        t,
        c: model.center(t) + lane,
        scale: (model.orientation === "across" ? 1 : 0.85) * (0.85 + 0.45 * Math.sqrt(countOf(e) / max)),
        tier: k % 2,
      });
    });
  }
  return boats;
}

function placeVillages(model: RiverModel, clubs: Club[], boats: { e: Event; t: number }[]) {
  const first = new Map<string, number>();
  for (const b of boats) if (!first.has(b.e.clubSlug)) first.set(b.e.clubSlug, b.t);
  const spread = (model.length - model.margin * 2) / Math.max(1, clubs.length);
  const wanted = clubs
    .map((c, i) => ({ c, t: first.get(c.slug) ?? model.margin + spread * (i + 0.5) }))
    .sort((a, b) => a.t - b.t);
  const gap = 250;
  let last = -Infinity;
  return wanted.map(({ c, t }) => {
    const tt = Math.min(Math.max(t, last + gap, model.margin * 0.6), model.length - 90);
    last = tt;
    return { club: c, t: tt };
  });
}

function placeLanterns(model: RiverModel, notices: Announcement[]) {
  const span = model.length - model.margin;
  return notices.map((a, i) => {
    const t = model.margin * 0.7 + (span * (i + 0.35)) / notices.length;
    return { a, t, c: model.center(t) - model.half(t) * 0.62 };
  });
}

/* ── Drawing ───────────────────────────────────────────────── */

function Water({ model, flowSeconds }: { model: RiverModel; flowSeconds: number }) {
  return (
    <g>
      {model.water.map((d, i) => (
        <path key={i} d={d} fill="var(--river)" fillOpacity={[0.2, 0.14, 0.1][i]} />
      ))}
      <g className="ripples" style={{ ["--flow" as string]: `${flowSeconds}s` }}>
        {model.ripples.map((r, i) => (
          <path
            key={i}
            d={r.d}
            fill="none"
            stroke="var(--river-deep)"
            strokeWidth={r.w}
            strokeOpacity={r.o}
            strokeLinecap="round"
            strokeDasharray={r.dash}
            style={{ animationDelay: `${-i * 3.1}s` }}
          />
        ))}
      </g>
      {model.banks.map((b, i) => (
        <path key={i} d={b.d} fill="none" stroke="var(--ink)" strokeWidth={b.w} strokeOpacity={b.o} strokeLinecap="round" />
      ))}
      {model.reeds.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--sal)" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
      ))}
    </g>
  );
}

function Lantern({ a, x, y, onOpen }: { a: Announcement; x: number; y: number; onOpen: () => void }) {
  const urgent = a.priority === "urgent";
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <g
        className="lantern"
        role="button"
        tabIndex={0}
        aria-label={`Notice from ${a.clubName}: ${a.title}`}
        onClick={onOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen())}
        style={{ animationDelay: `${-(hashString(a.id) % 9)}s`, cursor: "pointer" }}
      >
        <title>{a.title}</title>
        {urgent && <circle r="22" fill="var(--turmeric)" opacity="0.28" className="lantern-glow" />}
        <path d="M-9 4 Q0 9 9 4" fill="none" stroke="var(--river-deep)" strokeWidth="1" opacity="0.6" />
        <path
          d="M-7 2 C-8.5 -4 -8 -10 -5.5 -14 L5.5 -14 C8 -10 8.5 -4 7 2 Z"
          fill={urgent ? "var(--turmeric)" : a.priority === "important" ? "var(--laterite)" : "var(--paper-raised)"}
          fillOpacity={urgent ? 0.95 : 0.8}
          stroke="var(--ink)"
          strokeWidth="1"
        />
        <path d="M-6 -14 Q0 -18 6 -14" fill="none" stroke="var(--ink)" strokeWidth="1" />
        <path d="M-5 -6 Q0 -4.5 5 -6" fill="none" stroke="var(--ink)" strokeWidth="0.6" opacity="0.5" />
      </g>
    </g>
  );
}

function BoatLabel({
  e,
  x,
  y,
  width,
  align,
}: {
  e: Event;
  x: number;
  y: number;
  width: number;
  align: "center" | "left";
}) {
  return (
    <foreignObject x={x} y={y} width={width} height={80} style={{ overflow: "visible", pointerEvents: "none" }}>
      <div
        className="boat-label"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: align === "center" ? "flex-end" : "center",
          textAlign: align,
        }}
      >
        <span className="boat-title">{e.title}</span>
        <span className="boat-meta">
          {e.time} · {e.clubName}
        </span>
      </div>
    </foreignObject>
  );
}

function DayMarks({ model, today }: { model: RiverModel; today: string }) {
  return (
    <g>
      {Array.from({ length: model.days }, (_, i) => {
        const iso = addDays(today, i);
        const t = model.dayStart(i) + model.dayLen / 2;
        const isToday = i === 0;
        const date = +iso.slice(8, 10);
        const [x, y] =
          model.orientation === "across"
            ? model.pt(t, model.cross - 30)
            : model.pt(t, 6);
        return (
          <text
            key={iso}
            x={x}
            y={y}
            textAnchor={model.orientation === "across" ? "middle" : "start"}
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              fontSize: model.orientation === "across" ? (isToday ? 19 : 16) : isToday ? 15 : 13,
            }}
            fill={isToday ? "var(--laterite)" : "var(--ink-soft)"}
          >
            {isToday ? "Today" : i === 1 ? "Tomorrow" : `${weekdayShort(iso)} ${date}`}
          </text>
        );
      })}
      <Ghat model={model} />
    </g>
  );
}

/** Steps down to the water where today begins. */
function Ghat({ model }: { model: RiverModel }) {
  const t = model.dayStart(0) - 6;
  const [x, y] = model.pt(t, model.center(t) + model.half(t) - 4);
  const steps = model.orientation === "across" ? [0, 7, 14, 21] : [0, 6, 12, 18];
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} opacity="0.85">
      {steps.map((s, i) => (
        <path
          key={i}
          d={
            model.orientation === "across"
              ? `M${-26 - i * 6} ${s} C${-10} ${s - 1.2} ${10} ${s + 1} ${26 + i * 6} ${s}`
              : `M${-14 + i * 5} ${s - 9} C${-2} ${s - 10} ${10} ${s - 8} ${20 + i * 3} ${s - 9}`
          }
          fill="none"
          stroke="var(--laterite)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function FarShore({ model }: { model: RiverModel }) {
  // The far bank's tree canopy: overlapping uneven crowns, kept faint so labels stay readable.
  const d = useMemo(() => {
    const r = rng(41);
    const crowns: { t: number; lift: number; r: number }[] = [];
    for (let t = -30; t < model.length + 30; t += 10 + r() * 22) {
      const rad = 14 + r() * 26;
      crowns.push({ t, lift: 10 + r() * 34, r: rad });
    }
    const pts: [number, number][] = [];
    for (let t = -10; t <= model.length + 10; t += 5) {
      const bank = model.center(t) - model.half(t) - 6;
      let top = bank;
      for (const c of crowns) {
        const dt = t - c.t;
        if (Math.abs(dt) < c.r) top = Math.min(top, bank - c.lift - Math.sqrt(c.r * c.r - dt * dt) * 0.8);
      }
      pts.push([t, top]);
    }
    const back = [...pts].reverse().map(([t]) => [t, model.center(t) - model.half(t) - 2] as [number, number]);
    return `${smoothPath(pts)} L${back[0][0]} ${back[0][1].toFixed(1)} ${smoothPath(back).replace(/^M[^C]*/, "")} Z`;
  }, [model]);
  return <path d={d} fill="var(--sal)" opacity="0.16" />;
}

function flowSecondsFor(n: number) {
  // Busier weeks flow faster.
  return Math.max(14, 46 - n * 2.4);
}

/* ── Wide screens: scroll moves you downstream ─────────────── */

function AcrossRiver(s: Shared) {
  const model = useMemo(() => buildRiver("across", s.days), [s.days]);
  const boats = useMemo(() => placeBoats(model, s.today, s.events, s.countOf), [model, s.today, s.events, s.countOf]);
  const villages = useMemo(() => placeVillages(model, s.clubs, boats), [model, s.clubs, boats]);
  const lanterns = useMemo(() => placeLanterns(model, s.announcements), [model, s.announcements]);
  const activeClubs = useMemo(() => new Set(s.events.map((e) => e.clubSlug)), [s.events]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  useEffect(() => {
    const measure = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const stageH = Math.min(vp.h - 40, 780);
  const scale = stageH / model.height;
  const trackW = model.width * scale;
  const travel = Math.max(0, trackW - vp.w);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // Dragging the river scrolls the page: one pixel of drag is one pixel downstream.
  const drag = useRef<{ x: number; moved: number } | null>(null);
  const suppressClick = useRef(false);

  return (
    <div ref={sectionRef} style={{ height: travel + vp.h, position: "relative" }}>
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", touchAction: "pan-y" }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { x: e.clientX, moved: 0 };
          suppressClick.current = false;
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          drag.current.x = e.clientX;
          drag.current.moved += Math.abs(dx);
          if (drag.current.moved > 6) suppressClick.current = true;
          window.scrollBy({ top: -dx, behavior: "instant" as ScrollBehavior });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.stopPropagation();
            e.preventDefault();
            suppressClick.current = false;
          }
        }}
        onWheel={(e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) window.scrollBy({ top: e.deltaX, behavior: "instant" as ScrollBehavior });
        }}
      >
        <motion.div style={{ x, cursor: "grab", userSelect: "none" }}>
          <svg
            width={trackW}
            height={stageH}
            viewBox={`0 0 ${model.width} ${model.height}`}
            role="group"
            aria-label="Upcoming events timeline"
          >
            <FarShore model={model} />
            <Water model={model} flowSeconds={flowSecondsFor(s.events.length)} />
            <DayMarks model={model} today={s.today} />

            {villages.map(({ club, t }) => {
              const [vx, vy] = model.pt(t, model.center(t) + model.half(t) + 66);
              return <Village key={club.slug} club={club} active={activeClubs.has(club.slug)} x={vx} y={vy} />;
            })}

            {lanterns.map(({ a, t, c }) => {
              const [lx, ly] = model.pt(t, c);
              return <Lantern key={a.id} a={a} x={lx} y={ly} onOpen={() => s.openNotice(a)} />;
            })}

            {boats.map(({ e, t, c, scale: bs, tier }) => {
              const [bx, by] = model.pt(t, c);
              return (
                <g key={e.id}>
                  <BoatLabel e={e} x={bx - 85} y={by - 40 * bs - 86 - tier * 62} width={170} align="center" />
                  <PaperBoat
                    event={e}
                    x={bx}
                    y={by}
                    scale={bs}
                    going={s.going.has(e.id)}
                    delay={hashString(e.id) % 7}
                    onOpen={() => s.open(e)}
                  />
                </g>
              );
            })}

            {s.events.length === 0 && (
              <text
                x={model.dayStart(1)}
                y={model.center(model.dayStart(1)) + 6}
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic", fontSize: 22 }}
                fill="var(--ink-soft)"
              >
                No events scheduled yet.
              </text>
            )}
          </svg>
        </motion.div>

        {travel > 0 && (
          <motion.p
            aria-hidden
            style={{
              opacity: hintOpacity,
              position: "absolute",
              right: "clamp(1.25rem, 5vw, 4rem)",
              bottom: "1.5rem",
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              color: "var(--ink-soft)",
              fontSize: "0.95rem",
            }}
          >
            scroll or drag to see later dates →
          </motion.p>
        )}
      </div>
    </div>
  );
}

/* ── Phones: the river runs down the page ──────────────────── */

function DownRiver(s: Shared) {
  const model = useMemo(() => buildRiver("down", s.days), [s.days]);
  const boats = useMemo(() => placeBoats(model, s.today, s.events, s.countOf), [model, s.today, s.events, s.countOf]);
  const lanterns = useMemo(() => placeLanterns(model, s.announcements), [model, s.announcements]);
  const activeClubs = useMemo(() => new Set(s.events.map((e) => e.clubSlug)), [s.events]);

  return (
    <div style={{ padding: "0 0.75rem" }}>
      <svg viewBox={`0 0 ${model.width} ${model.height}`} width="100%" role="group" aria-label="Upcoming events timeline">
        <Water model={model} flowSeconds={flowSecondsFor(s.events.length)} />
        <DayMarks model={model} today={s.today} />
        {lanterns.map(({ a, t, c }) => {
          const [lx, ly] = model.pt(t, c);
          return <Lantern key={a.id} a={a} x={lx} y={ly} onOpen={() => s.openNotice(a)} />;
        })}
        {boats.map(({ e, t, c, scale: bs, tier }) => {
          const [bx, by] = model.pt(t, c);
          const lx = model.center(t) + model.half(t) + 22;
          return (
            <g key={e.id}>
              <BoatLabel e={e} x={lx} y={by - 40 + tier * 6} width={model.cross - lx - 6} align="left" />
              <PaperBoat event={e} x={bx} y={by} scale={bs} going={s.going.has(e.id)} delay={hashString(e.id) % 7} onOpen={() => s.open(e)} />
            </g>
          );
        })}
      </svg>

      <p className="section-label" style={{ margin: "1.5rem 0 0.25rem 0.5rem" }}>
        Villages on the bank
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {s.clubs.map((club) => (
          <svg key={club.slug} viewBox="-80 -80 160 130" width="46%" style={{ maxWidth: 190 }}>
            <Village club={club} active={activeClubs.has(club.slug)} x={0} y={0} />
          </svg>
        ))}
      </div>
    </div>
  );
}

export type { Orientation };
