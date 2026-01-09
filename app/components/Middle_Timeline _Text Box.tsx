import React from 'react';

type MiddleTimelineBoxProps = {
    title: string;
    subtitle: string;
    className?: string;
};



const MiddleTimelineBox: React.FC<MiddleTimelineBoxProps> = ({ title, subtitle, className }) => {
    return (
        <div className={`${className} relative w-[20.5rem] h-[5.7rem] lg:w-[25.25rem] lg:h-[7.25rem] `}>
            <div
                className={`absolute drop-shadow-[12px_8px_49px_rgba(117,255,58,0.21)] flex flex-col gap-1 items-center box-border w-[20.5rem] h-[5.7rem] lg:w-[25.25rem] lg:h-[7.25rem] bg-black border-4 border-[#034D03]`}
            >
                <div className="w-[20.5rem] h-[5.7rem] relative flex flex-col justify-center items-center box-border lg:w-[25.25rem] lg:h-[7.25rem]">
                    <p className="absolute font-sf-pixelate font-bold text-[1.5rem] lg:text-[2rem] leading-[2.875rem] text-white">
                        {title}
                    </p>
                </div>
                <div className="w-[20.5rem] h-[5.7rem] relative flex flex-col justify-center items-center box-border lg:w-[25.25rem] lg:h-[7.25rem]">
                    <p className="absolute font-sf-pixelate font-bold text-[1.3rem] lg:text-[1.7rem] leading-[2.875rem] text-white">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MiddleTimelineBox;
/* Rectangle 3 */

/* 3rd March Registration Start */
