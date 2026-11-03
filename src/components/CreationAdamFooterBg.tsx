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
  const stageRef = useRef<HTMLDivElement>(null);
  const adamRef = useRef<HTMLImageElement>(null);
  const godRef = useRef<HTMLImageElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  // 0 = footer just entering, 1 = footer fully on screen (drives the "hands come together" effect)
  const revealRef = useRef(0);


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
      revealRef.current = Math.max(0, Math.min(1, currentDist / Math.max(1, rect.height)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver & Smooth Parallax Hardware-Accelerated RAF Loop
  useEffect(() => {
    if (!interactive) return;

    let animFrameId: number | null = null;


    const updateParallax = () => {
      if (!isVisibleRef.current) { animFrameId = null; return; }

      // Hands drift apart while the footer scrolls in, then meet once it's fully visible
      const reveal = revealRef.current;
      const sep = 1 - (1 - Math.pow(1 - reveal, 3)); // ease-out: 1 → 0
      // No tilt: the stage stays flat and square-on; only the scroll brings the hands together
      if (adamRef.current) {
        const x = -sep * 18;
        const y = sep * 4;
        adamRef.current.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, 80px)`;
      }
      if (godRef.current) {
        const x = sep * 14;
        const y = -sep * 3;
        godRef.current.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, -60px)`;
      }

      // The purple spark between the fingertips lights up as the hands meet (and gently breathes)
      if (sparkRef.current) {
        const on = Math.max(0, 1 - sep * 1.6);
        const breathe = 1 + Math.sin(performance.now() / 600) * 0.08;
        sparkRef.current.style.opacity = on.toFixed(3);
        sparkRef.current.style.transform = `translate(-50%, -50%) translateZ(20px) scale(${(0.6 + on * 0.4) * breathe})`;
      }

      animFrameId = requestAnimationFrame(updateParallax);
    };

    const container = containerRef.current;

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
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto select-none bg-[var(--bg)] transition-colors duration-300"
    >

      {/* Creation of Adam, split into two depth layers inside a 3D stage that covers the footer */}
      <div className="absolute inset-0 [container-type:size] [perspective:1400px]">
        <div
          ref={stageRef}
          className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
          style={{
            width: "max(112cqw, 168cqh)",
            aspectRatio: "3 / 2",
            transform: "translate(-50%, -50%)",
            opacity: 0.55,
            willChange: "transform",
          }}
        >
          <img
            ref={godRef}
            src="/god-layer.webp"
            alt=""
            draggable={false}
            decoding="async"
            className="absolute"
            style={{ left: "43.89%", top: "0%", width: "56.11%", height: "100%", willChange: "transform" }}
          />
          <img
            ref={adamRef}
            src="/adam-layer.webp"
            alt=""
            draggable={false}
            decoding="async"
            className="absolute"
            style={{
              left: "0%",
              top: "38.06%",
              width: "43.89%",
              height: "61.94%",
              willChange: "transform",
              filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.35))",
            }}
          />
          {/* The spark: a white point of light in the gap between the hands, with a soft purple glow */}
          <div
            ref={sparkRef}
            className="pointer-events-none absolute"
            style={{ left: "43.6%", top: "49%", width: "6.5%", aspectRatio: "1 / 1", opacity: 0, transform: "translate(-50%, -50%)" }}
          >
            <div className="absolute inset-[-60%] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.55)_0%,rgba(147,51,234,0.22)_32%,rgba(147,51,234,0)_68%)]" />
            <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(243,232,255,0.85)_28%,rgba(216,180,254,0.35)_55%,rgba(216,180,254,0)_75%)]" />
            <div className="absolute left-1/2 top-1/2 h-[16%] w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.9),0_0_28px_10px_rgba(192,132,252,0.6)]" />
          </div>
        </div>
      </div>

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


