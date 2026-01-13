"use client";

// testing commit
import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import SpaceInvadersGame from './SpaceInvaders';
import TetrisGame from './TetrisGame';

const GlobalGameButton = () => {
    // states: 'closed', 'menu', 'space_invaders', 'tetris'
    const [viewState, setViewState] = useState<'closed' | 'menu' | 'space_invaders' | 'tetris'>('closed');

    const handleClose = () => setViewState('closed');
    const handleBack = () => setViewState('menu');

    return (
        <>
            {viewState === 'closed' && (
                <button
                    onClick={() => setViewState('menu')}
                    className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-100 bg-green-500 hover:bg-green-600 text-black p-3 md:p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 group"
                    title="Play Games"
                >
                    <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
                </button>
            )}

            {viewState === 'menu' && (
                <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    {/* Close Menu Mask/Button */}
                    <div className="absolute inset-0" onClick={handleClose} />

                    <div className="relative bg-black border-2 border-green-500 rounded-xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(34,197,94,0.3)] flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-green-500 text-center mb-4 font-mono">SELECT GAME</h2>

                        <button
                            onClick={() => setViewState('space_invaders')}
                            className="w-full py-4 px-6 bg-green-900/30 border border-green-500/50 hover:bg-green-500 hover:text-black text-green-400 font-mono text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            <Gamepad2 className="w-5 h-5 group-hover:scale-110" />
                            SPACE INVADERS
                        </button>

                        <button
                            onClick={() => setViewState('tetris')}
                            className="w-full py-4 px-6 bg-green-900/30 border border-green-500/50 hover:bg-green-500 hover:text-black text-green-400 font-mono text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            <div className="w-5 h-5 grid grid-cols-2 gap-0.5 group-hover:scale-110 transition-transform">
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px] opacity-0" />
                            </div>
                            TETRIS
                        </button>

                        <button
                            onClick={handleClose}
                            className="mt-2 text-sm text-gray-500 hover:text-white underline underline-offset-4 text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {viewState === 'space_invaders' && <SpaceInvadersGame onClose={handleClose} onBack={handleBack} />}
            {viewState === 'tetris' && <TetrisGame onClose={handleClose} onBack={handleBack} />}
        </>
    );
};

export default GlobalGameButton;
