"use client";

import React, { useEffect, useRef } from 'react';

const TetrisBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // --- CONFIG ---
        const BLOCK_SIZE = 30; // Scale of blocks
        const STEP_DELAY = 50; // ms per game step (lower = faster)
        // We want it "fast and continuous".

        // Shades of Green
        // 0: Empty
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

        // Shapes (Standard Tetrominoes)
        const PIECES = [
            [], // Empty
            [[0, 1, 0], [1, 1, 1]], // T
            [[2, 2], [2, 2]],       // O
            [[0, 3, 3], [3, 3, 0]], // S
            [[4, 4, 0], [0, 4, 4]], // Z
            [[0, 0, 5], [5, 5, 5]], // L
            [[6, 0, 0], [6, 6, 6]], // J
            [[0, 0, 0, 0], [7, 7, 7, 7], [0, 0, 0, 0]], // I
        ];

        let grid: number[][] = [];
        let cols = 0;
        let rows = 0;

        // Game State
        let activePiece: {
            matrix: number[][];
            pos: { x: number; y: number };
            type: number;
        } | null = null;

        // Bot State
        let targetMove: { x: number, rotation: number } | null = null;

        let dropCounter = 0;
        let lastTime = 0;

        // --- ENGINE HELPERS ---

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

        const arenaSweep = () => {
            let rowCount = 1;
            outer: for (let y = grid.length - 1; y > 0; --y) {
                for (let x = 0; x < grid[y].length; ++x) {
                    if (grid[y][x] === 0) {
                        continue outer;
                    }
                }
                const row = grid.splice(y, 1)[0].fill(0);
                grid.unshift(row);
                ++y;
                rowCount *= 2;
            }
        };

        // --- BOT LOGIC ---

        // Simple heuristic scoring
        // Lower is better (usually cost function, but here we'll use a score where Higher is better? 
        // Let's use cost: Minimize (Height + Holes + Bumpiness) - (Cleared Lines * reward)
        const evaluateGrid = (arena: number[][]) => {
            let holes = 0;
            let blocked = 0;
            let aggregateHeight = 0;
            let lines = 0;

            // Check lines
            // (Simple approximation: count full rows. But actual engine sweeps them. 
            // We need to simulate the sweep for the score?)
            // For simple AI, just placement quality.

            // Re-calc heights per col
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

            // Holes
            for (let x = 0; x < cols; x++) {
                let blockFound = false;
                for (let y = 0; y < rows; y++) {
                    if (arena[y][x] !== 0) blockFound = true;
                    else if (blockFound && arena[y][x] === 0) holes++;
                }
            }

            // Complete Lines (bonus)
            for (let y = 0; y < rows; y++) {
                let isLine = true;
                for (let x = 0; x < cols; x++) {
                    if (arena[y][x] === 0) { isLine = false; break; }
                }
                if (isLine) lines++;
            }

            // Bumpiness
            let bumpiness = 0;
            for (let x = 0; x < cols - 1; x++) {
                bumpiness += Math.abs(colHeights[x] - colHeights[x + 1]);
            }

            // Weights
            // Minimize Height, Holes, Bumpiness. Maximize Lines.
            // Score = -Height*0.5 - Holes*0.35 - Bumpiness*0.18 + Lines*0.76 (approx standard heuristic)
            return (-aggregateHeight * 0.51) - (holes * 0.36) - (bumpiness * 0.18) + (lines * 0.76);
        };

        const findBestMove = (pieceMatrix: number[][], spawnX: number) => {
            let bestScore = -Infinity;
            let candidateMoves: { x: number, rotation: number }[] = [];

            // Constrain search to "Rain" area (prevent teleporting to global best cluster)
            const SEARCH_RADIUS = 8;
            const minX = Math.max(-2, spawnX - SEARCH_RADIUS);
            const maxX = Math.min(cols + 2, spawnX + SEARCH_RADIUS);

            // Try all 4 rotations
            for (let r = 0; r < 4; r++) {
                const rotatedMatrix = rotate(pieceMatrix, r);

                // Try columns near spawn
                for (let x = minX; x < maxX; x++) {
                    // 1. Check if placement is valid at top (spawn point approx)
                    let y = 0;
                    const testPlayer = { matrix: rotatedMatrix, pos: { x, y } };
                    if (collide(grid, testPlayer)) continue;

                    // Drop it
                    while (!collide(grid, testPlayer)) {
                        testPlayer.pos.y++;
                    }
                    testPlayer.pos.y--; // Back up one step (landed)

                    if (testPlayer.pos.y < 0) continue; // Stack overflow

                    // Simulate Merge
                    const simGrid = grid.map(row => [...row]);

                    // Inline Merge
                    testPlayer.matrix.forEach((row, ry) => {
                        row.forEach((val, rx) => {
                            if (val !== 0) {
                                if (simGrid[ry + testPlayer.pos.y] && simGrid[ry + testPlayer.pos.y] !== undefined)
                                    simGrid[ry + testPlayer.pos.y][rx + testPlayer.pos.x] = val;
                            }
                        });
                    });

                    // Score
                    const score = evaluateGrid(simGrid);

                    // Collect candidates with epsilon for float comparison logic
                    // If strictly better
                    if (score > bestScore + 0.001) {
                        bestScore = score;
                        candidateMoves = [{ x, rotation: r }];
                    }
                    // If roughly equal (tie)
                    else if (score > bestScore - 0.001) {
                        candidateMoves.push({ x, rotation: r });
                    }
                }
            }
            // Pick random best move to avoid simple directional bias
            if (candidateMoves.length > 0) {
                return candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
            }
            // Fallback: If no valid move found in radius, just drop effectively at spawn?
            // Or return spawnX with 0 rotation (it will die if collide)
            return { x: spawnX, rotation: 0 };
        };

        const resetGame = () => {
            grid.forEach(row => row.fill(0));
        };

        // --- DRAWING ---
        const drawMatrix = (matrix: number[][], offset: { x: number, y: number }) => {
            matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        ctx.fillStyle = COLORS[value] || '#fff';
                        ctx.fillRect(
                            (x + offset.x) * BLOCK_SIZE,
                            (y + offset.y) * BLOCK_SIZE,
                            BLOCK_SIZE,
                            BLOCK_SIZE
                        );
                        // Border
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(
                            (x + offset.x) * BLOCK_SIZE,
                            (y + offset.y) * BLOCK_SIZE,
                            BLOCK_SIZE,
                            BLOCK_SIZE
                        );
                    }
                });
            });
        };

        // --- MAIN LOOP ---
        const resize = () => {
            // Fill Parent
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            cols = Math.ceil(canvas.width / BLOCK_SIZE);
            rows = Math.ceil(canvas.height / BLOCK_SIZE);

            grid = createMatrix(cols, rows);
        };

        resize();
        window.addEventListener('resize', resize);

        const update = (time = 0) => {
            const deltaTime = time - lastTime;
            lastTime = time;
            dropCounter += deltaTime;

            if (dropCounter > STEP_DELAY) {
                if (!activePiece) {
                    // Spawn New
                    const typeId = (PIECES.length * Math.random() | 0) || 1; // 1 to 7
                    const pieceMatrix = PIECES[typeId];

                    // Randomized Rain Spawn
                    // Ensure it's within bounds [0, cols-width]
                    const spawnX = Math.floor(Math.random() * (cols - pieceMatrix[0].length));

                    activePiece = {
                        matrix: pieceMatrix,
                        pos: { x: spawnX, y: 0 },
                        type: typeId
                    };

                    // Check Game Over immediately
                    if (collide(grid, activePiece)) {
                        resetGame();
                        // activePiece = null; // Let it spawn next frame? Or retry?
                    } else {
                        // AI DECISION (Local Search)
                        targetMove = findBestMove(pieceMatrix, spawnX);

                        if (targetMove) {
                            activePiece.matrix = rotate(pieceMatrix, targetMove.rotation);
                            activePiece.pos.x = targetMove.x;
                        }
                    }
                } else {
                    // Drop
                    activePiece.pos.y++;
                    if (collide(grid, activePiece)) {
                        activePiece.pos.y--;
                        merge(grid, activePiece);
                        activePiece = null;
                        arenaSweep();
                    }
                }
                dropCounter = 0;
            }

            // Draw
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear

            // Draw Grid
            drawMatrix(grid, { x: 0, y: 0 });

            // Draw Active
            if (activePiece) {
                drawMatrix(activePiece.matrix, activePiece.pos);
            }

            animationFrameId = requestAnimationFrame(update);
        };

        update();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 opacity-40 bg-black"
        />
    );
};

export default TetrisBackground;
