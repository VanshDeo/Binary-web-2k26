"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Pixelify_Sans, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import Image from 'next/image';
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
    [[0, 1, 0], [1, 1, 1]], // T
    [[2, 2], [2, 2]],       // O
    [[0, 3, 3], [3, 3, 0]], // S
    [[4, 4, 0], [0, 4, 4]], // Z
    [[0, 0, 5], [5, 5, 5]], // L
    [[6, 0, 0], [6, 6, 6]], // J
    [[0, 0, 0, 0], [7, 7, 7, 7], [0, 0, 0, 0]], // I
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
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
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

const rotate = (matrix: number[][], times: number = 1) => {
    let result = matrix;
    for (let t = 0; t < times; t++) {
        result = result[0].map((_, index) => result.map(row => row[index]).reverse());
    }
    return result;
};

// IMPROVED AI HEURISTICS (Pierre Dellacherie inspired weights)
const evaluateGrid = (arena: number[][]) => {
    let holes = 0;
    let aggregateHeight = 0;
    let lines = 0;
    let bumpiness = 0;

    const rows = arena.length;
    const cols = arena[0].length;
    const colHeights = new Array(cols).fill(0);

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (arena[y][x] !== 0) {
                colHeights[x] = rows - y;
                break;
            }
        }
        aggregateHeight += colHeights[x];
    }

    for (let x = 0; x < cols; x++) {
        let blockFound = false;
        for (let y = 0; y < rows; y++) {
            if (arena[y][x] !== 0) blockFound = true;
            else if (blockFound && arena[y][x] === 0) holes++;
        }
    }

    for (let y = 0; y < rows; y++) {
        let isLine = true;
        for (let x = 0; x < cols; x++) {
            if (arena[y][x] === 0) { isLine = false; break; }
        }
        if (isLine) lines++;
    }

    for (let x = 0; x < cols - 1; x++) {
        bumpiness += Math.abs(colHeights[x] - colHeights[x + 1]);
    }

    // Heuristic Weights:
    // Aggregate Height: -0.5
    // Lines: +0.76 (Keeping positive reward for clears)
    // Holes: -0.36 -> -10 (Holes are very bad)
    // Bumpiness: -0.18 -> -2 (Bumpiness makes it hard to clear)

    // Adjusted for smarter play:
    return (-aggregateHeight * 0.5) + (lines * 0.8) - (holes * 10.0) - (bumpiness * 2.0);
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

const TetrisInterface = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    // UI State
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [nextPieceType, setNextPieceType] = useState<number>(0);

    const stateRef = useRef({
        grid: [] as number[][],
        activePiece: null as any,
        nextPieceType: 0,
        dropCounter: 0,
        lastTime: 0,
        score: 0,
        lines: 0,
        level: 1,
        placedCount: 0, // Track moves for LL-RR pattern
    });

    const layoutRef = useRef({
        blockSize: 30
    });

    useEffect(() => {
        if (stateRef.current.nextPieceType === 0) {
            stateRef.current.nextPieceType = (PIECES.length * Math.random() | 0) || 1;
            setNextPieceType(stateRef.current.nextPieceType);
        }

        const canvas = canvasRef.current;
        const container = canvasContainerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        const STEP_DELAY = 50;

        const initGame = () => {
            if (container) {
                const rect = container.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;

                const bs = 30; // Dense / High Resolution
                layoutRef.current.blockSize = bs;

                const cols = Math.ceil(canvas.width / bs);
                const rows = Math.ceil(canvas.height / bs);

                stateRef.current.grid = createMatrix(cols, rows);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            initGame();
        });
        resizeObserver.observe(container);

        initGame();

        // --- GAME LOGIC ---
        const findBestMove = (pieceMatrix: number[][], grid: number[][], startCol: number, endCol: number) => {
            let bestScore = -Infinity;
            let candidateMoves: { x: number, rotation: number }[] = [];

            const cols = grid[0].length;

            for (let r = 0; r < 4; r++) {
                const rotatedMatrix = rotate(pieceMatrix, r);
                const pWidth = rotatedMatrix[0].length;

                // Constrain search to specific columns
                const minX = Math.max(-1, startCol - pWidth + 1); // Allow piece to start slightly left of startCol
                const maxX = Math.min(cols - pWidth + 1, endCol); // Allow piece to end at endCol

                for (let x = minX; x < maxX; x++) {
                    let y = 0;
                    const testPlayer = { matrix: rotatedMatrix, pos: { x, y } };

                    if (collide(grid, testPlayer)) continue;

                    // Drop piece
                    while (!collide(grid, testPlayer)) { testPlayer.pos.y++; }
                    testPlayer.pos.y--;

                    if (testPlayer.pos.y < 0) continue;

                    // Simulate
                    const simGrid = grid.map(row => [...row]);
                    let valid = true;
                    testPlayer.matrix.forEach((row, ry) => {
                        row.forEach((val, rx) => {
                            if (val !== 0) {
                                if (simGrid[ry + testPlayer.pos.y] && simGrid[ry + testPlayer.pos.y] !== undefined)
                                    simGrid[ry + testPlayer.pos.y][rx + testPlayer.pos.x] = val;
                                else valid = false;
                            }
                        });
                    });
                    if (!valid) continue;

                    const score = evaluateGrid(simGrid);
                    if (score > bestScore + 0.001) {
                        bestScore = score;
                        candidateMoves = [{ x, rotation: r }];
                    } else if (Math.abs(score - bestScore) < 0.001) {
                        candidateMoves.push({ x, rotation: r });
                    }
                }
            }
            if (candidateMoves.length > 0) {
                return candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
            }
            // Fallback (search globally if constrained search failed)
            if (endCol - startCol < cols) {
                return findBestMove(pieceMatrix, grid, 0, cols);
            }
            return { x: Math.floor((startCol + endCol) / 2), rotation: 0 };
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
                const lineScores = [0, 100, 300, 500, 800];
                stateRef.current.lines += clearedCount;
                stateRef.current.score += (lineScores[clearedCount] || 100 * clearedCount) * stateRef.current.level;

                setLines(stateRef.current.lines);
                setScore(stateRef.current.score);

                const newLevel = Math.floor(stateRef.current.lines / 10) + 1;
                if (newLevel !== stateRef.current.level) {
                    stateRef.current.level = newLevel;
                    setLevel(newLevel);
                }
            }
        };

        const resetGame = () => {
            stateRef.current.grid.forEach(row => row.fill(0));
            stateRef.current.score = 0;
            stateRef.current.lines = 0;
            stateRef.current.level = 1;
            stateRef.current.placedCount = 0;
            setScore(0);
            setLines(0);
            setLevel(1);
        };

        const update = (time = 0) => {
            const deltaTime = time - stateRef.current.lastTime;
            stateRef.current.lastTime = time;
            stateRef.current.dropCounter += deltaTime;

            const grid = stateRef.current.grid;
            if (!grid || grid.length === 0) {
                requestAnimationFrame(update);
                return;
            }

            const cols = grid[0].length;

            if (stateRef.current.dropCounter > STEP_DELAY) {
                if (!stateRef.current.activePiece) {
                    const typeId = stateRef.current.nextPieceType;
                    const pieceMatrix = PIECES[typeId];

                    // Spawn Logic: Determine Left/Right visual spawn bias
                    // BUT allow AI to move anywhere (Global Search)
                    const phase = stateRef.current.placedCount % 4;
                    const isLeft = phase < 2;
                    const midCol = Math.floor(cols / 2);

                    // Visual Spawn Zone
                    const spawnStart = isLeft ? 0 : midCol;
                    const spawnEnd = isLeft ? midCol : cols;
                    const zoneWidth = spawnEnd - spawnStart;
                    const spawnX = spawnStart + Math.floor((zoneWidth - pieceMatrix[0].length) / 2);

                    stateRef.current.activePiece = {
                        matrix: pieceMatrix,
                        pos: { x: spawnX, y: 0 },
                        type: typeId
                    };

                    stateRef.current.nextPieceType = (PIECES.length * Math.random() | 0) || 1;
                    setNextPieceType(stateRef.current.nextPieceType);

                    if (collide(grid, stateRef.current.activePiece)) {
                        resetGame();
                    } else {
                        // UNCONSTRAINED DECISION:
                        // AI searches 0 to cols (Full Board) for the absolute best spot.
                        // It helps solve the game faster/cleaner.
                        const targetMove = findBestMove(pieceMatrix, grid, 0, cols);
                        if (targetMove) {
                            stateRef.current.activePiece.matrix = rotate(pieceMatrix, targetMove.rotation);
                            stateRef.current.activePiece.pos.x = targetMove.x;
                        }
                    }
                } else {
                    stateRef.current.activePiece.pos.y++;
                    if (collide(grid, stateRef.current.activePiece)) {
                        stateRef.current.activePiece.pos.y--;
                        merge(grid, stateRef.current.activePiece);
                        stateRef.current.activePiece = null;
                        stateRef.current.placedCount++; // Increment move count
                        arenaSweep();
                    }
                }
                stateRef.current.dropCounter = 0;
            }

            // Draw
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bs = layoutRef.current.blockSize;

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
                        }
                    });
                });
            }

            animationFrameId = requestAnimationFrame(update);
        };

        update();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const panelStyle = "bg-black/50 backdrop-blur-md border border-green-500/20 rounded-xl p-6 shadow-[0_0_15px_rgba(34,197,94,0.1)] h-full flex flex-col";

    return (
        <section id="hero-tetris" className={`w-full h-screen pt-20 pb-4 px-4 md:px-8 flex flex-col justify-center relative ${geistMono.variable} ${pixelify.variable} overflow-hidden`}>

            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)] pointer-events-none" />

            {/* HERO CONTENT CONTAINER */}
            <div className="w-full max-w-[1920px] mx-auto h-full flex flex-col lg:flex-row gap-4 relative z-10">

                {/* 1. LEFT PANE - SYSTEM STATUS & ACTIONS */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`w-full lg:w-[25%] hidden lg:flex flex-col gap-6 z-10 ${panelStyle} overflow-y-auto no-scrollbar`}
                >
                    {/* SECTION 1: STATUS */}
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
                            <div className="w-full h-[1px] bg-green-500/20 my-2"></div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Next Sequence</span>
                                <NextPiecePreview typeId={nextPieceType} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: ACCESS BUTTONS (MOVED HERE) */}
                    <div className="mt-4 pt-4 border-t border-green-500/20">
                        <div className="flex flex-col gap-4 w-full px-2">
                            {/* REGISTER - FILLED STYLE */}
                            <Link
                                href="https://binaryvtwo.devfolio.co/"
                                target="_blank"
                                className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green-950/40 to-green-700/40 text-lg font-bold text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-green-950 hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] border border-green-500/30"
                            >
                                <span className="relative z-10 font-pixelify tracking-wider">Register</span>
                                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>

                            {/* DISCORD - OUTLINE STYLE */}
                            <Link
                                href="http://discord.gg/yKcMYeMMe8"
                                target="_blank"
                                className="group flex h-12 w-full items-center justify-center rounded-xl border-2 border-green-500/50 bg-transparent text-lg text-white shadow-[0_0_10px_rgba(34,197,94,0.1)] transition-all duration-300 hover:scale-105 hover:bg-green-950/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:border-green-400"
                            >
                                <span className="mr-2 group-hover:rotate-12 transition-transform duration-300">
                                    <svg className="h-5 w-5 fill-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 16">
                                        <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                                    </svg>
                                </span>
                                <span className="font-pixelify tracking-wider">Discord</span>
                            </Link>

                            {/* ARCHIVE - GHOST STYLE */}
                            <Link
                                href="#"
                                className="group flex h-12 w-full items-center justify-center rounded-xl border border-teal-500/30 bg-transparent text-md text-teal-400/80 transition-all duration-300 hover:scale-105 hover:bg-teal-950/20 hover:border-teal-400/60 hover:text-teal-300"
                            >
                                <span className="font-pixelify tracking-widest">ARCHIVE</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* 2. CENTER PANE - GAME */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full lg:w-[50%] h-full z-10 flex items-center justify-center flex-1"
                >
                    <div ref={canvasContainerRef} className="relative w-full h-full rounded-2xl border-2 border-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.05)] overflow-hidden bg-black/40 backdrop-blur-sm">
                        <canvas ref={canvasRef} className="block w-full h-full opacity-60 mix-blend-screen" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-10">
                            <div className="relative w-full max-w-[400px] flex items-center justify-center">
                                <Image
                                    src="/herologo.png"
                                    alt="Binary Logo"
                                    width={500}
                                    height={500}
                                    className="object-contain drop-shadow-[0_0_20px_rgba(34,197,94,0.4)] opacity-90 animate-pulse"
                                />
                            </div>

                            <p className="mt-4 text-green-500 font-mono tracking-[0.5em] text-xs md:text-sm uppercase bg-black/50 px-6 py-2 rounded-full border border-green-500/30 backdrop-blur-md z-20">
                                Hackathon 2k26
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 3. RIGHT PANE - NAVIGATION (ACCESS CONTROLS) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`w-full lg:w-[25%] hidden lg:flex flex-col justify-start gap-4 z-10 ${panelStyle} overflow-y-auto no-scrollbar`}
                >
                    <div className="flex items-center gap-3 border-b border-green-500/20 pb-4 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                        <h2 className="text-emerald-500 font-mono tracking-widest text-sm font-bold">ACCESS_CONTROLS</h2>
                    </div>

                    <nav className="flex flex-col gap-2 w-full px-2">
                        {[
                            { name: 'ABOUT', href: '/#about' },
                            { name: 'TIMELINE', href: '/#timeline' },
                            { name: 'TRACKS', href: '/#tracks' },
                            { name: 'GALLERY', href: '/#gallery' },
                            { name: 'MENTORS', href: '/#mentors' },
                            { name: 'SPONSORS', href: '/#sponsors' },
                            { name: 'COMMUNITY', href: '/#community-partners' },
                            { name: 'FAQS', href: '/#faqs' },
                        ].map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-green-500/30 hover:bg-green-900/20 transition-all duration-300"
                            >
                                <span className="text-gray-400 font-mono text-lg tracking-wider group-hover:text-green-400 transition-colors">
                                    {`> ${item.name}`}
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 text-green-500 text-sm transition-opacity">
                                    [DIR]
                                </span>
                            </Link>
                        ))}
                    </nav>
                </motion.div>

                {/* MOBILE ONLY ACTIONS */}
                <div className="lg:hidden w-full flex gap-2">
                    <Link href="https://binaryvtwo.devfolio.co/" target="_blank" className="flex-1 bg-green-900/40 border border-green-500/30 p-3 rounded text-center text-green-400 font-pixelify">Register</Link>
                    <Link href="http://discord.gg/yKcMYeMMe8" target="_blank" className="flex-1 bg-emerald-900/40 border border-emerald-500/30 p-3 rounded text-center text-emerald-400 font-pixelify">Discord</Link>
                </div>

            </div>
        </section>
    );
};

export default TetrisInterface;
