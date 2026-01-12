"use client";

import { useEffect, useRef } from "react";
import Hero from '../components/Hero';
import { useInView } from 'react-intersection-observer';

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export default function ScrollFlipCard() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animation Refs
  const cardRef = useRef<HTMLDivElement>(null);
  const frontFaceRef = useRef<HTMLDivElement>(null);
  const backFaceRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);

  const targetProgress = useRef(0);   // raw scroll
  const smoothProgress = useRef(0);   // delayed animation

  const tiltRef = useRef({ x: 0, y: 0 });

  const [heroTopRef, heroTopInView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
    initialInView: true,
  });

  /* ---------------- SCROLL LOGIC ---------------- */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      const start = sectionTop;
      const end = sectionTop + sectionHeight - windowHeight;

      const raw = (window.scrollY - start) / (end - start);
      targetProgress.current = clamp(raw, 0, 1);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animation Loop
  useEffect(() => {
    let rafId: number;

    const animate = () => {
      const diff = targetProgress.current - smoothProgress.current;

      if (Math.abs(diff) > 0.0001) {
        smoothProgress.current += diff * 0.05;
      }

      /* ---------------- ANIMATION CALCULATIONS ---------------- */
      const p = smoothProgress.current;

      const SHRINK_END = 0.3;
      const FLIP_START = 0.35;
      const FLIP_END = 0.65;

      let scale = 1;
      let rotateY = 0;
      let radius = 32;
      let scanlineOpacity = 1;

      if (p <= SHRINK_END) {
        // Phase 1: Shrink
        const prog = clamp(p / SHRINK_END, 0, 1);
        scale = 1 - prog * 0.75; // 1 -> 0.25
        scanlineOpacity = 1;
      } else if (p <= FLIP_START) {
        // Phase 2: Hold Small
        scale = 0.25;
        scanlineOpacity = 1;
      } else if (p <= FLIP_END) {
        // Phase 3: Flip (Review Back Card)
        const prog = clamp((p - FLIP_START) / (FLIP_END - FLIP_START), 0, 1);
        scale = 0.25 + prog * 3.75; // 0.25 -> 4.0
        rotateY = prog * 180;
        radius = 32 * (1 - prog);
        // Lower scanline opacity as we reveal the back card
        scanlineOpacity = 1 - prog * 0.85; // 1.0 -> 0.15
      } else {
        // Phase 4: Hold Big (User reads content)
        scale = 4.0;
        rotateY = 180;
        radius = 0;
        scanlineOpacity = 0.15;
      }

      // Inverse Scale Logic for Hero (Preserved but simplified logic if needed)
      const inverseScale = scale !== 0 ? scale / 16 : 1;

      // Update scanline opacity globally
      // document.documentElement.style.setProperty('--scanline-opacity', scanlineOpacity.toString());

      /* ---------------- DOM UPDATES ---------------- */

      // Update Card Transform
      if (cardRef.current) {
        cardRef.current.style.transform = `
          scale(${scale})
          rotateY(${rotateY}deg)
          rotateX(${tiltRef.current.x}deg)
          rotateY(${tiltRef.current.y}deg)
        `;
        cardRef.current.style.borderRadius = `${radius}px`;
      }

      // Note: We removed manual opacity toggling. We rely on backface-visibility: hidden.

      // Update Hero Inverse Scale
      if (heroWrapperRef.current) {
        heroWrapperRef.current.style.transform = `scale(${inverseScale})`;
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    const p = smoothProgress.current;
    const FLIP_START = 0.35;

    // Disable tilt if flip has started
    if (p > FLIP_START) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    tiltRef.current = { x: rotateX, y: rotateY };
  };

  const resetTilt = () => {
    tiltRef.current = { x: 0, y: 0 };
  };

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="perspective" style={{ perspective: '1000px' }}>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            style={{
              // Initial styles to prevent FOUC
              transform: 'scale(1)',
              borderRadius: '32px',
              willChange: "transform",
              transformStyle: 'preserve-3d',
            }}
            className="relative w-screen h-screen overflow-hidden
           transition-transform duration-100 ease-out"
          >
            {/* ---------- FRONT FACE ---------- */}
            <div
              ref={frontFaceRef}
              className="absolute inset-0
              flex items-center justify-center
              backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                zIndex: 2
              }}
            >
              <div className="w-full h-full p-6 flex flex-col items-center justify-center bg-black">
                <div className="w-[80vw] h-[80vh] max-w-4xl max-h-[800px] rounded-3xl overflow-hidden bg-green-900/20 border-4 border-green-500 flex flex-col items-center justify-center relative">
                  <img
                    src="/mascot.png"
                    alt="First Section"
                    className="w-full h-full object-contain p-8 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                  />
                  <h2
                    className="absolute bottom-8 text-4xl font-bold text-white drop-shadow-md font-press-start"
                  >
                    Enter the Grid
                  </h2>
                </div>
              </div>
            </div>

            {/* ---------- BACK FACE ---------- */}
            <div
              ref={backFaceRef}
              className="absolute inset-0 
              flex items-center justify-center
              overflow-hidden"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                zIndex: 1
              }}
            >
              {/* Neutralize parent scaling */}
              <div
                ref={heroWrapperRef}
                style={{
                  width: "100%",
                  height: "100%",
                  willChange: "transform",
                }}
                className="origin-center"
              >
                <Hero heroTopRef={heroTopRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}
