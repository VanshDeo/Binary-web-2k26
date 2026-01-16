import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const pixelify = Pixelify_Sans({
    variable: "--pixelify-sans",
    subsets: ["latin"],
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
    weight: "400",
    variable: "--font-press-start-2p",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: 'Binary - KGEC Hackathon 2026',
    description:
        'Join Binary - KGEC Hackathon 2026, a platform for innovation and collaboration. Build impactful solutions across tracks like Web3, Open Innovation, Medical Tech, and more. Unite with tech enthusiasts to shape the future.',
    keywords: [
        'Binary Hackathon',
        'KGEC Hackathon 2026',
        'Binary KGEC',
        'Binary 2026',
        'Binary KGEC tech',
        'KGEC Hackathon',
        'hackathon 2026',
        'technical innovation',
        'hackathon tracks',
        'Web3 hackathon',
        'Open Innovation',
        'Medical Tech',
        'technology event',
        'collaboration',
        'innovation platform',
        'coding competition',
        'technical challenges',
        'hackathon India',
        'KGEC event',
        'building meaningful solutions',
        'future technology',
        'innovation hub',
        'teamwork',
        'tech hackathon',
        'KGEC Hackathon participants',
    ],
    openGraph: {
        type: 'website',
        url: 'https://www.binary.kgec.tech/',
        title: 'Binary - KGEC Hackathon 2026',
        description:
            'Binary - KGEC Hackathon 2026 brings together innovators to build meaningful solutions across diverse tracks like Web3, Medical Tech, and more.',
        images: [
            {
                url: 'https://www.binary.kgec.tech/images/binaryDP.png',
                width: 1200,
                height: 630,
                alt: 'Binary - KGEC Hackathon 2026 Banner',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@BinaryKgec',
        title: 'Binary - KGEC Hackathon 2026',
        description:
            'A technical hackathon fostering innovation and collaboration. Join us to create impactful solutions in Web3, Medical Tech, and other domains.',
        images: 'https://www.binary.kgec.tech/images/binaryDP.png',
    },
    icons: {
        icon: '/favicon.ico',
    },
};



export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} ${pixelify.variable} bg-black overflow-hidden`}>
                <div className="relative z-10 w-full h-full">
                    {/* <div className={`scanline`} /> */}
                    <SmoothScroll>{children}</SmoothScroll>
                </div>
                <script defer async src="https://apply.devfolio.co/v2/sdk.js"></script>
            </body>
        </html>
    );
}