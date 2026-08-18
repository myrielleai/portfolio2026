import { useState, useEffect, useRef } from "react";

interface CreationAdamFooterBgProps {
  interactive?: boolean;
  targetRef?: React.RefObject<HTMLElement | null>;
  wordIndex?: number;
}

export default function CreationAdamFooterBg({
  interactive = true,
  targetRef,
  wordIndex = 0,
}: CreationAdamFooterBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posDeltaRef = useRef<HTMLDivElement>(null);
  const plane1Ref = useRef<HTMLDivElement>(null);
  const plane2Ref = useRef<HTMLDivElement>(null);
  const plane3Ref = useRef<HTMLDivElement>(null);

  // Mouse tracking (-1 to 1)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Scroll tracking (0 to 1) via Ref (avoids React re-render state churn on every scroll pixel)
  const scrollProgressRef = useRef(0.5);
  const isVisibleRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  // Target word coordinates relative to footer container (%)
  const [targetCoords, setTargetCoords] = useState<{ x: number; y: number }>({ x: 62, y: 28 });
  const [pulse, setPulse] = useState(false);

  // Measure target word position
  const updateTargetPos = () => {
    if (targetRef?.current && containerRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      if (containerRect.width > 0 && containerRect.height > 0) {
        const x = ((targetRect.left + targetRect.width / 2 - containerRect.left) / containerRect.width) * 100;
        const y = ((targetRect.top + targetRect.height / 2 - containerRect.top) / containerRect.height) * 100;
        setTargetCoords({ x, y });
      }
    }
  };

  useEffect(() => {
    updateTargetPos();
    window.addEventListener("resize", updateTargetPos);
    return () => window.removeEventListener("resize", updateTargetPos);
  }, [targetRef]);

  // Trigger pulse effect when word changes
  useEffect(() => {
    updateTargetPos();
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 700);
    return () => clearTimeout(timeout);
  }, [wordIndex]);

  // Scroll Parallax Handler (updates Ref directly without forcing React component re-renders)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 0 when top of footer enters bottom of viewport, 1 when bottom of footer leaves top of viewport
      const totalDist = windowHeight + rect.height;
      const currentDist = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));
      scrollProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver & Smooth Parallax Hardware-Accelerated RAF Loop
  useEffect(() => {
    if (!interactive) return;

    let animFrameId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isVisibleRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      targetMouse.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      targetMouse.current = { x: 0, y: 0 };
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    const updateParallax = () => {
      if (!isVisibleRef.current) return;

      const lerpFactor = 0.1;
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * lerpFactor;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * lerpFactor;

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;
      const scrollDelta = scrollProgressRef.current - 0.5;

      // Plane 1: Distant background
      const bgX = (mx * 10).toFixed(2);
      const bgY = (my * 6 + scrollDelta * -20).toFixed(2);

      // Plane 2: Mid-ground overlay
      const midX = (mx * 26).toFixed(2);
      const midY = (my * 18 + scrollDelta * -45).toFixed(2);

      // Plane 3: Foreground atmospheric wash
      const fgX = (mx * 42).toFixed(2);
      const fgY = (my * 30 + scrollDelta * -70).toFixed(2);

      // Direct hardware-accelerated DOM transforms without React re-render overhead
      if (plane1Ref.current) {
        plane1Ref.current.style.transform = `translate3d(${bgX}px, ${bgY}px, 0) scale(1.08)`;
      }
      if (plane2Ref.current) {
        plane2Ref.current.style.transform = `translate3d(${midX}px, ${midY}px, 0)`;
      }
      if (plane3Ref.current) {
        plane3Ref.current.style.transform = `translate3d(${fgX}px, ${fgY}px, 0)`;
      }

      if (posDeltaRef.current) {
        const px = Math.round(mx * 100);
        const py = Math.round(my * 100);
        const sx = px >= 0 ? `+${px}` : `${px}`;
        const sy = py >= 0 ? `+${py}` : `${py}`;
        posDeltaRef.current.textContent = `POS_DELTA: [${sx}, ${sy}]`;
      }

      animFrameId = requestAnimationFrame(updateParallax);
    };

    // IntersectionObserver to pause loop when footer is out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!animFrameId) {
            animFrameId = requestAnimationFrame(updateParallax);
          }
        } else {
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
        }
      },
      { threshold: 0.01 }
    );

    if (container) {
      observer.observe(container);
    }

    return () => {
      observer.disconnect();
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto select-none bg-[var(--bg)] transition-colors duration-300"
    >
      {/* Plane 1 — Distant: base fresco image */}
      <div
        ref={plane1Ref}
        className="absolute w-[115%] h-[115%] -top-[7.5%] -left-[7.5%]"
        style={{
          backgroundImage: `url('/creation-adam-bg.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
          filter: "brightness(1.0) contrast(1.05) saturate(0.85)",
          willChange: "transform",
        }}
      />

      {/* Plane 2 — Mid-ground: depth layer overlay */}
      <div
        ref={plane2Ref}
        className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%]"
        style={{
          backgroundImage: `url('/creation-adam-bg.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          opacity: 0.18,
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {/* Plane 3 — Foreground: atmospheric warm haze */}
      <div
        ref={plane3Ref}
        className="absolute w-[130%] h-[130%] -top-[15%] -left-[15%]"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 55% 45%, rgba(196,90,60,0.18) 0%, rgba(120,60,160,0.08) 50%, transparent 80%)",
          opacity: 0.85,
          willChange: "transform",
        }}
      />

      {/* Subtle blueprint grid overlay */}
      <div className="absolute inset-0 bg-lab-grid opacity-15 mix-blend-multiply pointer-events-none" />

      {/* Focal Target Glow on Violet Word */}
      <div
        className="absolute pointer-events-none transition-all duration-500 rounded-full"
        style={{
          left: `${targetCoords.x}%`,
          top: `${targetCoords.y}%`,
          transform: "translate(-50%, -50%)",
          width: pulse ? "180px" : "110px",
          height: pulse ? "180px" : "110px",
          background: "radial-gradient(circle, rgba(196, 90, 60, 0.25) 0%, rgba(196, 90, 60, 0) 70%)",
          opacity: pulse ? 1 : 0.6,
        }}
      />

      {/* 4. Technical Blueprint HUD Overlay */}
      <div className="absolute top-6 left-8 z-20 font-mono text-[9px] text-[var(--text-muted)] tracking-widest pointer-events-none select-none uppercase opacity-80 hidden sm:block">
        <div className="flex items-center gap-2 text-[var(--accent)] font-semibold mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>PARALLAX_FRESCO // CREATION_OF_ADAM</span>
        </div>
        <div ref={posDeltaRef}>POS_DELTA: [+0, +0]</div>
        <div>TARGET_WORD: [{Math.round(targetCoords.x)}%, {Math.round(targetCoords.y)}%]</div>
      </div>

      <div className="absolute top-6 right-8 z-20 font-mono text-[9px] text-[var(--text-muted)] tracking-widest pointer-events-none select-none uppercase opacity-80 text-right hidden sm:block">
        <div>MICHELANGELO // 1512</div>
        <div>STATUS: {isHovered ? "PARALLAX_TRACKING" : "STANDBY_DRIFT"}</div>
      </div>

      {/* 5. Editorial Light Scrim Overlay for seamless top transition from Capabilities */}
      <div className="absolute inset-x-0 top-0 h-72 sm:h-96 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/75 to-transparent pointer-events-none z-20" />
    </div>
  );
}
