'use client';
import React from 'react';

const HelloWorld = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-500 animate-gradient-x p-4 font-press-start">
                HELLO WORLD
            </h1>
            <p className="text-zinc-500 font-sans tracking-wide uppercase text-xs md:text-sm animate-pulse">
                System initialized • Connection secure • Ready for production
            </p>
            <div className="flex space-x-2">
                <div className="w-12 h-1 bg-green-500/50 rounded-full" />
                <div className="w-4 h-1 bg-green-500/30 rounded-full" />
                <div className="w-2 h-1 bg-green-500/10 rounded-full" />
            </div>

            <style jsx>{`
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 8s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default HelloWorld;
