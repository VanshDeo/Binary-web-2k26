import React, { useEffect, useMemo, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ClockProps {
    enableGlitchClock?: boolean;
    startTime: string; // ISO timestamp
    endTime: string;   // ISO timestamp
}

const Clock: React.FC<ClockProps> = ({ enableGlitchClock = false, startTime, endTime }) => {
    const isMobile = useMediaQuery('(max-width: 767px)');

    const [hackingStarted, setHackingStarted] = useState(() => {
        const now = new Date();
        return now > new Date(startTime);
    });

    const handleHackingStart = () => {
        if (!hackingStarted) {
            setHackingStarted(true);
            // Optional: analytics/event
        } else {
            // Optional: handle end
        }
    };

    // Glitch scheduling (non-even bursts) and vectors for layered duplicates
    const [glitchActive, setGlitchActive] = useState(false);
    const [glitchVector, setGlitchVector] = useState({
        dx1: 2,
        dy1: -1,
        rot1: 0.4,
        dx2: -2,
        dy2: 1,
        rot2: -0.4,
    });

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    useEffect(() => {
        if (!enableGlitchClock) return; // no timers if not enabled
        let mounted = true;
        let timer: number | undefined;
        const loop = () => {
            const offMs = Math.floor(600 + Math.random() * 1200);
            const onMs = Math.floor(100 + Math.random() * 200);
            timer = window.setTimeout(() => {
                if (!mounted) return;
                setGlitchVector({
                    dx1: rand(-3, 3),
                    dy1: rand(-2, 2),
                    rot1: rand(-0.8, 0.8),
                    dx2: rand(-3, 3),
                    dy2: rand(-2, 2),
                    rot2: rand(-0.8, 0.8),
                });
                setGlitchActive(true);
                timer = window.setTimeout(() => {
                    if (!mounted) return;
                    setGlitchActive(false);
                    loop();
                }, onMs);
            }, offMs);
        };
        loop();
        return () => {
            mounted = false;
            if (timer) window.clearTimeout(timer);
        };
    }, [enableGlitchClock]);

    const digitStyle = useMemo(
        () => (isMobile ? { width: 30, height: 50, fontSize: 25 } : { width: 40, height: 60, fontSize: 30 }),
        [isMobile]
    );

    return (
        <div className="mt-2 w-full flex-col justify-center items-center text-center md:mt-0 font-pixelate font-bold text-green-500 md:text-[1.5rem]">
            <div className="w-full">
                <TypeAnimation
                    key={hackingStarted ? 'hacking-time-left' : 'hacking-starts-in'}
                    sequence={[1000, hackingStarted ? 'Hacking time left...' : 'Hacking starts in...']}
                    speed={50}
                />
            </div>
            <div className="relative flex justify-center items-center mt-4">
                {/* Base clock (always visible) */}

                <FlipClockCountdown
                    to={hackingStarted ? endTime : startTime}
                    labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                    labelStyle={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}
                    digitBlockStyle={digitStyle}
                    dividerStyle={{ color: '#171', height: 1 }}
                    separatorStyle={{ color: 'green', size: '5px' }}
                    duration={0.5}
                    hideOnComplete={false}
                    onComplete={handleHackingStart}
                />


                {/* Glitch overlays: duplicate FlipClockCountdown for same styling */}
                {enableGlitchClock && glitchActive && (
                    <>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-70"
                            style={{
                                transform: `translate(${glitchVector.dx1}px, ${glitchVector.dy1}px) rotate(${glitchVector.rot1}deg)`,
                                filter: 'hue-rotate(25deg) saturate(1.2) contrast(1.03)',
                                mixBlendMode: 'screen',
                                WebkitMaskImage:
                                    'repeating-linear-gradient( to bottom, rgba(0,0,0,1) 0 6px, rgba(0,0,0,0.15) 6px 9px )',
                                maskImage:
                                    'repeating-linear-gradient( to bottom, rgba(0,0,0,1) 0 6px, rgba(0,0,0,0.15) 6px 9px )',
                            } as React.CSSProperties}
                        >
                            <FlipClockCountdown
                                to={hackingStarted ? endTime : startTime}
                                labels={['', '', '', '']}
                                labelStyle={{ display: 'none' } as any}
                                digitBlockStyle={digitStyle}
                                dividerStyle={{ color: '#0000', height: 1 }}
                                separatorStyle={{ color: 'transparent', size: '0px' } as any}
                                duration={0.5}
                                hideOnComplete={false}
                            />
                        </div>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-60"
                            style={{
                                transform: `translate(${glitchVector.dx2}px, ${glitchVector.dy2}px) rotate(${glitchVector.rot2}deg)`,
                                filter: 'hue-rotate(-25deg) saturate(1.2) contrast(1.03)',
                                mixBlendMode: 'screen',
                                WebkitMaskImage:
                                    'repeating-linear-gradient( to bottom, rgba(0,0,0,0.2) 0 5px, rgba(0,0,0,1) 5px 10px )',
                                maskImage:
                                    'repeating-linear-gradient( to bottom, rgba(0,0,0,0.2) 0 5px, rgba(0,0,0,1) 5px 10px )',
                            } as React.CSSProperties}
                        >
                            <FlipClockCountdown
                                to={hackingStarted ? endTime : startTime}
                                labels={['', '', '', '']}
                                labelStyle={{ display: 'none' } as any}
                                digitBlockStyle={digitStyle}
                                dividerStyle={{ color: '#0000', height: 1 }}
                                separatorStyle={{ color: 'transparent', size: '0px' } as any}
                                duration={0.5}
                                hideOnComplete={false}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Clock;