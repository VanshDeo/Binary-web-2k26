"use client";
import { useState } from 'react';
import { Marquee } from "./magicui/marquee";
import ArcadeHeader from './ui/ArcadeHeader';

const teamMembers = [
    {
        name: "Lester Andrew Calvert",
        username: "lestercalvert377@gmail.com",
        role: "Founder & Chief AI Visionary",
        img: "/placeholder.svg", // Using placeholder as images are not local
        gradient: "from-purple-500/20 to-pink-500/20",
        expertise: ["AI Strategy", "Innovation", "Leadership"],
        bio: "Visionary leader with 15+ years in AI technology, driving innovation and strategic initiatives to transform businesses through artificial intelligence."
    },
    {
        name: "Supratim dhara",
        username: "supratimdhara@gmail.com",
        role: "Chief Technology & Data Officer",
        img: "/placeholder.svg",
        gradient: "from-blue-500/20 to-cyan-500/20",
        expertise: ["Data Science", "Architecture", "Cloud"],
        bio: "Expert in building scalable data architectures and cloud solutions, with deep expertise in machine learning and data engineering."
    },
    {
        name: "Sandip Sharma",
        // username: "@sandip.sharma",
        role: "AI-Powered Marketing Strategist",
        img: "/placeholder.svg",
        gradient: "from-green-500/20 to-emerald-500/20",
        expertise: ["Marketing", "Analytics", "Growth"],
        bio: "Strategic marketing professional leveraging AI and data analytics to drive growth and optimize customer engagement across digital channels."
    },
    {
        name: "AISHI CHAKRABORTY",
        // username: "@aishi",
        role: "Human-Centered Design & AI Experience Lead",
        img: "/placeholder.svg",
        gradient: "from-orange-500/20 to-red-500/20",
        expertise: ["UX Design", "Research", "Prototyping"],
        bio: "Design leader focused on creating intuitive AI experiences that bridge the gap between complex technology and human needs."
    },
    {
        name: "Souradip Pal",
        // username: "@souradip",
        role: "Lead Machine Learning Engineer",
        img: "/placeholder.svg",
        gradient: "from-indigo-500/20 to-purple-500/20",
        expertise: ["ML/DL", "Python", "TensorFlow"],
        bio: "Machine learning expert specializing in deep learning architectures, neural networks, and AI model optimization for production systems."
    },
    {
        name: "Baivab Mukhopadhyay ",
        // username: "@bhaibhav",
        role: "Full-Stack Developer & Data Engineer",
        img: "/placeholder.svg",
        gradient: "from-teal-500/20 to-blue-500/20",
        expertise: ["React", "Node.js", "ETL"],
        bio: "Full-stack engineer with expertise in building scalable web applications and data pipelines that power AI-driven solutions."
    },
    {
        name: "Suddhajit Chowdhury",
        // username: "@suddhajit",
        role: "AI-Driven Designer & Developer",
        img: "/placeholder.svg",
        gradient: "from-rose-500/20 to-pink-500/20",
        expertise: ["Creative AI", "Frontend", "Motion"],
        bio: "Creative technologist combining AI tools with traditional design principles to create innovative digital experiences and interactive interfaces."
    },
    {
        name: "Bhumika Das",
        // username: "@harleen.kaur",
        role: "Innovation Delivery Manager – AI Solutions",
        img: "/placeholder.svg",
        gradient: "from-amber-500/20 to-orange-500/20",
        expertise: ["Agile", "Delivery", "Strategy"],
        bio: "Project management expert specializing in AI solution delivery, ensuring seamless execution of complex AI projects from concept to deployment."
    },
];

const firstColumn = teamMembers.slice(0, 3);
const secondColumn = teamMembers.slice(3, 6);
const thirdColumn = teamMembers.slice(6, 8);

const TeamMemberCard = ({ img, name, username, role, expertise, onClick, highlightDirection = "tr-bl" }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    const gradientClass = highlightDirection === "tr-bl"
        ? "hover:bg-gradient-to-bl hover:from-green-500/20 hover:via-green-500/10 hover:to-transparent"
        : "hover:bg-gradient-to-br hover:from-green-500/20 hover:via-green-500/10 hover:to-transparent";

    return (
        <div
            className="relative w-full max-w-xs group/card cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className={`
        relative overflow-hidden rounded-3xl border border-white/10 
        bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent
        ${gradientClass}
        p-8 shadow-2xl backdrop-blur-xl
        transition-all duration-500 ease-out
        hover:border-green-500/50 hover:shadow-[0_20px_80px_-20px_rgba(34,197,94,0.3)]
        hover:scale-[1.02] hover:-translate-y-1
      `}>




                {/* Profile image with glow effect */}
                <div className="relative mb-6 group/image">

                    <img
                        src={img || "/placeholder.svg"}
                        alt={name}
                        className="relative h-20 w-20 rounded-full object-cover ring-2 ring-white/10 group-hover/card:ring-green-500/50 transition-all duration-500"
                    />
                    {/* Status indicator */}
                    <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 rounded-full border-2 border-black/50 animate-pulse"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover/card:text-green-400 transition-colors duration-300">
                        {name}
                    </h3>
                    <p className="text-sm text-white/50 mb-3">{username}</p>
                    <p className="text-white/80 font-medium mb-4 leading-relaxed line-clamp-2">
                        {role}
                    </p>

                    {/* Expertise tags */}
                    <div className={`
            flex flex-wrap gap-2 mt-4 
            transition-all duration-500 
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}>
                        {expertise?.slice(0, 3).map((skill: string, idx: number) => (
                            <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded-full backdrop-blur-sm group-hover/card:bg-green-500/20 group-hover/card:text-green-200"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
};

const PopupCard = ({ member, isOpen, onClose }: any) => {
    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Popup Card */}
            <div className="relative max-w-md w-full animate-popup-in">
                <div className={`
          relative overflow-hidden rounded-3xl border border-white/20 
          bg-neutral-900
          p-8 shadow-2xl backdrop-blur-xl
        `}>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center text-white/60 hover:text-white z-20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>



                    {/* Profile image with glow effect */}
                    <div className="relative mb-6 flex justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#e78a53]/40 to-[#f0a068]/40 rounded-full blur-xl opacity-100"></div>
                        <img
                            src={member.img || "/placeholder.svg"}
                            alt={member.name}
                            className="relative h-24 w-24 rounded-full object-cover ring-4 ring-white/20"
                        />
                        {/* Status indicator */}
                        <div className="absolute bottom-0 right-8 h-6 w-6 bg-green-500 rounded-full border-3 border-black/50 animate-pulse"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {member.name}
                        </h3>
                        <p className="text-sm text-white/60 mb-2">{member.username}</p>
                        <p className="text-[#e78a53] font-semibold mb-4 text-lg">
                            {member.role}
                        </p>

                        {/* Bio */}
                        <p className="text-white/80 leading-relaxed mb-6 text-sm">
                            {member.bio}
                        </p>

                        {/* Expertise tags */}
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {member.expertise?.map((skill: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 text-sm bg-white/15 text-white/80 rounded-full backdrop-blur-sm border border-white/10"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-100 pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

const Mentors = () => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleCardClick = (member: any) => {
        setSelectedMember(member);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedMember(null);
    };

    return (
        <section id="mentors" className="relative py-24 overflow-hidden bg-black text-white">
            {/* Animated background */}
            {/* Animated background removed */}
            <div className="absolute inset-0 pointer-events-none">
            </div>

            <div className="relative mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mb-16">
                        <ArcadeHeader text="Mentors" />
                    </div>

                    <p className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto mb-12">
                        Our diverse team of innovators, creators, and problem-solvers working together to shape the future of AI technology.
                    </p>
                </div>

                {/* Team marquee - Slower animations */}
                {/* Desktop Layout - Vertical Columns */}
                <div className="mt-10 hidden md:flex justify-center gap-8 max-h-[800px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                    <div className="hidden lg:block">
                        <Marquee pauseOnHover vertical className="[--duration:45s]">
                            {firstColumn.map((member) => (
                                <TeamMemberCard
                                    key={member.name}
                                    {...member}
                                    highlightDirection="tr-bl"
                                    onClick={() => handleCardClick(member)}
                                />
                            ))}
                        </Marquee>
                    </div>

                    <div className="hidden md:block">
                        <Marquee reverse pauseOnHover vertical className="[--duration:45s]">
                            {secondColumn.map((member) => (
                                <TeamMemberCard
                                    key={member.name}
                                    {...member}
                                    highlightDirection="tl-br"
                                    onClick={() => handleCardClick(member)}
                                />
                            ))}
                        </Marquee>
                    </div>

                    <div>
                        <Marquee pauseOnHover vertical className="[--duration:45s]">
                            {thirdColumn.map((member) => (
                                <TeamMemberCard
                                    key={member.name}
                                    {...member}
                                    highlightDirection="tr-bl"
                                    onClick={() => handleCardClick(member)}
                                />
                            ))}
                        </Marquee>
                    </div>
                </div>

                {/* Mobile Layout - Horizontal Marquee */}
                <div className="mt-10 md:hidden block overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <Marquee pauseOnHover className="[--duration:45s]">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="px-4">
                                <TeamMemberCard
                                    {...member}
                                    highlightDirection="tr-bl"
                                    onClick={() => handleCardClick(member)}
                                />
                            </div>
                        ))}
                    </Marquee>
                </div>
            </div>

            {/* Popup Modal */}
            <PopupCard
                member={selectedMember}
                isOpen={isPopupOpen}
                onClose={closePopup}
            />
        </section>
    );
};

export default Mentors;
