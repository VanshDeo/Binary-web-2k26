
import React, { useState, useEffect, useRef } from 'react';
import { Play, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const SpaceInvadersGame = ({ onClose }: { onClose?: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'autoplay' | 'gameOver' | 'complete'>('menu');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const gameRef = useRef<{ cleanup: () => void; setTouchLeft?: (a: boolean) => void; setTouchRight?: (a: boolean) => void } | null>(null);
    const shootIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        if (gameState === 'playing' || gameState === 'autoplay') {
            initGame();
        }
        return () => {
            if (gameRef.current) {
                gameRef.current.cleanup();
            }
            if (shootIntervalRef.current) {
                clearInterval(shootIntervalRef.current);
            }
        };
    }, [gameState]);

    const initGame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // Set canvas to responsive size
        const updateCanvasSize = () => {
            const isMobile = window.innerWidth < 768;
            // On mobile, use more width percentage, on desktop stick to max 800
            const maxW = isMobile ? window.innerWidth - 32 : 800;
            const maxH = isMobile ? window.innerHeight * 0.6 : 600;

            canvas.width = maxW;
            canvas.height = maxH;
        };
        updateCanvasSize();

        ctx.imageSmoothingEnabled = false;
        const isAutoPlay = gameState === 'autoplay';

        // Responsive multipliers
        const isNarrow = canvas.width < 600;
        const sizeMult = isNarrow ? 0.6 : 1;
        // Separate speeds: Make enemies faster on mobile, but keep player manageable
        const enemySpeedMult = isNarrow ? 1.4 : 1;
        const playerSpeedMult = isNarrow ? 0.75 : 1; // Slightly faster player on mobile for better control

        let animationId: number;
        let gameOver = false;

        interface Entity {
            x: number;
            y: number;
            width: number;
            height: number;
            dx?: number;
            dy?: number;
            speed?: number;
            alive?: boolean;
            type?: number;
            frame?: number;
            health?: number;
            maxHealth?: number;
            shootTimer?: number;
            phase?: number;
        }

        const player: Entity = {
            x: canvas.width / 2 - (16 * sizeMult),
            y: canvas.height - (48 * sizeMult),
            width: 32 * sizeMult,
            height: 32 * sizeMult,
            speed: 4 * playerSpeedMult,
            dx: 0
        };

        const bullets: any[] = [];
        const enemyBullets: any[] = [];
        const enemies: any[] = [];
        const particles: any[] = [];
        const explosions: any[] = [];

        let currentScore = 0;
        let enemySpawnTimer = 0;
        let bossSpawned = false;
        let boss: Entity | null = null;
        let bossDefeated = false;
        let pixelTransition: any[] = [];
        let transitionComplete = false;

        const createEnemies = () => {
            const numEnemies = isNarrow ? 6 : (Math.floor(Math.random() * 12) + 8);
            const enemySize = 32 * sizeMult;

            for (let i = 0; i < numEnemies; i++) {
                enemies.push({
                    x: Math.random() * (canvas.width - enemySize - 48) + 24,
                    y: Math.random() * (canvas.height * 0.3) + 24,
                    width: enemySize,
                    height: enemySize,
                    alive: true,
                    type: Math.floor(Math.random() * 3),
                    dx: (Math.random() - 0.5) * 1.5 * enemySpeedMult,
                    dy: (Math.random() * 0.4 + 0.2) * enemySpeedMult,
                    frame: 0
                });
            }
        };

        createEnemies();

        const spawnBoss = () => {
            boss = {
                x: canvas.width / 2 - (64 * sizeMult),
                y: -128,
                width: 128 * sizeMult,
                height: 96 * sizeMult,
                health: 50,
                maxHealth: 50,
                phase: 0,
                dx: 2 * enemySpeedMult,
                dy: 0.5 * enemySpeedMult,
                shootTimer: 0,
                frame: 0
            };
            bossSpawned = true;
        };

        const keys: { [key: string]: boolean } = {};
        const touchInput = { left: false, right: false };

        const keyDown = (e: KeyboardEvent) => {
            keys[e.key] = true;
        };

        const keyUp = (e: KeyboardEvent) => {
            keys[e.key] = false;
        };

        if (!isAutoPlay) {
            window.addEventListener('keydown', keyDown);
            window.addEventListener('keyup', keyUp);
        }

        shootIntervalRef.current = setInterval(() => {
            if (!bossDefeated) {
                bullets.push({
                    x: player.x + player.width / 2 - 2,
                    y: player.y,
                    width: 4 * sizeMult,
                    height: 12 * sizeMult,
                    speed: 6 * sizeMult // Bullet speed relative to size only
                });
            }
        }, 200);

        const enemyShoot = () => {
            const aliveEnemies = enemies.filter(e => e.alive);
            if (aliveEnemies.length > 0 && Math.random() < 0.015) {
                const enemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                enemyBullets.push({
                    x: enemy.x + enemy.width / 2 - 2,
                    y: enemy.y + enemy.height,
                    width: 4 * sizeMult,
                    height: 12 * sizeMult,
                    speed: 3 * enemySpeedMult
                });
            }
        };

        const bossShoot = () => {
            if (!boss || (boss.health !== undefined && boss.health <= 0)) return;

            if (boss.shootTimer !== undefined) boss.shootTimer++;
            if (boss.shootTimer !== undefined && boss.shootTimer > 40) {
                boss.shootTimer = 0;

                // Triple shot
                for (let i = -1; i <= 1; i++) {
                    enemyBullets.push({
                        x: boss.x + boss.width / 2 - 2 + i * 20,
                        y: boss.y + boss.height,
                        width: 4 * sizeMult,
                        height: 12 * sizeMult,
                        speed: 4 * enemySpeedMult,
                        dx: i * 0.5 * enemySpeedMult
                    });
                }
            }
        };

        const createParticles = (x: number, y: number, color: string, count = 12) => {
            for (let i = 0; i < count; i++) {
                particles.push({
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

        const createExplosion = (x: number, y: number, size = 32) => {
            explosions.push({
                x: x - size / 2,
                y: y - size / 2,
                size,
                frame: 0,
                maxFrames: 12
            });
        };

        const initPixelTransition = () => {
            pixelTransition = [];
            const pixelSize = 8;
            for (let y = 0; y < canvas.height; y += pixelSize) {
                for (let x = 0; x < canvas.width; x += pixelSize) {
                    pixelTransition.push({
                        x,
                        y,
                        size: pixelSize,
                        delay: Math.random() * 60,
                        alpha: 0
                    });
                }
            }
        };

        const spawnNewEnemies = () => {
            if (bossSpawned) return;

            enemySpawnTimer++;
            // Make spawning faster on mobile: 90 frames (~1.5s) vs 150 (~2.5s)
            const spawnThreshold = isNarrow ? 90 : 150;

            if (enemySpawnTimer > spawnThreshold) {
                enemySpawnTimer = 0;
                const numNew = Math.floor(Math.random() * 2) + 1;
                for (let i = 0; i < numNew; i++) {
                    enemies.push({
                        x: Math.random() * (canvas.width - 48) + 24,
                        y: -32,
                        width: 32 * sizeMult,
                        height: 32 * sizeMult,
                        alive: true,
                        type: Math.floor(Math.random() * 3),
                        dx: (Math.random() - 0.5) * 1.5 * enemySpeedMult,
                        dy: (Math.random() * 0.4 + 0.2) * enemySpeedMult,
                        frame: 0
                    });
                }
            }

            // Spawn boss
            const bossThreshold = isAutoPlay ? 500 : 1000;
            if (currentScore >= bossThreshold && !bossSpawned) {
                enemies.length = 0; // Clear existing enemies for "only boss battle"
                spawnBoss();
            }
        };

        const updateAutoPlay = () => {
            if (bossDefeated) {
                player.dx = 0;
                return;
            }

            const aliveEnemies = enemies.filter(e => e.alive);
            const target = boss && boss.health && boss.health > 0 ? boss : (aliveEnemies.length > 0 ? aliveEnemies[0] : null);

            if (target) {
                let nearest = target;
                if (!boss || (boss.health !== undefined && boss.health <= 0)) {
                    let minDist = Math.abs(player.x + player.width / 2 - (target.x + target.width / 2));
                    for (let enemy of aliveEnemies) {
                        const dist = Math.abs(player.x + player.width / 2 - (enemy.x + enemy.width / 2));
                        if (dist < minDist) {
                            minDist = dist;
                            nearest = enemy;
                        }
                    }
                }

                const targetX = nearest.x + nearest.width / 2 - player.width / 2;
                if (Math.abs(player.x - targetX) > 5) {
                    player.dx = player.x < targetX ? player.speed! : -player.speed!;
                } else {
                    player.dx = 0;
                }

                for (let eb of enemyBullets) {
                    if (eb.y > player.y - 80 &&
                        eb.x > player.x - 20 &&
                        eb.x < player.x + player.width + 20) {
                        player.dx = eb.x < player.x ? player.speed! : -player.speed!;
                    }
                }
            }
        };

        const update = () => {
            if (bossDefeated) {
                // Update pixel transition
                let allComplete = true;
                pixelTransition.forEach(p => {
                    if (p.delay > 0) {
                        p.delay--;
                        allComplete = false;
                    } else if (p.alpha < 1) {
                        p.alpha += 0.05;
                        if (p.alpha < 1) allComplete = false;
                    }
                });

                if (allComplete && !transitionComplete) {
                    transitionComplete = true;
                    setTimeout(() => {
                        if (gameRef.current) gameRef.current.cleanup();
                        setGameState('complete');
                    }, 500);
                }
                return;
            }

            if (isAutoPlay) {
                updateAutoPlay();
            } else {
                if (keys['ArrowLeft'] || touchInput.left) player.dx = -player.speed!;
                else if (keys['ArrowRight'] || touchInput.right) player.dx = player.speed!;
                else player.dx = 0;
            }

            player.x += player.dx!;
            player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

            bullets.forEach((b: any, i: number) => {
                b.y -= b.speed;
                if (b.y < -20) bullets.splice(i, 1);
            });

            enemyBullets.forEach((b, i) => {
                b.y += b.speed;
                if (b.dx) b.x += b.dx;
                if (b.y > canvas.height + 20) enemyBullets.splice(i, 1);
            });

            if (!bossSpawned) {
                enemyShoot();
                spawnNewEnemies();
            }

            enemies.forEach((e, i) => {
                if (!e.alive) {
                    enemies.splice(i, 1);
                    return;
                }

                e.x += e.dx;
                e.y += e.dy;
                e.frame = (e.frame + 0.1) % 2;

                if (e.x <= 0 || e.x + e.width >= canvas.width) {
                    e.dx *= -1;
                }

                if (e.y > canvas.height) {
                    enemies.splice(i, 1);
                }
            });

            // Update boss
            if (boss) {
                if (boss.y < 40) {
                    boss.y += boss.dy!;
                } else {
                    boss.x += boss.dx!;
                    if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
                        boss.dx! *= -1;
                    }
                }
                boss.frame = (boss.frame! + 0.05) % 2;
                bossShoot();
            }

            bullets.forEach((b: any, bi: number) => {
                // Check boss collision
                if (boss && boss.health !== undefined && boss.health > 0 &&
                    b.x < boss.x + boss.width &&
                    b.x + b.width > boss.x &&
                    b.y < boss.y + boss.height &&
                    b.y + b.height > boss.y) {
                    boss.health--;
                    bullets.splice(bi, 1);
                    createParticles(b.x, b.y, '#0f0', 6);

                    if (boss.health <= 0) {
                        createExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, 96);
                        createParticles(boss.x + boss.width / 2, boss.y + boss.height / 2, '#0f0', 40);
                        currentScore += 1000;
                        bossDefeated = true;
                        initPixelTransition();
                    }
                    return;
                }

                // Check enemy collision
                enemies.forEach((e, ei) => {
                    if (e.alive &&
                        b.x < e.x + e.width &&
                        b.x + b.width > e.x &&
                        b.y < e.y + e.height &&
                        b.y + b.height > e.y) {
                        e.alive = false;
                        bullets.splice(bi, 1);
                        currentScore += (3 - (e.type || 0)) * 10 + 10;
                        createParticles(e.x + e.width / 2, e.y + e.height / 2, '#0f0', 8);
                        createExplosion(e.x + e.width / 2, e.y + e.height / 2, 24);
                    }
                });
            });

            enemyBullets.forEach((b, i) => {
                if (b.x < player.x + player.width &&
                    b.x + b.width > player.x &&
                    b.y < player.y + player.height &&
                    b.y + b.height > player.y) {
                    gameOver = true;
                    createExplosion(player.x + player.width / 2, player.y + player.height / 2, 32);
                    createParticles(player.x + player.width / 2, player.y + player.height / 2, '#f00', 20);
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

            setScore(currentScore);
        };

        const drawPixelSprite = (x: number, y: number, width: number, height: number, color: string, pattern: number[][]) => {
            ctx.fillStyle = color;
            const pSize = 4 * sizeMult;

            for (let py = 0; py < pattern.length; py++) {
                for (let px = 0; px < pattern[py].length; px++) {
                    if (pattern[py][px]) {
                        ctx.fillRect(
                            x + px * pSize,
                            y + py * pSize,
                            pSize,
                            pSize
                        );
                    }
                }
            }
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

        const enemyPatterns = [
            [
                [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
                [1, 0, 1, 0, 0, 0, 0, 1, 0, 1]
            ],
            [
                [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 1, 0, 0, 0, 0, 1, 0, 1]
            ],
            [
                [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
                [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                [0, 0, 1, 0, 1, 1, 0, 1, 0, 0]
            ]
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

        const drawPlayer = () => {
            drawPixelSprite(player.x, player.y, player.width, player.height, '#0f0', playerPattern);
        };

        const drawEnemies = () => {
            enemies.forEach(e => {
                if (!e.alive) return;
                const colors = ['#0f0', '#0d0', '#0b0'];
                const pattern = enemyPatterns[e.type];
                drawPixelSprite(e.x, e.y, e.width, e.height, colors[e.type], pattern);
            });
        };

        const drawBoss = () => {
            if (!boss || (boss.health !== undefined && boss.health <= 0)) return;

            drawPixelSprite(boss.x, boss.y, boss.width, boss.height, '#0f0', bossPattern);

            // Health bar
            if (boss.health !== undefined && boss.maxHealth !== undefined) {
                const barWidth = boss.width;
                const barHeight = 6;
                const barX = boss.x;
                const barY = boss.y - 12;

                ctx.fillStyle = '#222';
                ctx.fillRect(barX, barY, barWidth, barHeight);

                ctx.fillStyle = '#0f0';
                const healthWidth = (boss.health / boss.maxHealth) * barWidth;
                ctx.fillRect(barX, barY, healthWidth, barHeight);

                ctx.strokeStyle = '#0f0';
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

        const drawPixelTransition = () => {
            pixelTransition.forEach(p => {
                if (p.alpha > 0) {
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = '#0f0';
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                }
            });
            ctx.globalAlpha = 1;
        };

        // Initialize random stars
        const stars = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() < 0.5 ? 2 : 3,
            twinkleOffset: Math.random() * 100
        }));

        const draw = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw twinkling stars
            ctx.fillStyle = '#0f0';
            const time = Date.now() * 0.005;
            stars.forEach(star => {
                const opacity = 0.3 + 0.7 * Math.sin(time + star.twinkleOffset);
                if (opacity > 0) {
                    ctx.globalAlpha = opacity;
                    ctx.fillRect(star.x, star.y, star.size, star.size);
                }
            });
            ctx.globalAlpha = 1;

            drawEnemies();
            drawBoss();
            drawPlayer();
            drawBullets();
            drawExplosions();
            drawParticles();

            if (bossDefeated) {
                drawPixelTransition();
            }



            if (boss && boss.health !== undefined && boss.health > 0) {
                ctx.font = 'bold 24px monospace';
                ctx.fillText('BOSS BATTLE!', canvas.width / 2 - 80, 30);
            }
        };

        const gameLoop = () => {
            if (gameOver && !isAutoPlay) {
                setHighScore(prev => Math.max(prev, currentScore));
                setGameState('gameOver');
                return;
            }

            update();
            draw();
            animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();



        // Attach touch handlers to window or expose them via ref/state if needing React UI interaction
        // For simplicity, we'll assign these to the gameRef so the React components can toggle them
        gameRef.current = {
            cleanup: () => {
                cancelAnimationFrame(animationId);
                if (shootIntervalRef.current) {
                    clearInterval(shootIntervalRef.current);
                }
                if (!isAutoPlay) {
                    window.removeEventListener('keydown', keyDown);
                    window.removeEventListener('keyup', keyUp);
                }
            },
            setTouchLeft: (active: boolean) => { touchInput.left = active; },
            setTouchRight: (active: boolean) => { touchInput.right = active; }
        };
    };

    if (gameState === 'complete') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-900/20 font-press-start backdrop-blur-sm">
                <div className="text-center p-8 border-4 border-green-500 rounded-xl bg-black shadow-[0_0_50px_rgba(34,197,94,0.6)] relative overflow-hidden">
                    <div className="absolute inset-0 crt-scanlines opacity-10 pointer-events-none" />
                    <h1 className="text-4xl md:text-6xl font-bold text-green-500 mb-8 animate-pulse text-shadow-glow">LOADING COMPLETE</h1>
                    <p className="text-xl text-green-400 mb-8">SYSTEMS READY</p>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-2 border-green-500 hover:bg-green-500 hover:text-black text-green-500 font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                        INITIALIZE
                    </button>
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
                    .text-shadow-glow {
                        text-shadow: 0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.4);
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-press-start overflow-hidden">
            {/* CRT Overlay */}
            <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)]" />
                <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[80] text-green-500 hover:text-green-300 transition-colors p-2 hover:bg-green-900/20 rounded-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Header (Visible when not playing or in menu) */}
            <div className="relative z-[60] mb-6 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-green-500 mb-2 tracking-widest text-shadow-glow animate-pulse">
                    SPACE INVADERS
                </h1>
                <p className="text-green-400 text-sm md:text-base tracking-widest">
                    HIGH SCORE: {highScore.toString().padStart(6, '0')}
                </p>
            </div>

            {/* Game Contatiner */}
            <div className="relative z-[60] p-1">
                {/* Arcade Bezel */}
                <div className="absolute inset-0 border-4 border-green-600 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.4),inset_0_0_20px_rgba(34,197,94,0.2)] pointer-events-none z-10" />

                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="bg-black rounded-lg max-w-[95vw] max-h-[70vh] w-auto h-auto block"
                    style={{ imageRendering: 'pixelated' }}
                />

                {/* Overlays (Menu, Game Over) */}
                {gameState === 'menu' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 rounded-lg">
                        <div className="text-center space-y-8">
                            <div className="space-y-6 flex flex-col items-center">
                                <button
                                    onClick={() => setGameState('playing')}
                                    className="group relative px-8 py-4 bg-transparent border-4 border-green-500 text-green-500 font-bold text-lg md:text-xl tracking-widest hover:bg-green-500 hover:text-black transition-all duration-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center gap-4"
                                >
                                    <Play size={24} className="fill-current" />
                                    INSERT COIN
                                </button>
                                <button
                                    onClick={() => setGameState('autoplay')}
                                    className="group relative px-6 py-3 bg-transparent border-2 border-green-700 text-green-700 font-bold text-sm md:text-lg tracking-widest hover:bg-green-700 hover:text-green-100 transition-all duration-200 hover:shadow-[0_0_20px_rgba(21,128,61,0.6)] flex items-center gap-3"
                                >
                                    <Zap size={20} className="fill-current" />
                                    DEMO MODE
                                </button>
                            </div>
                            <div className="mt-8 text-green-600 space-y-2 text-xs md:text-sm tracking-wider">
                                <p>← → MOVE • SPACE FIRE</p>
                                <p className="animate-pulse">CREDIT 00</p>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'gameOver' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 rounded-lg">
                        <div className="text-center space-y-8">
                            <h2 className="text-4xl md:text-6xl font-bold text-red-500 mb-4 tracking-widest text-shadow-glow">GAME OVER</h2>
                            <div className="space-y-2">
                                <p className="text-xl md:text-2xl text-green-400">SCORE</p>
                                <p className="text-2xl md:text-4xl text-white">{score.toString().padStart(6, '0')}</p>
                            </div>

                            {score === highScore && score > 0 && (
                                <p className="text-lg text-yellow-400 animate-pulse">★ NEW RECORD ★</p>
                            )}

                            <button
                                onClick={() => {
                                    setScore(0);
                                    setGameState('menu');
                                }}
                                className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-bold text-lg rounded shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-transform hover:scale-105"
                            >
                                TRY AGAIN
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* In-Game Footer UI */}
            {(gameState === 'playing' || gameState === 'autoplay') && (
                <div className="relative z-[60] mt-4 text-center">
                    <div className="flex items-center justify-center gap-8 text-green-500 text-xs md:text-sm tracking-widest">
                        <p>{gameState === 'autoplay' ? 'cpu_player' : 'player_1'}</p>
                        <p className="animate-pulse">READY</p>
                    </div>
                    <p className="text-green-400 text-xl md:text-2xl font-bold mt-2 tracking-widest">
                        SCORE: <span className="text-white">{score.toString().padStart(6, '0')}</span>
                    </p>

                    {/* Mobile Controls */}
                    {gameState === 'playing' && (
                        <div className="fixed bottom-8 left-0 right-0 px-4 flex justify-between z-[70] md:hidden pointer-events-auto w-full">
                            <button
                                onTouchStart={(e) => { e.preventDefault(); gameRef.current && (gameRef.current as any).setTouchLeft(true); }}
                                onTouchEnd={(e) => { e.preventDefault(); gameRef.current && (gameRef.current as any).setTouchLeft(false); }}
                                onMouseDown={() => gameRef.current && (gameRef.current as any).setTouchLeft(true)}
                                onMouseUp={() => gameRef.current && (gameRef.current as any).setTouchLeft(false)}
                                className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-xl flex items-center justify-center active:bg-green-500/40 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all active:scale-95"
                            >
                                <ChevronLeft size={48} className="text-green-400" />
                            </button>
                            <button
                                onTouchStart={(e) => { e.preventDefault(); gameRef.current && (gameRef.current as any).setTouchRight(true); }}
                                onTouchEnd={(e) => { e.preventDefault(); gameRef.current && (gameRef.current as any).setTouchRight(false); }}
                                onMouseDown={() => gameRef.current && (gameRef.current as any).setTouchRight(true)}
                                onMouseUp={() => gameRef.current && (gameRef.current as any).setTouchRight(false)}
                                className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-xl flex items-center justify-center active:bg-green-500/40 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all active:scale-95"
                            >
                                <ChevronRight size={48} className="text-green-400" />
                            </button>
                        </div>
                    )}
                </div>
            )}

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
                .text-shadow-glow {
                    text-shadow: 4px 4px 0px #000, -2px -2px 0px #004d00, 0 0 10px #00ff00;
                }
            `}</style>
        </div>
    );
};

export default SpaceInvadersGame;
