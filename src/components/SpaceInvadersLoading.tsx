import { useState, useEffect, useRef } from 'react';
import PixelTransition from './PixelTransition';

interface SpaceInvadersLoadingProps {
    onLoadingComplete?: () => void;
    onTransitionChange: (active: boolean) => void;
}

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

const SpaceInvadersLoading: React.FC<SpaceInvadersLoadingProps> = ({ onLoadingComplete, onTransitionChange }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showYouWon, setShowYouWon] = useState(false);
    const [started, setStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const gameRef = useRef<{ cleanup: () => void } | null>(null);
    const skipLoadingRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const isNarrow = dimensions.width < 768;
    const marginX = isNarrow ? 40 : 100;
    const marginY = isNarrow ? 90 : 100;
    const gameW = dimensions.width - 2 * marginX;
    const gameH = dimensions.height - 2 * marginY;

    /**
     * ==========================================
     * PHASE 1: INSERT COIN HANDLER
     * ==========================================
     * Triggered when the user clicks the "INSERT COIN" button.
     * Uses the PixelTransition component to mask the switch
     * from React UI to Canvas-based gameplay.
     */
    const handleStart = () => {
        // --- TRANSITION WIPE #1: From Insert Coin -> Loading Bar ---
        // USER REQUESTED: make wipe 1 false
        onTransitionChange(false);

        // Even if wipe is false, we still need to delay the start 
        // to keep the flow consistent, or start immediately if preferred.
        // Keeping a small delay for state transition.
        setTimeout(() => {
            setStarted(true);
            setIsLoading(true);
        }, 100);
    };

    useEffect(() => {
        if (!started) return;

        const handleResize = () => {
            if (gameRef.current) {
                gameRef.current.cleanup();
            }
            initGame();
        };

        window.addEventListener('resize', handleResize);
        initGame();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (gameRef.current) {
                gameRef.current.cleanup();
            }
        };
    }, [started]);

    const initGame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;


        ctx.imageSmoothingEnabled = false;

        const logo = new Image();
        logo.src = '/herologo.png';

        let currentCleanup = () => { };

        /**
         * ==========================================
         * PHASE 3: BOSS BATTLE (GAME LOGIC)
         * ==========================================
         * This is the final interactive segment where the user 
         * fights the boss. It includes collision detection,
         * sprite rendering, and UI elements.
         */
        const runLevel = () => {
            let animationId: number;


            // Responsive speed adjustment
            const isNarrow = canvas.width < 768;
            const speedMultiplier = isNarrow ? 0.6 : 1;
            const sizeMultiplier = isNarrow ? 0.8 : 1;
            const marginX = isNarrow ? 40 : 100;
            const marginY = isNarrow ? 90 : 100;
            let score = 0;

            const player: Player = {
                x: canvas.width / 2 - 16,
                y: canvas.height - 48 - marginY,
                width: 32 * sizeMultiplier,
                height: 32 * sizeMultiplier,
                speed: 4 * speedMultiplier,
                dx: 0
            };

            const bullets: Bullet[] = [];
            const enemyBullets: Bullet[] = [];
            const particles: Particle[] = [];
            const explosions: Explosion[] = [];
            let bossDefeated = false;
            let youWonTimer = 0;
            let holdTimer = 0;

            const boss: Boss = {
                x: canvas.width / 2 - (80 * sizeMultiplier),
                y: 50 + marginY,
                width: 160 * sizeMultiplier,
                height: 72 * sizeMultiplier,
                health: 3,
                maxHealth: 3,
                dx: 2.5 * speedMultiplier,
                dy: 0.5 * speedMultiplier,
                shootTimer: 0,
                frame: 0
            };

            const stars: Star[] = [];
            for (let i = 0; i < 50; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() < 0.5 ? 2 : 3,
                    speed: Math.random() * 0.5 + 0.1
                });
            }

            const shootInterval = setInterval(() => {
                if (!bossDefeated && !spawning && holdTimer >= 60) {
                    bullets.push({
                        x: player.x + player.width / 2 - 2,
                        y: player.y,
                        width: 4,
                        height: 12,
                        speed: 6 * speedMultiplier
                    });
                }
            }, 200);

            const bossShoot = () => {
                if (boss.health <= 0) return;

                boss.shootTimer++;
                if (boss.shootTimer > 50) {
                    boss.shootTimer = 0;

                    for (let i = -1; i <= 1; i++) {
                        enemyBullets.push({
                            x: boss.x + boss.width / 2 - 2 + i * 20,
                            y: boss.y + boss.height,
                            width: 4,
                            height: 12,
                            speed: 3 * speedMultiplier,
                            dx: i * 0.3 * speedMultiplier
                        });
                    }
                }
            };

            const createParticles = (x: number, y: number, color: string, count: number = 12) => {
                for (let i = 0; i < count; i++) {
                    particles.push({
                        x,
                        y,
                        vx: (Math.random() - 0.5) * 4 * speedMultiplier,
                        vy: (Math.random() - 0.5) * 4 * speedMultiplier,
                        life: 30,
                        color,
                        size: Math.random() * 3 + 2
                    });
                }
            };

            const createExplosion = (x: number, y: number, size: number = 32) => {
                explosions.push({
                    x: x - size / 2,
                    y: y - size / 2,
                    size,
                    frame: 0,
                    maxFrames: 12
                });
            };



            const updateAI = () => {
                if (bossDefeated) {
                    player.dx = 0;
                    return;
                }

                const targetX = boss.x + boss.width / 2 - player.width / 2;
                if (Math.abs(player.x - targetX) > 5) {
                    player.dx = player.x < targetX ? player.speed : -player.speed;
                } else {
                    player.dx = 0;
                }

                for (let eb of enemyBullets) {
                    if (eb.y > player.y - 80 &&
                        eb.x > player.x - 20 &&
                        eb.x < player.x + player.width + 20) {
                        player.dx = eb.x < player.x ? player.speed : -player.speed;
                    }
                }
            };

            const update = () => {
                if (spawning) {
                    let allComplete = true;
                    [...playerSpawnPixels, ...bossSpawnPixels].forEach(p => {
                        if (p.delay > 0) {
                            p.delay--;
                            allComplete = false;
                            p.alpha += 0.2; // Faster transition to match 0.1s
                            if (p.alpha < 1) allComplete = false;
                        }
                    });

                    if (allComplete) {
                        spawning = false;
                    }
                    return; // Pause game during spawning
                }

                if (holdTimer < 60) {
                    holdTimer++;
                    return;
                }

                if (bossDefeated) {
                    youWonTimer++;

                    if (youWonTimer === 1) {
                        setShowYouWon(true);
                    }

                    if (youWonTimer === 420) {
                        // --- TRANSITION WIPE #3: From Game Win -> Main App ---
                        // Making it exactly like Wipe 2: Trigger transition, wait for coverage, then exit.
                        onTransitionChange(true);
                    }

                    if (youWonTimer === 510) { // ~1.5s later at 60fps
                        if (onLoadingComplete) {
                            onLoadingComplete();
                            setIsLoading(false);
                            skipLoadingRef.current = null;
                        }
                    }
                    return;
                }

                updateAI();

                player.x += player.dx;
                player.x = Math.max(marginX, Math.min(canvas.width - player.width - marginX, player.x));

                bullets.forEach((b, i) => {
                    b.y -= b.speed;
                    if (b.y < -20) bullets.splice(i, 1);
                });

                enemyBullets.forEach((b, i) => {
                    b.y += b.speed;
                    if (b.dx) b.x += b.dx;
                    if (b.y > canvas.height + 20) enemyBullets.splice(i, 1);
                });

                bossShoot();

                boss.x += boss.dx;
                const padding = canvas.width * 0.25;
                if (boss.x <= padding || boss.x + boss.width >= canvas.width - padding) {
                    boss.dx *= -1;
                }
                boss.frame = (boss.frame + 0.05) % 2;

                bullets.forEach((b, bi) => {
                    if (boss.health > 0 &&
                        b.x < boss.x + boss.width &&
                        b.x + b.width > boss.x &&
                        b.y < boss.y + boss.height &&
                        b.y + b.height > boss.y) {
                        boss.health--;
                        score += 150;
                        bullets.splice(bi, 1);
                        createParticles(b.x, b.y, '#0f0', 10);

                        if (boss.health <= 0) {
                            score += 5000;
                            createExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, 96);
                            createParticles(boss.x + boss.width / 2, boss.y + boss.height / 2, '#0f0', 40);
                            bossDefeated = true;
                        }
                    }
                });

                particles.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1;
                    p.life--;
                    if (p.life <= 0) particles.splice(i, 1);
                });

                explosions.forEach((e, i) => {
                    e.frame += 0.5;
                    if (e.frame >= e.maxFrames) explosions.splice(i, 1);
                });
            };

            const drawPixelSprite = (x: number, y: number, color: string, pattern: number[][], pixelSize: number = 4) => {
                ctx.fillStyle = '#00E701';
                ctx.shadowBlur = 6;
                ctx.shadowColor = '#00E701';

                for (let py = 0; py < pattern.length; py++) {
                    for (let px = 0; px < pattern[py].length; px++) {
                        if (pattern[py][px]) {
                            ctx.fillRect(
                                x + px * pixelSize,
                                y + py * pixelSize,
                                pixelSize,
                                pixelSize
                            );
                        }
                    }
                }
                ctx.shadowBlur = 0;
            };

            interface SpawnPixel {
                x: number;
                y: number;
                color: string;
                size: number;
                delay: number;
                alpha: number;
            }

            let spawning = true;
            let playerSpawnPixels: SpawnPixel[] = [];
            let bossSpawnPixels: SpawnPixel[] = [];

            const initSpawnPixels = (
                x: number,
                y: number,
                pattern: number[][],
                pixelSize: number,
                color: string,
                targetArray: SpawnPixel[]
            ) => {
                const tempPixels: SpawnPixel[] = [];

                for (let py = 0; py < pattern.length; py++) {
                    for (let px = 0; px < pattern[py].length; px++) {
                        if (pattern[py][px]) {
                            tempPixels.push({
                                x: x + px * pixelSize,
                                y: y + py * pixelSize,
                                color: color,
                                size: pixelSize,
                                delay: 0,
                                alpha: 0
                            });
                        }
                    }
                }

                // Shuffle pixels to create random spawn order
                for (let i = tempPixels.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [tempPixels[i], tempPixels[j]] = [tempPixels[j], tempPixels[i]];
                }

                // Assign delays based on shuffled index
                tempPixels.forEach((p, i) => {
                    p.delay = i * 0.5; // Staggered delay
                    targetArray.push(p);
                });
            };

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

            // Initialize spawn pixels
            initSpawnPixels(player.x, player.y, playerPattern, 4, '#0f0', playerSpawnPixels);
            initSpawnPixels(boss.x, boss.y, bossPattern, 8, '#0f0', bossSpawnPixels);

            const drawSpawningSprite = (pixels: SpawnPixel[]) => {
                ctx.shadowBlur = 6;
                ctx.shadowColor = '#00E701';
                pixels.forEach(p => {
                    if (p.alpha > 0) {
                        ctx.fillStyle = '#00E701';
                        ctx.globalAlpha = p.alpha;
                        ctx.fillRect(p.x, p.y, p.size, p.size);
                    }
                });
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            };

            const drawPlayer = () => {
                if (spawning) {
                    drawSpawningSprite(playerSpawnPixels);
                } else {
                    drawPixelSprite(player.x, player.y, '#0f0', playerPattern, 4);
                }
            };

            const drawBoss = () => {
                if (boss.health <= 0) return;

                if (spawning) {
                    drawSpawningSprite(bossSpawnPixels);
                } else {
                    drawPixelSprite(boss.x, boss.y, '#0f0', bossPattern, 8);
                }

                if (!spawning) {
                    const barWidth = boss.width;
                    const barHeight = 8;
                    const barX = boss.x;
                    const barY = boss.y - 16;

                    ctx.fillStyle = '#222';
                    ctx.fillRect(barX, barY, barWidth, barHeight);

                    ctx.fillStyle = '#00E701';
                    const healthWidth = (boss.health / boss.maxHealth) * barWidth;
                    ctx.fillRect(barX, barY, healthWidth, barHeight);

                    ctx.strokeStyle = '#00E701';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(barX, barY, barWidth, barHeight);
                }
            };

            const drawBullets = () => {
                ctx.fillStyle = '#0f0';
                bullets.forEach(b => {
                    ctx.fillRect(b.x, b.y, b.width, b.height);
                    ctx.fillRect(b.x - 1, b.y + 2, b.width + 2, b.height - 4);
                });

                ctx.fillStyle = '#f00';
                enemyBullets.forEach(b => {
                    ctx.fillRect(b.x, b.y, b.width, b.height);
                    ctx.fillRect(b.x - 1, b.y + 2, b.width + 2, b.height - 4);
                });
            };

            const drawParticles = () => {
                particles.forEach(p => {
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life / 30;
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                });
                ctx.globalAlpha = 1;
            };

            const drawExplosions = () => {
                explosions.forEach(e => {
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
            };



            const draw = () => {
                // Clear background
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Define Game Area
                const gameW = canvas.width - 2 * marginX;
                const gameH = canvas.height - 2 * marginY;

                // --- Game Area Clipping ---
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(marginX, marginY, gameW, gameH, 20);
                } else {
                    ctx.rect(marginX, marginY, gameW, gameH);
                }
                ctx.clip();

                // Draw Black BG for game
                ctx.fillStyle = '#000';
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(marginX, marginY, gameW, gameH, 20);
                    ctx.fill();
                } else {
                    ctx.fillRect(marginX, marginY, gameW, gameH);
                }

                ctx.fillStyle = '#0f0';
                stars.forEach(star => {
                    ctx.fillRect(star.x, star.y, star.size, star.size);
                    star.y += star.speed;
                    if (star.y > canvas.height - marginY) {
                        star.y = marginY;
                        star.x = Math.random() * gameW + marginX;
                    }
                });

                drawBoss();
                drawPlayer();
                drawBullets();
                drawExplosions();
                drawParticles();



                ctx.restore();
                // --- End Clipping ---

                // --- UI Text ---
                // UI Text Settings
                ctx.fillStyle = '#22c55e';
                ctx.font = isNarrow ? '14px "Press Start 2P"' : '20px "Press Start 2P"';
                ctx.shadowColor = '#22c55e';
                ctx.shadowBlur = 5;

                if (!bossDefeated) {
                    ctx.textAlign = 'center';
                    ctx.fillText('BOSS BATTLE', canvas.width / 2, marginY / 2 + 10);
                }

                // Blinking Effect for UI
                const blinkAlpha = 0.7 + 0.3 * Math.sin(Date.now() / 200);
                const originalShadowBlur = ctx.shadowBlur;

                // Score Counter
                ctx.globalAlpha = blinkAlpha;
                ctx.textAlign = 'left';
                ctx.fillText(`SCORE`, 20, 40);
                ctx.fillText(`${score.toString().padStart(6, '0')}`, 20, 70);

                // Health/Lives System (Mockup)
                ctx.textAlign = 'right';
                ctx.fillText(`LIVES`, canvas.width - 20, 40);
                ctx.fillText('♥ ♥ ♥', canvas.width - 20, 70);

                // Bottom Logo Area
                const logoY = canvas.height - 30;
                const logoH = isNarrow ? 35 : 70; // Increased size as requested

                if (logo.complete && logo.naturalWidth > 0) {
                    const drawH = logoH;
                    const aspectRatio = logo.naturalWidth / logo.naturalHeight;
                    const drawW = drawH * aspectRatio;
                    ctx.drawImage(logo, canvas.width / 2 - drawW / 2, logoY - (isNarrow ? 25 : 50), drawW, drawH);
                } else {
                    ctx.textAlign = 'center';
                    ctx.font = isNarrow ? '14px "Press Start 2P"' : '24px "Press Start 2P"';
                    ctx.fillText('BINARY DEFENSE', canvas.width / 2, logoY - 10);
                }

                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = originalShadowBlur;
                ctx.font = '12px Helvetica, Arial, sans-serif';
                ctx.fillStyle = '#15803d';
                ctx.shadowBlur = 0;


            };

            const gameLoop = () => {
                update();
                draw();
                animationId = requestAnimationFrame(gameLoop);
            };

            const skip = () => {
                cancelAnimationFrame(animationId);
                clearInterval(shootInterval);
                onTransitionChange(true);
                setTimeout(() => {
                    if (onLoadingComplete) onLoadingComplete();
                    setIsLoading(false);
                }, 1500);
                skipLoadingRef.current = null;
            };
            skipLoadingRef.current = skip;

            gameLoop();

            currentCleanup = () => {
                cancelAnimationFrame(animationId);
                clearInterval(shootInterval);
            };
        };

        /**
         * ==========================================
         * PHASE 2: LOADING BAR ANIMATION
         * ==========================================
         * This section handles the retro loading bar animation.
         * It simulates progress with randomized increments and 
         * hex-code readouts before transitioning to the game.
         */
        const runLoading = () => {
            let progress = 0;
            let loadingAnimId: number;
            let engagingTimer = 0;

            const skip = () => {
                cancelAnimationFrame(loadingAnimId);
                onTransitionChange(true);
                setTimeout(() => {
                    if (onLoadingComplete) onLoadingComplete();
                    setIsLoading(false);
                }, 1500);
                skipLoadingRef.current = null;
            };
            skipLoadingRef.current = skip;

            // Immediately clear transition once loading starts (if coming from start screen)
            setTimeout(() => onTransitionChange(false), 300);



            const animateLoading = () => {
                const width = canvas.width;
                const height = canvas.height;
                const isNarrow = width < 768;
                const marginX = isNarrow ? 40 : 100;
                const marginY = isNarrow ? 90 : 100;
                const gameW = width - 2 * marginX;
                const gameH = height - 2 * marginY;

                // Update Progress
                if (progress < 100) {
                    if (Math.random() < 0.1) progress += Math.random() * 5;
                    progress += 0.05;
                    if (progress > 100) progress = 100;
                } else {
                    engagingTimer++;
                    if (engagingTimer === 1) {
                        // --- TRANSITION WIPE #2: From Loading Bar -> Boss Battle ---
                        onTransitionChange(true);
                    }

                    if (engagingTimer === 90) { // Wait for solid coverage (~1.5s)
                        cancelAnimationFrame(loadingAnimId);
                        runLevel();
                        // Reveal the game
                        setTimeout(() => onTransitionChange(false), 300);
                        return;
                    }
                }

                // Clear entire screen
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, width, height);

                // --- Loading Area Clipped Content ---
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(marginX, marginY, gameW, gameH, 20);
                } else {
                    ctx.rect(marginX, marginY, gameW, gameH);
                }
                ctx.clip();

                // Draw Black BG for loading area
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, width, height);

                // Draw grid
                ctx.strokeStyle = '#003300';
                ctx.lineWidth = 1;
                for (let i = 0; i < width; i += 40) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, height);
                    ctx.stroke();
                }
                for (let i = 0; i < height; i += 40) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(width, i);
                    ctx.stroke();
                }

                // Draw loading text
                ctx.fillStyle = '#0f0';
                ctx.font = isNarrow ? '8px "Press Start 2P"' : '16px "Press Start 2P"';
                ctx.textAlign = 'center';
                const loadingText = progress >= 100 ? 'ENGAGING IN ACTION' : 'INITIALIZING DEFENSE SYSTEMS...';
                ctx.fillText(loadingText, width / 2, height / 2 - 50);

                // Draw bar container
                ctx.strokeStyle = '#0f0';
                // Draw bar container
                const barWidth = isNarrow ? 200 : 304;
                const barHeight = isNarrow ? 24 : 34;
                const barHalfW = barWidth / 2;
                const barY = height / 2 - 2;

                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 4;
                ctx.strokeRect(width / 2 - barHalfW, barY, barWidth, barHeight);

                // Draw bar fill pixels
                // 100% / 5 = 20 blocks total
                // Desktop: 304px width approx -> 15px per block (20 * 15 = 300)
                // Mobile: 200px width approx -> 10px per block (20 * 10 = 200)
                const blockSpacing = isNarrow ? 10 : 15;
                const blockW = isNarrow ? 7 : 11;
                const blockH = isNarrow ? 16 : 26;
                const startX = width / 2 - barHalfW + 4; // 4px padding
                const startY = barY + 4;

                const blocks = Math.floor(progress / 5);
                ctx.fillStyle = '#0f0';
                for (let i = 0; i < blocks; i++) {
                    ctx.fillRect(startX + i * blockSpacing, startY, blockW, blockH);
                }

                // Draw hex codes
                ctx.font = isNarrow ? '10px Helvetica, Arial, sans-serif' : '12px Helvetica, Arial, sans-serif';
                ctx.fillStyle = '#0a0';
                const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
                ctx.fillText(`LOADING MODULE: 0x${hex}`, width / 2, height / 2 + 60);

                // --- Bezel Reveal --- 
                ctx.restore();



                loadingAnimId = requestAnimationFrame(animateLoading);
            };

            animateLoading();
            currentCleanup = () => cancelAnimationFrame(loadingAnimId);
        };


        runLoading();

        gameRef.current = {
            cleanup: () => currentCleanup()
        };
    };

    return (
        <div className="fixed inset-0 bg-black overflow-hidden font-press-start">
            {!started && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black space-y-8 p-4">
                    {/* 
                      PHASE 1 UI: THE INSERT COIN SCREEN 
                      This is a React-based overlay that precedes the canvas game.
                    */}
                    <img
                        src="/herologo.png"
                        alt="BINARY DEFENSE"
                        className="w-3/4 sm:w-2/3 max-w-lg h-auto drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"
                    />
                    <button
                        onClick={handleStart}
                        className="relative px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 rounded-full border-2 sm:border-4 border-green-500 text-green-500 text-sm sm:text-lg md:text-xl font-press-start tracking-[0.2em] uppercase bg-black shadow-[0_0_20px_rgba(34,197,94,0.6),inset_0_0_10px_rgba(34,197,94,0.4)] hover:bg-green-500 hover:text-black hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] transition-all duration-300 active:scale-95 group whitespace-nowrap"
                    >
                        <span className="relative z-10 animate-pulse">INSERT COIN</span>
                        <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md" />
                    </button>
                    <div className="mt-16 flex flex-col items-center space-y-4 opacity-80 select-none group cursor-default">
                        <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-green-900 to-transparent transition-all duration-700 group-hover:w-80 group-hover:via-green-500" />
                        <div className="relative">
                            <p className="text-green-500 text-[15px] tracking-[0.15em] font-sans opacity-60 transition-all duration-300 group-hover:text-green-400 group-hover:opacity-100 group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                                BINARY_v2_HACKATHON.exe --init 2k26
                            </p>
                            <div className="absolute -inset-x-12 -inset-y-6 bg-green-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-green-900 to-transparent transition-all duration-700 group-hover:w-80 group-hover:via-green-500" />
                    </div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="block"
                style={{ imageRendering: 'pixelated', opacity: started ? 1 : 0 }}
            />

            {isLoading && (
                <button
                    onClick={() => skipLoadingRef.current?.()}
                    className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 z-[110] px-4 py-2 sm:px-6 sm:py-2 border-2 border-green-500 rounded-lg text-green-500 text-[8px] sm:text-[10px] font-press-start hover:bg-green-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.4)] active:scale-95"
                >
                    SKIP
                </button>
            )}

            {showYouWon && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-green-400 font-sans animate-pulse text-center tracking-tighter">
                        YOU WON!
                    </h1>
                </div>
            )}
            {/* 
              ARCADE BEZEL OVERLAY
              This is a DOM-based bezel that sits on top of everything inside the loading screen.
              By moving it to the DOM and giving it a higher z-index, Wipe 2 will appear 
              to happen UNDER the frame.
            */}
            {started && (
                <div
                    className="pointer-events-none absolute border-[#22c55e] border-opacity-80 rounded-[20px] shadow-[0_0_30px_rgba(34,197,94,0.5),inset_0_0_20px_rgba(34,197,94,0.3)] z-[100]"
                    style={{
                        top: marginY,
                        left: marginX,
                        width: gameW,
                        height: gameH,
                        borderWidth: '4px'
                    }}
                />
            )}

            {/* CRT Overlay */}
            <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)]" />

                {/* Scanlines */}
                <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />
            </div>

            <style>{`
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
        </div>
    );
};

export default SpaceInvadersLoading;