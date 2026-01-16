"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Pixelify_Sans, Geist_Mono } from "next/font/google";
import { X, ChevronLeft, ArrowLeft, ArrowRight, ArrowDown, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    variable: "--font-pixelify"
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono"
});

/* -------------------------------------------------------------------------------------------------
 * CONFIG & CONSTANTS
 * -----------------------------------------------------------------------------------------------*/

const COLORS = [
    null,
    '#22c55e', // T
    '#16a34a', // O
    '#15803d', // S
    '#4ade80', // Z
    '#86efac', // L
    '#059669', // J
    '#10b981', // I
];

const PIECES = [
    [],
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]], // T
    [[2, 2], [2, 2]],       // O
    [[0, 3, 3], [3, 3, 0], [0, 0, 0]], // S
    [[4, 4, 0], [0, 4, 4], [0, 0, 0]], // Z
    [[0, 0, 5], [5, 5, 5], [0, 0, 0]], // L
    [[6, 0, 0], [6, 6, 6], [0, 0, 0]], // J
    [[0, 0, 0, 0], [7, 7, 7, 7], [0, 0, 0, 0], [0, 0, 0, 0]], // I
];

const createMatrix = (w: number, h: number) => {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
};

const collide = (arena: number[][], player: { matrix: number[][], pos: { x: number, y: number } }) => {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0) {
                if (!arena[y + o.y] || arena[y + o.y][x + o.x] === undefined || arena[y + o.y][x + o.x] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
};

const merge = (arena: number[][], player: { matrix: number[][], pos: { x: number, y: number } }) => {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (arena[y + player.pos.y] && arena[y + player.pos.y] !== undefined) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            }
        });
    });
};

const rotate = (matrix: number[][], dir: number) => {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
};

// --- PREVIEW CANVAS COMPONENT ---
const NextPiecePreview = ({ typeId }: { typeId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const matrix = PIECES[typeId];
        if (!matrix || matrix.length === 0) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bs = 20;
        const offsetX = (canvas.width - matrix[0].length * bs) / 2;
        const offsetY = (canvas.height - matrix.length * bs) / 2;

        ctx.fillStyle = COLORS[typeId] || '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillRect(offsetX + x * bs, offsetY + y * bs, bs, bs);
                    ctx.strokeRect(offsetX + x * bs, offsetY + y * bs, bs, bs);
                }
            });
        });

    }, [typeId]);

    return (
        <div className="w-full h-24 bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <canvas ref={canvasRef} width={80} height={80} />
        </div>
    );
};

// --- MAIN INTERFACE ---

const TetrisGame = ({ onClose, onBack }: { onClose: () => void, onBack?: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    // UI State
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [nextPieceType, setNextPieceType] = useState<number>(0);
    const [gameOver, setGameOver] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);

    const stateRef = useRef({
        grid: [] as number[][],
        activePiece: null as any,
        nextPieceType: 0,
        dropCounter: 0,
        dropInterval: 1000, // Initial speed
        lastTime: 0,
        score: 0,
        lines: 0,
        level: 1,
        gameOver: false
    });

    const layoutRef = useRef({
        blockSize: 30
    });

    const requestRef = useRef<number>(0);

    // Game Logic Functions
    const playerReset = () => {
        const pieces = '1234567';
        if (stateRef.current.nextPieceType === 0) {
            stateRef.current.nextPieceType = (PIECES.length * Math.random() | 0) || 1;
        }

        const typeId = stateRef.current.nextPieceType;
        stateRef.current.activePiece = {
            matrix: PIECES[typeId].map(row => [...row]), // Clone
            pos: { x: 0, y: 0 },
            type: typeId
        };

        // Center piece
        const cols = stateRef.current.grid[0].length;
        stateRef.current.activePiece.pos.x = (cols / 2 | 0) - (stateRef.current.activePiece.matrix[0].length / 2 | 0);
        stateRef.current.activePiece.pos.y = 0;

        // Generate next piece
        stateRef.current.nextPieceType = (PIECES.length * Math.random() | 0) || 1;
        setNextPieceType(stateRef.current.nextPieceType);

        if (collide(stateRef.current.grid, stateRef.current.activePiece)) {
            stateRef.current.gameOver = true;
            setGameOver(true);
        }
    };

    const playerDrop = () => {
        stateRef.current.activePiece.pos.y++;
        if (collide(stateRef.current.grid, stateRef.current.activePiece)) {
            stateRef.current.activePiece.pos.y--;
            merge(stateRef.current.grid, stateRef.current.activePiece);

            // Add score for placing a piece
            stateRef.current.score += 10;
            setScore(stateRef.current.score);

            playerReset();
            arenaSweep();
        }
        stateRef.current.dropCounter = 0;
    };

    const playerMove = (dir: number) => {
        stateRef.current.activePiece.pos.x += dir;
        if (collide(stateRef.current.grid, stateRef.current.activePiece)) {
            stateRef.current.activePiece.pos.x -= dir;
        }
    };

    const playerRotate = (dir: number) => {
        const pos = stateRef.current.activePiece.pos.x;
        let offset = 1;
        rotate(stateRef.current.activePiece.matrix, dir);
        while (collide(stateRef.current.grid, stateRef.current.activePiece)) {
            stateRef.current.activePiece.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > stateRef.current.activePiece.matrix[0].length) {
                rotate(stateRef.current.activePiece.matrix, -dir);
                stateRef.current.activePiece.pos.x = pos;
                return;
            }
        }
    };

    const arenaSweep = () => {
        const grid = stateRef.current.grid;
        let clearedCount = 0;
        outer: for (let y = grid.length - 1; y >= 0; --y) {
            for (let x = 0; x < grid[y].length; ++x) {
                if (grid[y][x] === 0) continue outer;
            }
            const row = grid.splice(y, 1)[0].fill(0);
            grid.unshift(row);
            ++y;
            clearedCount++;
        }
        if (clearedCount > 0) {
            const lineScores = [0, 40, 100, 300, 1200]; // Standard Tetris scoring
            stateRef.current.lines += clearedCount;
            // Points based on level
            stateRef.current.score += lineScores[clearedCount] * stateRef.current.level;

            // Update difficulty and speed logic
            // User requested: "speed of the block should get increased after every 100 points"
            // And "game should become difficult as the user crosses 500 points" (which implies simpler behavior before?)
            // We'll combine this: 
            // Base speed is 1000ms. 
            // Effective Level = floor(Score / 100) + 1. 
            // Speed = max(100, 1000 - (EffectiveLevel - 1) * 100)

            const effectiveLevel = Math.floor(stateRef.current.score / 100) + 1;
            stateRef.current.level = effectiveLevel;

            // Speed logic: decrease interval by 100ms every level, min 100ms
            const newInterval = Math.max(100, 1000 - (effectiveLevel - 1) * 50);
            // Made it 50ms per 100 points to result in better curve. 
            // At 500 points -> Level 6 -> 1000 - 250 = 750ms.
            // At 1000 points -> Level 11 -> 500ms.

            stateRef.current.dropInterval = newInterval;

            setLines(stateRef.current.lines);
            setScore(stateRef.current.score);
            setLevel(stateRef.current.level);
        }
    };

    useEffect(() => {
        // Hide navbar when game is active
        const navbar = document.querySelector('nav');
        if (navbar) {
            (navbar as HTMLElement).style.display = 'none';
        }

        return () => {
            // Restore navbar when game closes
            if (navbar) {
                (navbar as HTMLElement).style.display = 'block';
            }
        };
    }, []);

    useEffect(() => {
        // Keyboard controls
        const handleKeyDown = (event: KeyboardEvent) => {
            if (stateRef.current.gameOver) return;

            if (event.code === 'ArrowLeft') {
                playerMove(-1);
            } else if (event.code === 'ArrowRight') {
                playerMove(1);
            } else if (event.code === 'ArrowDown') {
                playerDrop();
            } else if (event.code === 'ArrowUp') {
                playerRotate(1);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        // Prevent default scrolling for arrows
        const handleKeys = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        };
        window.addEventListener("keydown", handleKeys, false);
        return () => window.removeEventListener("keydown", handleKeys);
    }, []);


    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvasContainerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const initGame = () => {
            if (container) {
                const rect = container.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;

                const bs = 30; // Dense / High Resolution
                layoutRef.current.blockSize = bs;

                // Use floor to ensure grid fits entirely within canvas
                const cols = Math.floor(canvas.width / bs);
                const rows = Math.floor(canvas.height / bs);

                stateRef.current.grid = createMatrix(cols, rows);

                // Reset State
                stateRef.current.score = 0;
                stateRef.current.lines = 0;
                stateRef.current.level = 1;
                stateRef.current.gameOver = false;
                stateRef.current.dropInterval = 1000;

                setScore(0);
                setLines(0);
                setLevel(1);
                setGameOver(false);

                playerReset();
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            initGame();
        });
        resizeObserver.observe(container);

        initGame();

        const update = (time = 0) => {
            if (stateRef.current.gameOver) return;

            const deltaTime = time - stateRef.current.lastTime;
            stateRef.current.lastTime = time;

            stateRef.current.dropCounter += deltaTime;
            if (stateRef.current.dropCounter > stateRef.current.dropInterval) {
                playerDrop();
            }

            // Draw
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bs = layoutRef.current.blockSize;
            const grid = stateRef.current.grid;

            // Grid check before draw
            if (!grid || !grid[0]) {
                requestRef.current = requestAnimationFrame(update);
                return;
            }

            const drawCell = (x: number, y: number, val: number) => {
                const cx = x * bs;
                const cy = y * bs;
                ctx.fillStyle = COLORS[val] || '#fff';
                ctx.fillRect(cx, cy, bs, bs);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.strokeRect(cx, cy, bs, bs);
            };

            grid.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) drawCell(x, y, value);
                });
            });

            if (stateRef.current.activePiece) {
                stateRef.current.activePiece.matrix.forEach((row: number[], y: number) => {
                    row.forEach((value: number, x: number) => {
                        if (value !== 0) {
                            drawCell(
                                x + stateRef.current.activePiece.pos.x,
                                y + stateRef.current.activePiece.pos.y,
                                value
                            );
                            resetTrigger
                        }
                    });
                });
            }

            requestRef.current = requestAnimationFrame(update);
        };

        update();

        return () => {
            resizeObserver.disconnect();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const panelStyle = "bg-black/80 backdrop-blur-md border border-green-500/20 rounded-xl p-6 shadow-[0_0_15px_rgba(34,197,94,0.1)] h-full flex flex-col";

    return (
        <div className={`fixed inset-0 z-50 bg-black/90 flex items-center justify-center ${geistMono.variable} ${pixelify.variable} font-sans`}>
            <div className="absolute top-6 right-6 z-[200] flex gap-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="text-green-500 hover:text-green-300 transition-colors bg-black/40 p-2 h-fit hover:bg-green-900/40 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                        title="Back to Menu"
                    >
                        <ChevronLeft size={22} />
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="text-green-500 hover:text-green-300 transition-colors bg-black/40 p-2 h-fit hover:bg-green-900/40 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    title="Close Game"
                >
                    <X size={22} />
                </button>
            </div>

            <section className="w-full max-w-7xl h-[85vh] p-4 flex flex-col lg:flex-row gap-4 relative z-10">

                {/* 1. LEFT PANE - STATUS - DESKTOP ONLY*/}
                <div className={`w-full lg:w-[25%] hidden lg:flex flex-col gap-6 z-10 ${panelStyle}`}>
                    <div>
                        <div className="flex items-center gap-3 border-b border-green-500/20 pb-4 mb-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                            <h2 className="text-green-500 font-mono tracking-widest text-sm font-bold">SYSTEM_STATUS</h2>
                        </div>

                        <div className="space-y-4 font-mono text-sm px-2">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>SCORE</span>
                                <span className="text-green-400 font-bold text-xl">{score.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>LEVEL</span>
                                <span className="text-emerald-400 font-bold text-xl">{level}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>LINES</span>
                                <span className="text-emerald-400 font-bold text-xl">{lines}</span>
                            </div>
                            <div className="w-full h-[1px] bg-green-500/20 my-2"></div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Next Sequence</span>
                                <NextPiecePreview typeId={nextPieceType} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto text-xs text-gray-500 font-mono">
                        <p>CONTROLS:</p>
                        <p>← → : MOVE</p>
                        <p>↑ : ROTATE</p>
                        <p>↓ : SOFT DROP</p>
                    </div>
                </div>

                {/* 2. CENTER PANE - GAME - MOBILE AND DESKTOP*/}
                <div className="relative w-full lg:w-[50%] h-full z-10 flex flex-col items-center justify-center flex-1">
                    {/* Mobile Stats Header */}
                    <div className="flex lg:hidden w-full justify-between items-center bg-black/50 p-2 rounded-t-xl border-x border-t border-green-500/30 text-green-400 font-mono text-xs mb-1">
                        <div>SCORE: <span className="text-white">{score}</span></div>
                        <div>LEVEL: <span className="text-white">{level}</span></div>
                    </div>

                    <div ref={canvasContainerRef} className="relative w-full h-full lg:h-full flex-1 rounded-2xl border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] overflow-hidden bg-black/90">
                        <canvas ref={canvasRef} className="block w-full h-full" />

                        {gameOver && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm gap-12">
                                <h2 className="text-5xl text-green-500 font-pixelify">GAME OVER</h2>
                                <p className="text-gray-300 font-mono">FINAL SCORE: {score}</p>
                                <div className="flex flex-col text-sm gap-4">
                                    <button
                                        onClick={() => setResetTrigger(prev => prev + 1)}
                                        className="px-8 py-3 bg-green-600 text-white rounded font-bold hover:bg-green-500 transition-colors"
                                    >
                                        PLAY AGAIN
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-green-800 text-white rounded font-bold hover:bg-green-700 transition-colors"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="grid lg:hidden grid-cols-4 gap-2 w-full mt-4 h-20 shrink-0">
                        <button
                            className="bg-green-900/40 border border-green-500/50 rounded-xl flex items-center justify-center active:bg-green-500/40 transition-colors touch-manipulation"
                            onClick={() => playerMove(-1)}
                        >
                            <ArrowLeft className="text-green-400 w-8 h-8" />
                        </button>
                        <button
                            className="bg-green-900/40 border border-green-500/50 rounded-xl flex items-center justify-center active:bg-green-500/40 transition-colors touch-manipulation"
                            onClick={() => playerDrop()}
                        >
                            <ArrowDown className="text-green-400 w-8 h-8" />
                        </button>
                        <button
                            className="bg-green-900/40 border border-green-500/50 rounded-xl flex items-center justify-center active:bg-green-500/40 transition-colors touch-manipulation"
                            onClick={() => playerMove(1)}
                        >
                            <ArrowRight className="text-green-400 w-8 h-8" />
                        </button>
                        <button
                            className="bg-green-900/40 border border-green-500/50 rounded-xl flex items-center justify-center active:bg-green-500/40 transition-colors touch-manipulation"
                            onClick={() => playerRotate(1)}
                        >
                            <RotateCw className="text-green-400 w-8 h-8" />
                        </button>
                    </div>
                </div>

                {/* 3. RIGHT PANE - - DESKTOP ONLY - Dummy/Decor or High Scores in future */}
                <div className={`w-full lg:w-[25%] hidden lg:flex flex-col justify-start gap-4 z-10 ${panelStyle}`}>
                    <div className="flex items-center gap-3 border-b border-green-500/20 pb-4 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                        <h2 className="text-emerald-500 font-mono tracking-widest text-sm font-bold">GAME_LOGS</h2>
                    </div>
                    <div className="font-mono text-xs text-gray-400 space-y-2 overflow-y-auto">
                        <p> System initialized...</p>
                        <p> Grid loaded.</p>
                        <p> Player connected.</p>
                        {score > 500 && <p className="text-yellow-500"> WARNING: Difficulty increasing...</p>}
                        {score > 1000 && <p className="text-red-500"> CRITICAL: Maximum velocity approaching.</p>}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TetrisGame;