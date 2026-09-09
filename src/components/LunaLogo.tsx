import lunaLogo from "@/assets/luna-logo.png";
import { useEffect, useState } from "react";

type Festival = { name: string; from: string; to: string; ring: string; glow: string };

/**
 * Seasonal accent for the LUNA mark. Dates are month-day ranges, so the logo
 * quietly changes its glow around festivals without any manual switch.
 */
const FESTIVALS: Festival[] = [
  { name: "New Year", from: "12-30", to: "01-02", ring: "#8ee6ff", glow: "#3fa9ff" },
  { name: "Sankranti", from: "01-13", to: "01-16", ring: "#ffd479", glow: "#ff9f43" },
  { name: "Republic Day", from: "01-25", to: "01-27", ring: "#7ee6a5", glow: "#ff9f43" },
  { name: "Holi", from: "03-08", to: "03-16", ring: "#ff8ad1", glow: "#7c5cff" },
  { name: "Independence Day", from: "08-14", to: "08-16", ring: "#8ff0b6", glow: "#ff9f43" },
  { name: "Diwali", from: "10-25", to: "11-08", ring: "#ffd257", glow: "#ff7a2f" },
  { name: "Christmas", from: "12-20", to: "12-27", ring: "#ff8f8f", glow: "#6fe7a0" },
];

function inRange(date: Date, from: string, to: string) {
  const key = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  // Ranges that wrap the year end (e.g. 12-30 → 01-02).
  return from <= to ? key >= from && key <= to : key >= from || key <= to;
}

export function festivalFor(date: Date): Festival | null {
  return FESTIVALS.find((f) => inRange(date, f.from, f.to)) ?? null;
}

export function LunaLogo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const [festival, setFestival] = useState<Festival | null>(null);

  useEffect(() => {
    setFestival(festivalFor(new Date()));
  }, []);

  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      title={festival ? `Happy ${festival.name} from StudyLuna` : "StudyLuna"}
    >
      {festival && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 0 2px ${festival.ring}, 0 0 18px ${festival.glow}`,
          }}
        />
      )}
      <img
        src={lunaLogo}
        alt="LUNA logo"
        width={size}
        height={size}
        className="animate-float h-full w-full rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
      />
    </span>
  );
}
