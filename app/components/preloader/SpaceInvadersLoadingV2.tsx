import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

interface SpaceInvadersLoadingV2Props {
    onLoadingComplete?: () => void;
    onTransitionChange: (active: boolean) => void;
}

// --- INTERFACES FROM SpaceInvadersLoading.tsx ---
interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    dx: number;
}

interface Bullet {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    dx?: number;
    isEnemy: boolean; // Added to distinguish source
}

interface Boss {
    x: number;
    y: number;
    width: number;
    height: number;
    health: number;
    maxHealth: number;
    dx: number;
    dy: number;
    shootTimer: number;
    frame: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

interface Explosion {
    x: number;
    y: number;
    size: number;
    frame: number;
    maxFrames: number;
}

interface Star {
    x: number;
    y: number;
    size: number;
    speed: number;
}

interface SpawnPixel {
    x: number;
    y: number;
    color: string;
    size: number;
    delay: number;
    alpha: number;
}

const SpaceInvadersLoadingV2: React.FC<SpaceInvadersLoadingV2Props> = ({ onLoadingComplete, onTransitionChange }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // STATES: 'insert_coin' -> 'bezel_forming' -> 'entrance' -> 'battle' -> 'complete'
    const [phase, setPhase] = useState<'insert_coin' | 'bezel_forming' | 'entrance' | 'battle' | 'complete'>('insert_coin');
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Game State Ref (Mutable for high-performance loop)
    const gameStateRef = useRef({
        player: { x: 0, y: 0, width: 32, height: 32, speed: 4, dx: 0 } as Player,
        boss: {
            x: 0, y: 0, width: 160, height: 72,
            health: 10, maxHealth: 10,
            dx: 2.5, dy: 0.5, shootTimer: 0, frame: 0
        } as Boss,
        bullets: [] as Bullet[],
        particles: [] as Particle[],
        explosions: [] as Explosion[],
        stars: [] as Star[],
        frameCount: 0,
        playerSpawnPixels: [] as SpawnPixel[],
        bossSpawnPixels: [] as SpawnPixel[],
        spawning: false
    });

    const animationRef = useRef<number | null>(null);

    // --- PATTERNS ---
    const playerPattern = [
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 1]
    ];

    const bossPattern = [
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0]
    ];

    useEffect(() => {
        const updateDimensions = () => {
            // We use window dimensions for full screen canvas, or constrained to container
            // For V2 matching V1, we often want full screen but the "game" is inside the container
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setDimensions({ width: clientWidth, height: clientHeight });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('resize', updateDimensions);
            document.body.style.overflow = 'auto';
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // --- GAME LOOP ---
    useEffect(() => {
        if (phase === 'insert_coin') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set Canvas Size
        canvas.width = dimensions.width || 800; // Default or container width
        canvas.height = dimensions.height || 600;

        const state = gameStateRef.current;

        // --- INITIALIZATION ---
        if (state.frameCount === 0) {
            // Stars
            state.stars = Array.from({ length: 50 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() < 0.5 ? 2 : 3,
                speed: Math.random() * 0.5 + 0.1
            }));

            // Initial Positions for Entrance
            // Player starts below screen
            state.player.width = 32;
            state.player.height = 32;
            state.player.x = canvas.width / 2 - state.player.width / 2;
            state.player.y = canvas.height + 50;

            // Boss starts above screen
            state.boss.width = 160;
            state.boss.height = 72;
            state.boss.x = canvas.width / 2 - state.boss.width / 2;
            state.boss.y = -150;
        }

        // --- DRAW HELPERS ---
        const drawPixelSprite = (x: number, y: number, color: string, pattern: number[][], pixelSize: number = 4) => {
            ctx.fillStyle = color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = color;
            for (let py = 0; py < pattern.length; py++) {
                for (let px = 0; px < pattern[py].length; px++) {
                    if (pattern[py][px]) {
                        ctx.fillRect(x + px * pixelSize, y + py * pixelSize, pixelSize, pixelSize);
                    }
                }
            }
            ctx.shadowBlur = 0;
        };

        const createParticles = (x: number, y: number, color: string, count: number = 12) => {
            for (let i = 0; i < count; i++) {
                state.particles.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 30,
                    color,
                    size: Math.random() * 3 + 2
                });
            }
        };

        const createExplosion = (x: number, y: number, size: number = 32) => {
            state.explosions.push({
                x: x - size / 2,
                y: y - size / 2,
                size,
                frame: 0,
                maxFrames: 12
            });
        };

        const loop = () => {
            // Clear
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Stars
            ctx.fillStyle = '#0f0';
            state.stars.forEach(star => {
                ctx.globalAlpha = 0.3 + Math.random() * 0.5;
                ctx.fillRect(star.x, star.y, star.size, star.size);
                ctx.globalAlpha = 1.0;
                star.y += star.speed;
                if (star.y > canvas.height) star.y = 0;
            });

            const targetPlayerY = canvas.height - 80;
            const targetBossY = 40;

            // --- PHASE LOGIC ---
            if (phase === 'entrance') {
                // Animate to positions
                let inPosition = true;

                // Player Rise
                if (state.player.y > targetPlayerY) {
                    state.player.y -= 2;
                    inPosition = false;
                }

                // Boss Descend
                if (state.boss.y < targetBossY) {
                    state.boss.y += 2;
                    inPosition = false;
                }

                if (inPosition) {
                    setPhase('battle');
                }
            }
            else if (phase === 'battle') {
                // === BATTLE LOGIC FROM Loading.tsx ===

                // Player Auto Movement
                // Try to align with Boss center, but Dodge bullets logic could be added
                // Simple hover/follow behavior
                // Target X is center of boss relative to center of player
                const targetX = state.boss.x + state.boss.width / 2 - state.player.width / 2;

                // Simple AI: Move towards boss center
                if (Math.abs(state.player.x - targetX) > 5) {
                    state.player.dx = state.player.x < targetX ? state.player.speed : -state.player.speed;
                } else {
                    state.player.dx = 0;
                }

                // Clamp Player
                const marginX = 20;
                state.player.x += state.player.dx;
                state.player.x = Math.max(marginX, Math.min(canvas.width - state.player.width - marginX, state.player.x));

                // Boss Movement
                state.boss.x += state.boss.dx;
                const padding = canvas.width * 0.1;
                if (state.boss.x <= padding || state.boss.x + state.boss.width >= canvas.width - padding) {
                    state.boss.dx *= -1;
                }
                state.boss.frame = (state.boss.frame + 0.05) % 2;

                // Fire Bullets (Player Auto-fire)
                if (state.frameCount % 15 === 0) { // Fast fire
                    state.bullets.push({
                        x: state.player.x + state.player.width / 2 - 2,
                        y: state.player.y,
                        width: 4,
                        height: 12,
                        speed: 8,
                        isEnemy: false
                    });
                }

                // Boss Shoot
                state.boss.shootTimer++;
                if (state.boss.shootTimer > 50) {
                    state.boss.shootTimer = 0;
                    // Triple Shot
                    for (let i = -1; i <= 1; i++) {
                        state.bullets.push({
                            x: state.boss.x + state.boss.width / 2 - 2 + i * 20,
                            y: state.boss.y + state.boss.height,
                            width: 4,
                            height: 12,
                            speed: 4,
                            dx: i * 0.5,
                            isEnemy: true
                        });
                    }
                }
            }

            // --- UPDATES ---

            // Update Bullets
            for (let i = state.bullets.length - 1; i >= 0; i--) {
                const b = state.bullets[i];
                if (b.isEnemy) {
                    b.y += b.speed;
                    if (b.dx) b.x += b.dx;
                } else {
                    b.y -= b.speed;
                }

                // Handle Collisions
                if (phase === 'battle') {
                    // Player Bullet Hitting Boss
                    if (!b.isEnemy && state.boss.health > 0 &&
                        b.x > state.boss.x && b.x < state.boss.x + state.boss.width &&
                        b.y > state.boss.y && b.y < state.boss.y + state.boss.height) {

                        state.bullets.splice(i, 1);
                        state.boss.health -= 0.5; // Damage
                        createParticles(b.x, b.y, '#0f0', 5);

                        if (state.boss.health <= 0) {
                            createExplosion(state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, 96);
                            createParticles(state.boss.x + state.boss.width / 2, state.boss.y + state.boss.height / 2, '#0f0', 40);
                            setPhase('complete');
                        }
                        continue;
                    }

                    // Boss Bullet Hitting Player (Optional - invincible in intro?)
                    // Let's make player invincible for the preloader to ensure it finishes
                }

                // Offscreen
                if (b.y < -20 || b.y > canvas.height + 20) state.bullets.splice(i, 1);
            }

            // Update Particles
            for (let i = state.particles.length - 1; i >= 0; i--) {
                const p = state.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1; // Gravity
                p.life--;
                if (p.life <= 0) state.particles.splice(i, 1);
            }

            // Update Explosions
            for (let i = state.explosions.length - 1; i >= 0; i--) {
                const e = state.explosions[i];
                e.frame += 0.5;
                if (e.frame >= e.maxFrames) state.explosions.splice(i, 1);
            }


            // --- DRAWING ---

            // Draw Boss/Player
            if (state.boss.health > 0 || phase === 'entrance') {
                drawPixelSprite(state.boss.x, state.boss.y, '#0f0', bossPattern, 8);

                // Health Bar
                if (phase === 'battle') { // Only show in battle
                    const barWidth = state.boss.width;
                    const barHeight = 8;
                    const barX = state.boss.x;
                    const barY = state.boss.y - 16;
                    ctx.fillStyle = '#222';
                    ctx.fillRect(barX, barY, barWidth, barHeight);
                    ctx.fillStyle = '#0f0';
                    ctx.fillRect(barX, barY, (state.boss.health / state.boss.maxHealth) * barWidth, barHeight);
                    ctx.strokeStyle = '#0f0';
                    ctx.strokeRect(barX, barY, barWidth, barHeight);
                }
            }
            drawPixelSprite(state.player.x, state.player.y, '#0f0', playerPattern, 4);

            // Draw Bullets
            state.bullets.forEach(b => {
                ctx.fillStyle = b.isEnemy ? '#f00' : '#0f0';
                ctx.fillRect(b.x, b.y, b.width, b.height);
            });

            // Draw Particles
            state.particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 30;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            ctx.globalAlpha = 1;

            // Draw Explosions
            state.explosions.forEach(e => {
                const progress = e.frame / e.maxFrames;
                const size = e.size * (1 + progress * 0.5);
                const alpha = 1 - progress;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#0f0';
                ctx.fillRect(e.x - size / 4, e.y - size / 4, size / 2, size / 2);
                ctx.fillStyle = '#0a0';
                ctx.fillRect(e.x, e.y, size / 4, size / 4);
            });
            ctx.globalAlpha = 1;

            state.frameCount++;
            animationRef.current = requestAnimationFrame(loop);
        };

        animationRef.current = requestAnimationFrame(loop);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [phase, dimensions]);

    // --- PHASE TRANSITIONS ---
    useEffect(() => {
        if (phase === 'complete') {
            setTimeout(() => {
                onTransitionChange(true); // Pixel Wipe
                setTimeout(() => {
                    if (onLoadingComplete) onLoadingComplete();
                }, 1000);
            }, 1000);
        }
    }, [phase, onTransitionChange, onLoadingComplete]);

    const handleInsertCoin = () => {
        setPhase('bezel_forming');
    };

    return (
        <motion.div
            ref={containerRef}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
        >
            {/* 1. INSERT COIN OVERLAY */}
            <AnimatePresence>
                {phase === 'insert_coin' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                        className="absolute z-50 flex flex-col items-center justify-center gap-12 w-full max-w-4xl px-4"
                    >
                        {/* 1. LOGO */}
                        <div className="relative">
                            <motion.img
                                src="/herologo.png"
                                alt="BINARY"
                                className="w-[300px] md:w-[500px] h-auto object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                                animate={{
                                    filter: ['brightness(1) drop-shadow(0 0 15px rgba(34,197,94,0.6))', 'brightness(1.2) drop-shadow(0 0 25px rgba(34,197,94,0.8))', 'brightness(1) drop-shadow(0 0 15px rgba(34,197,94,0.6))']
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>

                        {/* 2. INSERT COIN BUTTON */}
                        <motion.button
                            onClick={handleInsertCoin}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-12 py-4 rounded-full border-2 border-green-500 bg-black/50 backdrop-blur-sm
                                       text-green-500 font-bold text-xl tracking-[0.2em] font-mono
                                       shadow-[0_0_20px_rgba(34,197,94,0.4),inset_0_0_10px_rgba(34,197,94,0.2)]
                                       hover:bg-green-500/10 hover:shadow-[0_0_40px_rgba(34,197,94,0.6),inset_0_0_20px_rgba(34,197,94,0.4)]
                                       transition-all duration-300"
                        >
                            <span className="relative z-10">INSERT COIN</span>
                        </motion.button>

                        {/* 3. FOOTER TEXT */}
                        <div className="absolute bottom-[-150px] md:bottom-[-200px] flex flex-col items-center gap-2 opacity-60">
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-green-900 to-transparent" />
                            <p className="text-green-700 font-mono text-xs md:text-sm tracking-widest text-center">
                                BINARY_v2_HACKATHON.exe --init 2k26
                            </p>
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-green-900 to-transparent" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. BEZEL FORMATION ANIMATION (Transition Logic) */}
            {phase === 'bezel_forming' && (
                <div className="absolute inset-0 z-40 flex items-center justify-center p-4 lg:p-8 pointer-events-none">
                    <div className="relative w-full max-w-[1000px] aspect-[4/3] md:aspect-[16/9] lg:h-[600px]">
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            <motion.rect
                                width="100%"
                                height="100%"
                                rx="20"
                                stroke="#22c55e"
                                strokeWidth="4"
                                fill="transparent"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                                onAnimationComplete={() => {
                                    setPhase('entrance');
                                }}
                            />
                        </svg>
                    </div>
                </div>
            )}

            {/* 3. GAME INTERFACE (Visible during Entrance/Battle/Complete) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== 'insert_coin' && phase !== 'bezel_forming' ? 1 : 0 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 lg:p-8"
            >
                {/* HEADER */}
                <div className="w-full max-w-[1000px] flex justify-between items-end mb-2 px-2 pixel-font text-green-500 uppercase tracking-widest text-shadow-glow">
                    <div className="text-left">
                        <p className="text-xs opacity-70 mb-1">SCORE</p>
                        <p className="text-xl md:text-2xl">000000</p>
                    </div>
                    <div className="text-center pb-2">
                        <h2 className="text-xl md:text-3xl font-bold animate-pulse">BOSS BATTLE</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-70 mb-1">LIVES</p>
                        <div className="flex gap-1 text-xl md:text-2xl">
                            <span>♥</span><span>♥</span><span>♥</span>
                        </div>
                    </div>
                </div>

                {/* GAME SCREEN (BEZEL + CANVAS) */}
                <div className="relative w-full max-w-[1000px] aspect-[4/3] md:aspect-[16/9] lg:h-[600px] border-4 border-green-500 rounded-[20px] shadow-[0_0_30px_rgba(34,197,94,0.4),inset_0_0_20px_rgba(34,197,94,0.2)] overflow-hidden bg-black/90">
                    <canvas ref={canvasRef} className="block w-full h-full" style={{ imageRendering: 'pixelated' }} />

                    {/* CRT Overlays inside the screen */}
                    <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-20" />
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)]" />
                </div>

                {/* FOOTER */}
                <div className="w-full max-w-[1000px] flex justify-between items-center mt-4 px-2">
                    {/* Placeholder for Left Balance */}
                    <div className="w-[150px] hidden md:block"></div>

                    {/* Footer Logo */}
                    <div className="flex flex-col items-center opacity-80">
                        <img src="/herologo.png" alt="Binary" className="h-8 md:h-10 object-contain drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2 md:gap-4 w-[150px] justify-end">
                        <button className="px-3 py-1 border border-green-500 rounded text-green-500 text-[10px] md:text-xs pixel-font hover:bg-green-500 hover:text-black transition-colors">PLAY</button>
                        <button className="px-3 py-1 border border-green-500 rounded text-green-500 text-[10px] md:text-xs pixel-font hover:bg-green-500 hover:text-black transition-colors">AUTO</button>
                        <button
                            onClick={() => onTransitionChange(true)}
                            className="px-3 py-1 border border-green-500 rounded text-green-500 text-[10px] md:text-xs pixel-font hover:bg-green-500 hover:text-black transition-colors"
                        >
                            SKIP
                        </button>
                    </div>
                </div>
            </motion.div>


            <style>{`
                .pixel-font {
                    font-family: 'Press Start 2P', monospace;
                }
                .text-shadow-glow {
                    text-shadow: 0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.4);
                }
                .crt-scanlines {
                    background: linear-gradient(
                        to bottom,
                        rgba(18, 16, 16, 0) 50%,
                        rgba(0, 0, 0, 0.25) 50%,
                        rgba(0, 0, 0, 0.25)
                    );
                    background-size: 100% 4px;
                }
            `}</style>
        </motion.div>
    );
};

export default SpaceInvadersLoadingV2;
