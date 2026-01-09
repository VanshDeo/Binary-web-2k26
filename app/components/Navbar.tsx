"use client";
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import NextImage from "next/image";
import { motion } from "framer-motion";
import { HyperText } from './ui/hyper-text';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');


    const navItems = [
        { name: 'About', href: '#about' },
        { name: 'Timeline', href: '#timeline' },
        { name: 'Tracks', href: '#tracks' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Mentors', href: '#mentors' },
        { name: 'Sponsors', href: '#sponsors' },
        { name: 'Community', href: '#community-partners' },
        { name: 'FAQs', href: '#faqs' },
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
                const el = document.querySelector(item.href);
                if (el) {
                    return {
                        id: item.href,
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
                const newIndex = navItems.findIndex(item => item.href === closest.id);
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
            if (window.lenis) {
                window.lenis.scrollTo(target as HTMLElement);
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };



    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-green-500/20 overflow-hidden">
            {/* Desktop Scroll Progress Overlay */}
            {/* Desktop Scroll Progress Overlay */}
            <motion.div
                className="hidden md:block absolute inset-y-0 left-0 bg-white/10 z-0 h-full"
                animate={{ width: `${scrollProgress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
            />
            {/* Mobile Scroll Progress Overlay */}
            <motion.div
                className="md:hidden absolute inset-y-0 left-0 bg-white/10 z-0 h-full"
                animate={{ width: `${scrollProgress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
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
                            <a href="#" className="flex items-center">
                                <NextImage
                                    src="/assets/IEEE_kolkata.png"
                                    alt="IEEE Kolkata Logo"
                                    width={50}
                                    height={50}
                                    className="h-10 w-auto object-contain"
                                />
                            </a>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {navItems.map((item, index) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className={`px-3 py-2 rounded-md text-sm font-mono transition-all duration-300 flex items-center ${activeSection === item.href
                                        ? "text-green-500"
                                        : "text-gray-300 hover:text-green-400"
                                        }`}
                                >
                                    {activeSection === item.href && (
                                        <span className="w-2 h-2  bg-green-500 mr-2 animate-pulse" />
                                    )}
                                    <HyperText
                                        as="span"
                                        className="text-sm font-mono bg-transparent p-0"
                                    >
                                        {item.name}
                                    </HyperText>
                                </a>
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
                                href={item.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${activeSection === item.href
                                    ? "text-green-500"
                                    : "text-gray-300 hover:text-green-400"
                                    }`}
                                onClick={(e) => handleNavClick(e, item.href)}
                            >
                                {activeSection === item.href && (
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                )}
                                <HyperText
                                    as="span"
                                    className="text-base font-mono bg-transparent p-0"
                                >
                                    {item.name}
                                </HyperText>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
