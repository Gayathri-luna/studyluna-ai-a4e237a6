import { useEffect, useRef, useState } from "react";

type Star = {
  /** distance from galactic centre */
  r: number;
  /** angle inside the spiral arm */
  a: number;
  /** vertical scatter (galactic disc thickness) */
  y: number;
  size: number;
  brightness: number;
  twinkle: number;
  tint: number;
};

const STAR_COUNT = 900;
const ARMS = 4;

function makeStars(): Star[] {
  // deterministic pseudo random so SSR/CSR and re-mounts stay identical
  let seed = 987654321;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const arm = i % ARMS;
    const t = Math.pow(rand(), 0.6);
    const r = 0.08 + t * 1.05;
    const spread = (rand() - 0.5) * (0.5 + t * 0.9);
    const a = (arm / ARMS) * Math.PI * 2 + t * 3.1 + spread;
    return {
      r,
      a,
      y: (rand() - 0.5) * 0.12 * (1.2 - t),
      size: 0.5 + rand() * 1.7,
      brightness: 0.25 + rand() * 0.75,
      twinkle: rand() * Math.PI * 2,
      tint: rand(),
    };
  });
}

/**
 * Animated 3D galaxy backdrop: a tilted spiral disc of stars rendered with a
 * real perspective projection on canvas, plus soft nebula clouds. Colours come
 * from the design tokens, and motion freezes for reduced-motion users.
 */
export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;
    const coreColor = token("--primary", "oklch(0.7 0.16 265)");
    const armColor = token("--chart-2", "oklch(0.7 0.14 190)");
    const glowColor = token("--chart-4", "oklch(0.8 0.16 85)");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = makeStars();

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onPointer);

    let tiltX = 0;
    let tiltY = 0;
    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const time = reduced ? 0 : (now - start) / 1000;
      const scale = Math.max(width, height) * 0.55;

      // eased camera drift toward the pointer for a parallax feel
      tiltX += (pointerY * 0.18 - tiltX) * 0.03;
      tiltY += (pointerX * 0.35 - tiltY) * 0.03;

      const pitch = 1.02 + tiltX + Math.sin(time * 0.06) * 0.05;
      const yaw = time * 0.035 + tiltY;
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cx = width / 2;
      const cy = height * 0.46;
      const camera = 3.2;

      ctx.clearRect(0, 0, width, height);

      // nebula clouds
      ctx.globalCompositeOperation = "lighter";
      const clouds: Array<[number, number, number, string, number]> = [
        [cx - width * 0.18, cy - height * 0.05, scale * 0.95, armColor, 0.1],
        [cx + width * 0.22, cy + height * 0.12, scale * 0.8, coreColor, 0.12],
        [cx + width * 0.05, cy - height * 0.2, scale * 0.6, glowColor, 0.06],
      ];
      for (const [x, y, radius, color, alpha] of clouds) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "transparent");
        ctx.globalAlpha = alpha;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // galactic core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.28);
      coreGrad.addColorStop(0, glowColor);
      coreGrad.addColorStop(0.35, coreColor);
      coreGrad.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // stars — differential rotation makes the arms wind slowly
      for (const s of stars) {
        const angle = s.a + time * (0.16 / (0.28 + s.r));
        const x0 = Math.cos(angle) * s.r;
        const z0 = Math.sin(angle) * s.r;
        const y0 = s.y;

        // yaw then pitch, then perspective divide
        const xr = x0 * cosY - z0 * sinY;
        const zr = x0 * sinY + z0 * cosY;
        const yr = y0 * cosP - zr * sinP;
        const zz = y0 * sinP + zr * cosP;

        const depth = camera + zz;
        if (depth <= 0.35) continue;
        const persp = camera / depth;
        const px = cx + xr * scale * persp;
        const py = cy + yr * scale * persp * 1.15;
        if (px < -40 || px > width + 40 || py < -40 || py > height + 40) continue;

        const flicker = reduced ? 1 : 0.75 + Math.sin(time * 1.6 + s.twinkle) * 0.25;
        ctx.globalAlpha = Math.min(1, s.brightness * flicker * persp * 0.75);
        ctx.fillStyle = s.tint > 0.62 ? armColor : s.tint > 0.24 ? coreColor : glowColor;
        const radius = s.size * persp;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [mounted]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      {mounted && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />
    </div>
  );
}
