"use client";

import Navbar from "../components/Navbar";
import TetrisInterface from "../components/TetrisInterface";
import GlobalGameButton from "../components/GlobalGameButton";

export default function HomePage() {
    return (
        <div className="min-h-screen text-white relative overflow-hidden bg-black">
            <Navbar />
            <TetrisInterface />
            <GlobalGameButton />
        </div>
    );
}
