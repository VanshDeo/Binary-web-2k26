"use client";
import React, { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

// Add Lenis to window object for global access
declare global {
    interface Window {
        lenis: Lenis;
    }
}

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const lenis = new Lenis();
        window.lenis = lenis;

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            // Clean up if necessary, though for root layout it's usually fine
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
