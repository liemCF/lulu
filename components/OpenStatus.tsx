"use client";

import { useSyncExternalStore } from "react";
import { schedule, timeZone } from "@/lib/content";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmt(mins: number) {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const h = h24 % 12 || 12;
  const suffix = h24 < 12 ? "AM" : "PM";
  if (mins === 24 * 60) return "midnight";
  return m ? `${h}:${String(m).padStart(2, "0")} ${suffix}` : `${h} ${suffix}`;
}

function status(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = DAYS.indexOf(get("weekday"));
  const now = Number(get("hour")) * 60 + Number(get("minute"));

  const today = schedule[day];
  if (today && now >= today[0] && now < today[1]) return `open|Open now · until ${fmt(today[1])}`;
  if (today && now < today[0]) return `soon|Opens today at ${fmt(today[0])}`;
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const next = schedule[d];
    if (next) return `closed|Closed · opens ${i === 1 ? "tomorrow" : DAYS[d]} ${fmt(next[0])}`;
  }
  return "closed|Closed";
}

const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 30_000);
  return () => window.clearInterval(id);
};

/** Live open/closed line in restaurant time. Renders nothing on the server to avoid a hydration mismatch. */
export default function OpenStatus() {
  const value = useSyncExternalStore(subscribe, status, () => "");
  if (!value) return null;
  const [state, label] = value.split("|");
  const dot =
    state === "open"
      ? "bg-[#5be38a] shadow-[0_0_10px_#5be38a] animate-pulse"
      : state === "soon"
        ? "bg-gold"
        : "bg-cream/30";
  return (
    <span className="flex items-center gap-2 text-[0.68rem] tracking-[0.22em] text-cream/70 uppercase">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
