"use client";

import PageSection from "@/app/hooks/PageSection";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import BinaryText from "@/app/components/Animations/BinaryText";
import ArcadeHeader from "../ui/ArcadeHeader";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import { pixelifySans } from '@/app/utils/pixelifySans.utils';

// import useTextScramble from "../Animations/text";
import { sponsors } from "@/app/constants/sponsors";
interface Sponsor {
  logo: string | StaticImageData;
  link?: string;
  alt: string;
  description: string;
}

const Sponsors = () => {

  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <PageSection
      id="sponsors"
      className={isMobile ? `min-h-fit` : ""}
    >
      <section className="flex flex-col font-pixelate text-white mt-28 min-h-[50vh]">
        <div className="flex flex-col h-full">
          <div className="mb-12">
            <ArcadeHeader text="Sponsors" />
          </div>

          {/* <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 rounded-3xl border border-white/10">
              <p className={`text-4xl md:text-5xl font-bold text-white uppercase tracking-widest ${pixelifySans.className}`}>
                Coming Soon!
              </p>
            </div> */}

          {/* {sponsors.map((sponsorItem) => {
          console.log(sponsorItem, 'dfkn');

          let gridClass = "grid w-[calc(80vw)] gap-4 rounded-lg bg-black/5 p-5 md:w-[calc(60vw)]";
          let imageSizeClass = "max-w-[200px] max-h-[50px] "; // Default size

          if (sponsorItem.title === 'Tera Sponsor') {
            gridClass += " grid-cols-1 md:grid-cols-2";
            imageSizeClass = "max-w-88 max-h-14 object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]";
          } else if (sponsorItem.title === 'Giga Sponsor') {
            gridClass += " grid-cols-3";
            imageSizeClass = "w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]";
          } else if (sponsorItem.title === 'Mega Sponsor') {
            gridClass += " grid-cols-2";
            imageSizeClass = "w-56 sm:w-64 h-24 object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]";
          } else if (sponsorItem.title === 'Kilo Sponsor') {
            gridClass += " grid-cols-2 sm:grid-cols-5";
            imageSizeClass = "w-24 sm:w-28 h-16 object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]";
          } else if (sponsorItem.title === 'Platform Partner') {
            gridClass += " grid-cols-1";
            imageSizeClass = "w-16 sm:w-20 h-24 object-contain baler-website";
          } else {
            gridClass += " grid-cols-5";
          }

          return (
            <div className="mb-0 flex flex-col items-center justify-center" key={sponsorItem.title}> */}
          {/* <h2 className="mb-2 text-center text-[1.5em] font-bold md:text-[2rem]">
                {sponsorItem.title}
              </h2> */}
          {/* <div className={gridClass}>
                {sponsorItem.sponsors.length === 0 ? (
                  <div className="text-center" key="default">
                    Coming Soon...
                  </div>
                ) : (
                  sponsorItem.sponsors.map((sponsor: Sponsor, index: number) => (
                    <div className="text-center flex justify-center items-center" key={index}>
                      <a
                        target="_blank"
                        href={sponsor.link}
                        className='flex flex-col items-center justify-center'
                      >
                        <Image
                          src={sponsor.logo}
                          width={500}
                          height={500}
                          className={imageSizeClass}
                          alt={sponsor.alt}
                        />
                        <span className='text-white'>{sponsor.description}</span>
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })} */}

          <div className="flex items-center justify-center min-h-20 md:min-h-50">
            <p className={`text-4xl md:text-4xl font-bold text-white uppercase tracking-widest ${pixelifySans.className}`}>
              Coming Soon!
            </p>
          </div>
        </div>
      </section>
    </PageSection>
  );
};

export default Sponsors;


