"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import TetrisInterface from "../components/TetrisInterface";
import GlobalGameButton from "../components/GlobalGameButton";
import SpaceInvadersLoadingV2 from "../components/preloader/SpaceInvadersLoadingV2";

import PixelTransition from "../components/preloader/PixelTransition";

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [transitionActive, setTransitionActive] = useState(false);

    return (
        <div className="min-h-screen text-white relative overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                {isLoading && (
                    <SpaceInvadersLoadingV2
                        onLoadingComplete={() => setIsLoading(false)}
                        onTransitionChange={setTransitionActive}
                    />
                )}
            </AnimatePresence>

            {/* Transition Overlay */}
            <div className="fixed inset-0 z-[60] pointer-events-none">
                <PixelTransition
                    isActive={transitionActive}
                />
            </div>

            <Navbar />
            <TetrisInterface />
            <GlobalGameButton />
        </div>
    );
}
