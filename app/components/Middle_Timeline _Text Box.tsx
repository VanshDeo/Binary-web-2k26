import React from 'react';

type MiddleTimelineBoxProps = {
    title: string;
    subtitle: string;
    className?: string;
};



const MiddleTimelineBox: React.FC<MiddleTimelineBoxProps> = ({ title, subtitle, className }) => {
    return (
        <div className={`${className} w-full lg:w-[70%] h-[5.7rem] lg:h-[7.25rem] `}>
            <div
                className={` drop-shadow-[12px_8px_49px_rgba(117,255,58,0.21)] flex flex-col gap-1 items-center box-border w-full h-fit lg:w-[25.25rem] lg:h-[7.25rem] p-2 bg-black border-4 border-[#034D03]`}
            >
                <div className="text-center box-border lg:w-[25.25rem] lg:h-[7.25rem]">
                    <p className=" font-sf-pixelate font-bold text-[1.25rem] lg:text-[1.5rem] text-white">
                        {title}
                    </p>
                </div>
                <div className=" text-center box-border lg:w-[25.25rem] lg:h-[7.25rem]">
                    <p className=" font-sf-pixelate font-bold text-[1rem] lg:text-[1.25rem]  text-white">
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
