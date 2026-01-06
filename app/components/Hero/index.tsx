import { memo } from 'react';
import PageSection from '../../hooks/PageSection';
import Image from 'next/image';
// import { motion } from 'framer-motion';
// import { useMemo } from 'react';
// import { useMediaQuery } from '../../hooks/useMediaQuery';
import Clock from './Clock';

import { Press_Start_2P } from 'next/font/google';

// import cicada from '@public/images/cicada_trasparent.png';
import Link from 'next/link';

const pressStart2P = Press_Start_2P({ weight: '400', subsets: ['latin'] });

const Hero = ({ heroTopRef }: { heroTopRef: (node?: Element | null | undefined) => void }) => {
  // const isMobile = useMediaQuery("(max-width: 767px)")
  const hackathonStartTime = "2025-03-29T11:30:00";
  const hackathonEndTime = "2025-03-30T14:00:00";   // March 30, 2025 2:00 PM

  const glitchClockEnabled = true; // Enable glitch clock only on non-mobile devices

  return (
    <PageSection className="flex h-screen flex-col items-center justify-center">
      {/* <a
        href='https://cicada.kgec.tech'
        target='_blank'
        className='absolute flex justify-end w-[90%] h-200 z-10'>
        <Image
          src={cicada}
          alt="Flying cicada"
          className="px-2 w-[40%] cursor-pointer md:w-[20%] animate-pulse hover:animate-bounce"
          style={{
            animation: 'fly 6s infinite ease-in-out',
            transform: 'rotate(-30deg)',
          }}
        />
      </a> */}
      <div id="hero" ref={heroTopRef} className="flex flex-col justify-center gap-8">
        <div className="mt-16 flex w-full flex-col items-center justify-center md:mt-0 md:text-[1.5rem]">
          <div className="mt-[15%] flex w-full flex-col items-center justify-center lg:mt-[10%]">
            <Image height={800} width={500} className="glitch opacity-[200]" src='/herologo.png' alt="Binary Hackathon" />
          </div>
        </div>

        <div className="mx-auto mt-16 flex flex-col gap-8 md:mt-0 md:flex-row">
          <div className="mt-4 flex w-full items-center justify-center md:mt-0 md:w-1/2">
            <div className="b mx-auto flex h-10 w-64 animate-bounce items-center justify-center md:h-[50px] md:animate-none">
              <Link
                href="https://binaryvtwo.devfolio.co/"
                target="_blank"
                className={`flex justify-center items-center font-lg font-bold h-full w-full text-center font-pixelate text-white transform cursor-pointer overflow-hidden rounded-xl bg-opacity-50 bg-gradient-to-br from-green-950/40 to-green-700/40 shadow-[0_0_15px_rgba(34,197,94,0.8)] hover:shadow-[0_0_25px_rgba(34,197,94,1)] backdrop-blur-sm backdrop-filter transition duration-300 ease-out hover:scale-105 hover:bg-green-950 md:h-[50px] ${pressStart2P.className}`}
              >
                Register Now!
              </Link>
            </div>
          </div>
          <div className="flex w-full items-center justify-center md:w-1/2">
            <div className="b relative mx-auto flex h-10 w-64 items-center justify-center md:h-[50px]">
              <a
                href="http://discord.gg/yKcMYeMMe8"
                target='_blank'
                className="flex justify-center items-center font-md  w-full h-full text-center font-pixelate text-white transform cursor-pointer rounded-xl border-2 border-green-700 bg-transparent shadow-md shadow-green-700 transition duration-300 ease-out hover:scale-105 hover:bg-green-950 md:h-[50px]"
              >
                <span className="mr-4">
                  <svg
                    className="h-7 w-7 fill-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 21 16"
                  >
                    <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                  </svg>
                </span>
                Discord Link
              </a>
            </div>
          </div>
        </div>
        {/* <Clock
          enableGlitchClock={glitchClockEnabled}
          startTime={hackathonStartTime}
          endTime={hackathonEndTime}
        /> */}
      </div>
    </PageSection>
  );
};

export default memo(Hero);