import { useEffect, useMemo, useRef, useState } from "react";
import galaxy1 from "@/assets/galaxy-1.jpg";
import galaxy2 from "@/assets/galaxy-2.jpg";
import galaxy3 from "@/assets/galaxy-3.jpg";
import galaxy4 from "@/assets/galaxy-4.jpg";
import galaxy5 from "@/assets/galaxy-5.jpg";
import galaxy6 from "@/assets/galaxy-6.jpg";
import galaxy7 from "@/assets/galaxy-7.jpg";

/** One real deep-space scene per day of the week — rotates automatically. */
const SCENES = [galaxy1, galaxy2, galaxy3, galaxy4, galaxy5, galaxy6, galaxy7] as const;

/** Day index since epoch, so the scene changes at local midnight. */
function sceneForToday(): string {
  const now = new Date();
  const days = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000,
  );
  return SCENES[((days % SCENES.length) + SCENES.length) % SCENES.length]!;
}

type Twinkle = { x: number; y: number; size: number; phase: number; speed: number };

const TWINKLE_COUNT = 140;

function makeTwinkles(): Twinkle[] {
  let seed = 20260904;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: TWINKLE_COUNT }, () => ({
    x: rand(),
    y: rand(),
    size: 0.5 + rand() * 1.4,
    phase: rand() * Math.PI * 2,
    speed: 0.4 + rand() * 1.2,
  }));
}

/**
 * Photo-real galaxy backdrop: a deep-space photograph that changes every day,
 * kept alive with a very slow drift/zoom, pointer parallax and a thin layer of
 * twinkling stars painted on canvas. Motion freezes for reduced-motion users.
 */
export function GalaxyBackground() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const twinkles = useMemo(makeTwinkles, []);
  const scene = useMemo(sceneForToday, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onPointer);

    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (ctx) {
        ctx.clearRect(0, 0, w, h);
        for (const star of twinkles) {
          const t = reduced ? star.phase : star.phase + (time / 1000) * star.speed;
          const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t));
          ctx.globalAlpha = alpha;
          ctx.fillStyle = "#eaf6ff";
          ctx.beginPath();
          ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      const layer = layerRef.current;
      if (layer) {
        currentX += (pointerX - currentX) * 0.03;
        currentY += (pointerY - currentY) * 0.03;
        const drift = reduced ? 0 : Math.sin(time / 42_000) * 12;
        const zoom = reduced ? 1.06 : 1.06 + 0.02 * (0.5 + 0.5 * Math.sin(time / 60_000));
        layer.style.transform = `translate3d(${currentX * -14 + drift}px, ${
          currentY * -10
        }px, 0) scale(${zoom})`;
      }

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [mounted, twinkles]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={layerRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${scene})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.55,
        }}
      />
      {mounted && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}
      {/* Keeps text readable over bright nebula areas. */}
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/80" />
    </div>
  );
}
