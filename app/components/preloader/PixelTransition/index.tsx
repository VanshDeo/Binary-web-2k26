'use client';
import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import { motion, Variants } from 'framer-motion';

const anim: Variants = {
    initial: {
        opacity: 0
    },
    open: (i: number) => ({
        opacity: 1,
        transition: {
            duration: 0.4,
            delay: 0.06 * i,
            ease: [0.89, 1, 0.5, 1] // Accelerating in for the cover
        }
    }),
    closed: (i: number) => ({
        opacity: 0,
        transition: {
            duration: 0.4,
            delay: 0.03 * i,
            ease: [0.5, 1, 0.89, 1] // Decelerated out for the reveal
        }
    })
}

interface PixelTransitionProps {
    isActive: boolean;
}

export default function PixelTransition({ isActive }: PixelTransitionProps) {
    const [columns, setColumns] = useState<number[][]>([]);

    const shuffle = (a: number[]) => {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initBlocks = () => {
            const { innerWidth, innerHeight } = window;

            // Responsive block sizes: Larger blocks on smaller screens = fewer DOM elements
            const isMobile = innerWidth < 768;
            const blockSizePercent = isMobile ? 0.0833 : 0.03; // ~8.33vw on mobile, 3vw on desktop
            const blockSize = innerWidth * blockSizePercent;
            const nbOfBlocks = Math.ceil(innerHeight / blockSize);
            const nbOfCols = isMobile ? 12 : 34; // 12 columns on mobile, 34 on desktop

            const cols = Array.from({ length: nbOfCols }).map(() => {
                return shuffle([...Array(nbOfBlocks)].map((_, i) => i));
            });
            setColumns(cols);
        };

        initBlocks();
        window.addEventListener('resize', initBlocks);
        return () => window.removeEventListener('resize', initBlocks);
    }, []);

    if (columns.length === 0) return null;

    return (
        <div className={`${styles.pixelBackground} ${isActive ? styles.active : ''}`}>
            {columns.map((colIndices, colIndex) => (
                <div key={colIndex} className={styles.column}>
                    {colIndices.map((randomIndex, index) => (
                        <motion.div
                            key={`${colIndex}-${index}`}
                            className={styles.block}
                            variants={anim}
                            initial="initial"
                            animate={isActive ? "open" : "closed"}
                            custom={randomIndex}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
