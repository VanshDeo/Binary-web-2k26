"use client";

import { useEffect, useRef, useState } from "react";

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export default function ScrollFlipCard() {
  const sectionRef = useRef<HTMLDivElement>(null);

const targetProgress = useRef(0);   // raw scroll
const smoothProgress = useRef(0);   // delayed animation
const [, forceRender] = useState(0);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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

  // Delay Creation
  useEffect(() => {
    let rafId: number;
  
    const animate = () => {
      // Adjust 0.08 to control delay
      smoothProgress.current +=
        (targetProgress.current - smoothProgress.current) * 0.05;
  
      forceRender(v => v + 1);
      rafId = requestAnimationFrame(animate);
    };
  
    animate();
  
    return () => cancelAnimationFrame(rafId);
  }, []);
  
  const p = smoothProgress.current;

  const SHRINK_END = 0.4;

  const shrinkProgress = clamp(p / SHRINK_END, 0, 1);
  const flipProgress = clamp(
    (p - SHRINK_END) / (1 - SHRINK_END),
    0,
    1
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipProgress > 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // Phase 1: fullscreen → card
  const shrinkScale = 1 - shrinkProgress * 0.75;

  // Phase 2: card → flip + grow
  const flipScale = 0.25 + flipProgress * 3.75;

  const scale = p < SHRINK_END ? shrinkScale : flipScale;

  const rotateY = flipProgress * 180;
  const radius = 32 - flipProgress * 32;

  const showFront = flipProgress < 0.5;
  const showBack = flipProgress >= 0.5;

  const textOpacity = clamp((flipProgress - 0.5) * 2, 0, 1);
  const textY = 12 - textOpacity * 12;

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="perspective">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            style={{
              transform: `
                scale(${scale})
                rotateY(${rotateY}deg)
                rotateX(${tilt.x}deg)
                rotateY(${tilt.y}deg)
              `,
              borderRadius: `${radius}px`,
            }}
            className="relative w-screen h-screen
                       transition-transform duration-100 ease-out
                       preserve-3d"
          >
            {/* ---------- FRONT FACE ---------- */}
            <div
              style={{ opacity: showFront ? 1 : 0 }}
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
              style={{ opacity: showBack ? 1 : 0 }}
              className="absolute inset-0 face-hidden rotate-y-180
                          flex items-center justify-center"
            >
              <h2
                style={{
                  opacity: textOpacity,
                  transform: `translateY(${textY}px)`,
                }}
                className="text-4xl font-bold text-green-900 text-lg lg:text-3xl"
              >
                Next Section
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
