import React from "react";
import { cn } from "@/app/lib/utils"; // Assuming you have a cn utility, if not I'll use simple template literals or create it.

interface ArcadeHeaderProps {
    text: string;
    className?: string;
}

const ArcadeHeader: React.FC<ArcadeHeaderProps> = ({ text, className }) => {
    return (
        <div className={cn("w-full flex justify-center items-center py-8", className)}>
            <h2
                className="
          font-press-start 
          text-3xl md:text-4xl lg:text-5xl 
          text-green-500 
          uppercase 
          tracking-widest 
          text-center
          animate-[flicker_3s_linear_infinite]
        "
                style={{
                    textShadow: "4px 4px 0px #000, -2px -2px 0px #004d00, 0 0 10px #00ff00, 0 0 20px #00ff00"
                }}
            >
                {text}
            </h2>
        </div>
    );
};

export default ArcadeHeader;
