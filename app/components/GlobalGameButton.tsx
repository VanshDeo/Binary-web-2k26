"use client";

import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import SpaceInvadersGame from './SpaceInvadersGame';

const GlobalGameButton = () => {
    const [showGame, setShowGame] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowGame(true)}
                className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[100] bg-green-500 hover:bg-green-600 text-black p-3 md:p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 group"
                title="Play Space Invaders"
            >
                <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
            </button>

            {showGame && <SpaceInvadersGame onClose={() => setShowGame(false)} />}
        </>
    );
};

export default GlobalGameButton;
