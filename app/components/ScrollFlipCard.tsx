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

      // Always run animation to handle tilt updates as well, or we can check tilt diff too.
      // For simplicity and smoothness, we'll run it. 
      // To optimize: only run if scroll diff > epsilon OR tilt changed (complex to track).
      // Given the previous issue was React Render loop, a purely JS loop is much cheaper.
      // We'll proceed with standard lerp.

      if (Math.abs(diff) > 0.0001) {
        smoothProgress.current += diff * 0.05;
      }

      /* ---------------- ANIMATION CALCULATIONS ---------------- */
      const p = smoothProgress.current;
      const SHRINK_END = 0.35;
      const HOLD_END = 0.5;

      const shrinkProgress = clamp(p / SHRINK_END, 0, 1);
      // const holdProgress = clamp((p - SHRINK_END) / (HOLD_END - SHRINK_END), 0, 1);
      const flipProgress = clamp((p - HOLD_END) / (1 - HOLD_END), 0, 1);

      // Scale Logic
      const shrinkScale = 1 - shrinkProgress * 0.75;
      const holdScale = 0.25;
      const flipScale = 0.25 + flipProgress * 3.75;

      let scale = shrinkScale;
      if (p >= SHRINK_END && p < HOLD_END) {
        scale = holdScale;
      } else if (p >= HOLD_END) {
        scale = flipScale;
      }

      // Inverse Scale Logic for Hero
      const inverseScale = scale !== 0 ? scale/16 : 1;

      // Rotation & Radius
      const rotateY = flipProgress * 180;
      const radius = 32 - flipProgress * 32;

      // Visibility
      // showFront if flipProgress < 0.5
      // showBack if flipProgress >= 0.5
      const showFront = flipProgress < 0.5;
      const showBack = flipProgress >= 0.5;

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

      // Update Faces Opacity
      if (frontFaceRef.current) {
        frontFaceRef.current.style.opacity = showFront ? '1' : '0';
      }
      if (backFaceRef.current) {
        backFaceRef.current.style.opacity = showBack ? '1' : '0';
      }

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
    const HOLD_END = 0.5;
    const flipProgress = clamp((p - HOLD_END) / (1 - HOLD_END), 0, 1);

    if (flipProgress > 0) return;

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
        <div className="perspective">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            style={{
              // Initial styles to prevent FOUC
              transform: 'scale(1)',
              borderRadius: '32px',
              willChange: "transform",
            }}
            className="relative w-screen h-screen overflow-hidden
           transition-transform duration-100 ease-out
           preserve-3d"
          >
            {/* ---------- FRONT FACE ---------- */}
            <div
              ref={frontFaceRef}
              className="absolute inset-0 face-hidden
                         transition-opacity duration-200
                         flex items-center justify-center"
            >
              <div className="w-full h-full bg-green-600 p-6">
                <div className="w-full h-full rounded-3xl overflow-hidden bg-green-500">
                  {/* <img
                    src="/character.png"
                    alt="First Section"
                    className="w-full h-full object-cover"
                  /> */}
                  <h2
                    className="text-4xl font-bold text-white"
                  >
                    First Section
                  </h2>
                </div>
              </div>
            </div>

            {/* ---------- BACK FACE ---------- */}
            <div
              ref={backFaceRef}
              className="absolute inset-0 face-hidden rotate-y-180
             flex items-center justify-center
             overflow-hidden"
              style={{ opacity: 0 }} // Start hidden
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
    </section>
  );
}
