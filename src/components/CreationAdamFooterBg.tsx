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

    const handleMouseLeave = () => {
      targetMouse.current = { x: 0, y: 0 };
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
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
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto select-none bg-[var(--bg)] transition-colors duration-300"
    >
      {/* Seamless Top Fade Overlay — smoothly blends section above into footer background */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/70 to-transparent pointer-events-none z-10" />

      {/* Plane 1 — Primary Creation of Adam background image */}
      <div
        ref={plane1Ref}
        className="absolute w-[110%] h-[110%] -top-[5%] -left-[5%]"
        style={{
          backgroundImage: `url('/creation-adam-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.5,
          willChange: "transform",
        }}
      />

      {/* Subtle Focal Target Glow on Dynamic Verb Word */}
      <div
        className="absolute pointer-events-none transition-all duration-500 rounded-full"
        style={{
          left: `${targetCoords.x}%`,
          top: `${targetCoords.y}%`,
          transform: "translate(-50%, -50%)",
          width: pulse ? "180px" : "110px",
          height: pulse ? "180px" : "110px",
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0) 70%)",
          opacity: pulse ? 1 : 0.5,
        }}
      />
    </div>
  );
}


