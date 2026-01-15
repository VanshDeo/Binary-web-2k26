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
        const BLOCK_SIZE = 30;
        const STEP_DELAY = 100;

        const COLORS = [
            null,
            '#22c55e', '#16a34a', '#15803d', '#4ade80',
            '#86efac', '#059669', '#10b981',
        ];

        // Standard Tetris shapes
        const SHAPES = [
            [],
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
        // activePiece -> activePieces array
        let activePieces: { matrix: number[][], pos: { x: number, y: number }, id: number }[] = [];
        let pieceIdCounter = 0;
        let lastTime = 0;
        let dropCounter = 0;

        const createMatrix = (w: number, h: number) =>
            Array.from({ length: h }, () => new Array(w).fill(0));

        // Collide function must check grid AND other pieces (optional, for now just grid to keep it simple, 
        // effectively treating other pieces as ghost until they land. 
        // But for visual correctness, user said "connect with each other". 
        // If they overlap mid-air, it's weird. 
        // Simplest: Check ONLY against grid. If they overlap mid-air, they overlap.
        // It's a background, chaos is okay. But they must land on grid.
        const collide = (arena: number[][], player: { matrix: number[][], pos: { x: number, y: number } }) => {
            const [m, o] = [player.matrix, player.pos];
            for (let y = 0; y < m.length; ++y) {
                for (let x = 0; x < m[y].length; ++x) {
                    if (m[y][x] !== 0 &&
                        (arena[y + o.y] === undefined || arena[y + o.y][x + o.x] !== 0)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const merge = (arena: number[][], player: { matrix: number[][], pos: { x: number, y: number } }) => {
            player.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0 && arena[y + player.pos.y]) {
                        arena[y + player.pos.y][x + player.pos.x] = value;
                    }
                });
            });
        };

        const rotate = (matrix: number[][]) => {
            return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
        };

        // --- Bot Logic ---
        const cloneGrid = (gridToClone: number[][]) => gridToClone.map(row => [...row]);

        const evaluateGrid = (arena: number[][]) => {
            let lines = 0;
            let holes = 0;
            let aggregateHeight = 0;
            let bumpiness = 0;
            const heights = new Array(arena[0].length).fill(0);

            // Check lines
            for (let y = 0; y < arena.length; y++) {
                if (arena[y].every(val => val !== 0)) lines++;
            }

            // Calculate column heights and holes
            for (let x = 0; x < arena[0].length; x++) {
                let colHeight = 0;
                let blockFound = false;
                for (let y = 0; y < arena.length; y++) {
                    if (arena[y][x] !== 0) {
                        if (!blockFound) {
                            colHeight = arena.length - y;
                            blockFound = true;
                        }
                    } else if (blockFound) {
                        holes++;
                    }
                }
                heights[x] = colHeight;
                aggregateHeight += colHeight;
            }

            for (let x = 0; x < heights.length - 1; x++) {
                bumpiness += Math.abs(heights[x] - heights[x + 1]);
            }

            return (lines * 1000) - (aggregateHeight * 5) - (holes * 50) - (bumpiness * 20);
        };

        // Modified getBestMove to accept a search range (minX, maxX)
        // enabling us to force distribution across sectors
        const getBestMove = (pieceType: number, minX: number, maxX: number) => {
            let bestScore = -Infinity;
            let bestX = minX;
            let bestRotation = 0;

            let currentPiece = SHAPES[pieceType];

            for (let r = 0; r < 4; r++) {
                // Ensure x is within bounds
                // range: minX to maxX (exclusive of maxX usually, but let's be inclusive)
                for (let x = minX; x < maxX; x++) {
                    // Boundary check: x + width <= cols
                    const width = currentPiece[0].length; // approximate
                    if (x + width > cols) continue;
                    if (x < 0) continue;

                    const testPiece = { matrix: currentPiece, pos: { x, y: 0 } };

                    if (collide(grid, testPiece)) continue;

                    const simPiece = { matrix: currentPiece, pos: { x, y: 0 } };
                    while (!collide(grid, simPiece)) {
                        simPiece.pos.y++;
                    }
                    simPiece.pos.y--;

                    const simGrid = cloneGrid(grid);
                    merge(simGrid, simPiece);

                    // Add some randomness to score to prevent identical stacking if scores are equal
                    const score = evaluateGrid(simGrid) + Math.random() * 5;
                    if (score > bestScore) {
                        bestScore = score;
                        bestX = x;
                        bestRotation = r;
                    }
                }
                currentPiece = rotate(currentPiece);
            }
            return { x: bestX, rotation: bestRotation };
        };
        // --- End Bot Logic ---

        const resize = () => {
            const parent = canvas.parentElement;
            canvas.width = parent?.clientWidth || window.innerWidth;
            canvas.height = parent?.clientHeight || window.innerHeight;
            cols = Math.ceil(canvas.width / BLOCK_SIZE);
            rows = Math.ceil(canvas.height / BLOCK_SIZE) - 2;
            grid = createMatrix(cols, rows);
            activePieces = [];
        };

        const drawMatrix = (matrix: number[][], offset: { x: number, y: number }) => {
            matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        ctx.fillStyle = COLORS[value] || '#fff';
                        ctx.fillRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        ctx.strokeStyle = '#000';
                        ctx.strokeRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    }
                });
            });
        };

        const update = (time = 0) => {
            const dt = time - lastTime;
            lastTime = time;
            dropCounter += dt;

            // Target number of simultaneous falling pieces based on width
            // e.g. 1 piece every 10 columns
            const targetPieces = Math.max(3, Math.floor(cols / 8));

            if (dropCounter > STEP_DELAY) {
                // Update existing pieces
                // Iterate backwards to allow removal
                for (let i = activePieces.length - 1; i >= 0; i--) {
                    const p = activePieces[i];
                    p.pos.y++;
                    if (collide(grid, p)) {
                        p.pos.y--;
                        merge(grid, p);
                        activePieces.splice(i, 1);

                        // Check lines only after merge
                        outer: for (let y = grid.length - 1; y >= 0; --y) {
                            for (let x = 0; x < grid[y].length; ++x) if (grid[y][x] === 0) continue outer;
                            grid.splice(y, 1);
                            grid.unshift(new Array(cols).fill(0));
                            ++y;
                        }
                    }
                }

                // Spawn new pieces if needed
                if (activePieces.length < targetPieces) {
                    // Try to spawn a piece in a random sector
                    const sectorSize = Math.floor(cols / targetPieces);
                    // Pick a random sector that doesn't have a piece (loosely)
                    // Or just pick ANY random sector and finding best move there
                    const attemptSector = Math.floor(Math.random() * targetPieces);
                    const minX = attemptSector * sectorSize;
                    const maxX = Math.min((attemptSector + 1) * sectorSize + 2, cols); // overlap slightly

                    const type = Math.floor(Math.random() * 7) + 1;
                    const { x, rotation } = getBestMove(type, minX, maxX);

                    let pieceMatrix = SHAPES[type];
                    for (let r = 0; r < rotation; r++) pieceMatrix = rotate(pieceMatrix);

                    const newPiece = { matrix: pieceMatrix, pos: { x: x, y: 0 }, id: pieceIdCounter++ };

                    // Simple collision check at spawn
                    if (!collide(grid, newPiece)) {
                        // Also check if overlapping with other active pieces - optional but nice
                        // For now skip to allow distinct pieces
                        activePieces.push(newPiece);
                    } else {
                        // Game Over condition / Grid full near top
                        // Just clear grid to restart "game"
                        // But since we have multiple pieces, maybe just don't spawn
                        // If grid is VERY full, clear it
                        // Check top row
                        if (grid[0].some(v => v !== 0) || grid[1].some(v => v !== 0)) {
                            grid.forEach(row => row.fill(0));
                            activePieces = [];
                        }
                    }
                }

                dropCounter = 0;
            }

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawMatrix(grid, { x: 0, y: 0 });
            activePieces.forEach(p => drawMatrix(p.matrix, p.pos));

            animationFrameId = requestAnimationFrame(update);
        };

        window.addEventListener('resize', resize);
        resize();
        update();
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 -z-10 opacity-40 bg-black pointer-events-none" />;
};

export default TetrisBackground;