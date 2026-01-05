'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import type { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
// import Particles from "react-tsparticles";
function MatrixRain({ timeout }: { timeout: number }) {
  let canvas = useRef<HTMLCanvasElement | null>(null);
  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvas.current) {
      canvasCtxRef.current = canvas.current.getContext('2d');
      const context = canvasCtxRef.current;

      const width = document.body.offsetWidth;
      const height = document.body.offsetHeight;
      canvas.current.width = width;
      canvas.current.height = height;

      if (context) {
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        // calculate how many 'lines' to show and animate
        const columns = Math.floor(width / 20) + 1;
        const yPositions: number[] = Array.from({ length: columns }).fill(0) as number[];

        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        const matrixEffect = () => {
          context.fillStyle = '#0001';
          context.fillRect(0, 0, width, height);

          context.fillStyle = '#16783C';
          context.font = '15pt monospace';

          yPositions.forEach((y, index) => {
            // const text = String.fromCharCode(Math.random() * 128);
            const text = Math.floor(Math.random() * 2).toString();
            const x = index * 20;
            context.fillText(text, x, y);

            if (y > 100 + Math.random() * 10000) {
              yPositions[index] = 0;
            } else {
              yPositions[index] = y + 20;
            }
          });
        };

        const interval = setInterval(matrixEffect, timeout);
        return () => {
          clearInterval(interval);
        };
      }
    }
  }, [canvas, timeout]);
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    await console.log(container);
  }, []);
  return (
    <div
      style={{
        // custom styles to make it show up in the background
        background: '#000000',
        overflow: 'hidden',
        position: 'fixed',
        height: '100%',
        width: '100%',
        zIndex: -1,
        left: '0',
        top: '0',
      }}
    >
      <canvas ref={canvas} className="fixed left-0 top-0 z-[-1] overflow-hidden" />
    </div>
  );
}

export default MatrixRain;
