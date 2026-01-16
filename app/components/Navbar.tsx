"use client";

import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import NextImage from "next/image";
import { motion } from "framer-motion";
import { HyperText } from './ui/hyper-text';
import { useRouter, usePathname } from 'next/navigation';
import { useGlitch } from 'react-powerglitch';
import { pixelifySans } from '@/app/utils/pixelifySans.utils';


// Component to handle individual nav items with glitch effect
function NavItemWithGlitch({
    item,
    isActive,
    onClick,
    isMobile = false
}: {
    item: { name: string; path: string },
    isActive: boolean,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void,
    isMobile?: boolean
}) {
    const glitch = useGlitch({
        playMode: 'hover',
        createContainers: true,
        hideOverflow: false,
        timing: {
            duration: 250,
            iterations: 1,
        },
        glitchTimeSpan: {
            start: 0,
            end: 1,
        },
        shake: {
            velocity: 15,
            amplitudeX: 0.2,
            amplitudeY: 0.2,
        },
        slice: {
            count: 6,
            velocity: 15,
            minHeight: 0.02,
            maxHeight: 0.15,
            hueRotate: true,
        },
        pulse: false,
    });

    return (
        <a
            href={item.path}
            onClick={onClick}
            className={`${isMobile ? 'block' : ''} px-3 py-2 rounded-md ${isMobile ? 'text-base' : 'text-lg'} font-mono transition-all duration-300 flex items-center cursor-pointer ${pixelifySans.className} ${isActive
                ? "text-green-500"
                : "text-gray-300 hover:text-green-400"
                }`}
        >
            <div ref={glitch.ref} className="flex items-center">
                {isActive && (
                    <span className={`w-2 h-2 ${isMobile ? 'rounded-full' : ''} bg-green-500 mr-2`} />
                )}
                {item.name}
            </div>
        </a>
    );
}

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');


    const navItems = [
        { name: 'About', path: '#about' },
        { name: 'Timeline', path: '#timeline' },
        { name: 'Tracks', path: '#tracks' },
        { name: 'Gallery', path: '#gallery' },
        { name: 'Mentors', path: '#mentors' },
        { name: 'Sponsors', path: '#sponsors' },
        { name: 'Community', path: '#community-partners' },
        { name: 'FAQs', path: '#faqs' },
    ];

    const [activeIndex, setActiveIndex] = useState(-1);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Calculate standard scroll progress for mobile
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
            setScrollProgress(progress);


            // Reset to zero if at the very top (e.g. Hero section)
            if (window.scrollY < 100) {
                setActiveSection('');
                setActiveIndex(-1);
                return;
            }

            // Check if at bottom of page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                setActiveIndex(navItems.length); // effective index beyond the last item
                return;
            }

            const entries = navItems.map(item => {
                const el = document.querySelector(item.path);
                if (el) {
                    return {
                        id: item.path,
                        offset: Math.abs(el.getBoundingClientRect().top - 100)
                    };
                }
                return null;
            }).filter((item): item is { id: string, offset: number } => item !== null);

            if (entries.length === 0) return;

            // Find section closest to top (100px offset)
            const closest = entries.reduce((prev, curr) => {
                return (prev.offset < curr.offset) ? prev : curr;
            });

            if (closest.offset < window.innerHeight / 2) { // Only highlight if reasonably close/visible
                setActiveSection(closest.id);
                // Update active index based on the new active section
                const newIndex = navItems.findIndex(item => item.path === closest.id);
                setActiveIndex(newIndex);
            }

        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial active check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);
        const target = document.querySelector(href);

        if (target) {
            const lenis = (window as any).lenis;
            if (lenis && typeof lenis.scrollTo === 'function') {
                lenis.scrollTo(target as HTMLElement);
            } else {
                // Fallback with offset for fixed header
                const headerOffset = 80; // Adjust based on your navbar height
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };



    return (
        <nav className="fixed top-0 left-0 w-full z-60 bg-black/80 backdrop-blur-md border-b border-green-500/20 overflow-hidden">
            {/* Desktop Scroll Progress Overlay */}
            <motion.div
                className="hidden md:block absolute inset-y-0 left-0 bg-white/10 z-0 h-full"
                animate={{ width: `${scrollProgress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center justify-between h-16">
                    <div className="shrink-0">
                        <div className="flex items-center gap-4">
                            <a href="#" className="flex items-center">
                                <NextImage
                                    src="/thumbnail.aacc4680.png"
                                    alt="Binary Logo"
                                    width={50}
                                    height={50}
                                    className="h-10 w-auto object-contain"
                                />
                            </a>
                            {/* <a href="#" className="flex items-center">
                                <NextImage
                                    src="/assets/IEEE_kolkata.png"
                                    alt="IEEE Kolkata Logo"
                                    width={50}
                                    height={50}
                                    className="h-10 w-auto object-contain"
                                />
                            </a> */}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className={`ml-10 flex items-center space-x-4`}>
                            {navItems.map((item, index) => (
                                <NavItemWithGlitch
                                    key={item.name}
                                    item={item}
                                    isActive={activeSection === item.path}
                                    onClick={(e) => handleNavClick(e, item.path)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-green-500 hover:text-white hover:bg-green-900/50 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-black/95">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                onClick={(e) => handleNavClick(e, item.path)}
                                className={`px-3 py-2 rounded-md text-base font-medium flex items-center cursor-pointer ${pixelifySans.className} ${activeSection === item.path
                                    ? "text-green-500"
                                    : "text-gray-300 hover:text-green-400"
                                    }`}
                            >
                                {activeSection === item.path && (
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                )}
                                {/* <HyperText
                                    as="span"
                                    className="text-base font-mono bg-transparent p-0"
                                > */}
                                {item.name}
                                {/* </HyperText> */}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};