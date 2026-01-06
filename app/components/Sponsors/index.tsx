"use client";

import PageSection from "@/app/hooks/PageSection";
import BinaryText from "@/app/components/Animations/BinaryText";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
// import useTextScramble from "../Animations/text";
import { sponsors } from "@/app/constants/sponsors";
interface Sponsor {
  logo: string | StaticImageData;
  link?: string;
  alt: string;
  description: string;
}

const Sponsors = () => {
  return (
    // <PageSection>
    <div id="sponsors" className="flex flex-col font-pixelate text-white mt-28">
      <div>
        <div className="mb-1">
          <BinaryText
            className="font-pixelate text-[2rem] font-bold text-white md:text-[3rem]"
            reveal
          >
            <div className="shad relative w-full overflow-x-hidden pt-5 text-xl sm:hidden">
              <h2 className="relative mx-0 mb-10 flex max-w-sm flex-row pt-4 text-left font-pixelate font-bold uppercase md:w-max md:max-w-max md:pt-0">
                <span className="flex-none pl-1 font-bold tracking-wider text-green-500 opacity-85">
                  07.
                </span>
                <span className="flex-none pl-2 font-bold tracking-wider text-gray-200 opacity-85">
                  Sponsors
                </span>

                <div className="item-center flex flex-col justify-center">
                  <div className="right-full ml-4 mt-[10px] h-[1px] w-[70vh] transform bg-[#1d6339]"></div>
                </div>
              </h2>
            </div>
            <div className="shad relative hidden w-full overflow-x-hidden pt-5 sm:block">
              <h2 className="relative mx-0 mb-10 flex max-w-sm flex-row pt-4 text-left font-pixelate font-bold md:w-max md:max-w-max md:pt-0">
                <span className="flex-none pl-4 font-bold tracking-wider text-green-500 opacity-85">
                  07.
                </span>
                <span className="flex-none pl-4 font-bold tracking-wider text-gray-200 opacity-85">
                  Sponsors
                </span>

                <div className="item-center flex flex-col justify-center">
                  <div className="right-full top-[55%] ml-4 mt-[25px] h-[1px] w-[70vh] transform bg-[#1d6339]"></div>
                </div>
              </h2>
            </div>
          </BinaryText>
        </div>

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
        {sponsors.map((sponsorItem) => {
          let gridClass =
            "grid w-[calc(80vw)] gap-4 rounded-lg bg-black/5 p-5 md:w-[calc(60vw)]";
          let itemClass = "text-center flex justify-center items-center";
          let imageSizeClass = "max-w-[200px] max-h-[50px]";

          if (sponsorItem.title === "Tera Sponsor") {
            gridClass += " grid-cols-1 md:grid-cols-2";
            imageSizeClass =
              "max-w-88 max-h-14 object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]";
          } else if (sponsorItem.title === "Giga Sponsor") {
            gridClass += " grid-cols-3";
            imageSizeClass =
              "w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]";
          } else if (sponsorItem.title === "Mega Sponsor") {
            gridClass += " grid-cols-2";
            imageSizeClass =
              "w-56 sm:w-64 h-24 object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]";
          } else if (sponsorItem.title === "Kilo Sponsor") {
            gridClass =
              "flex flex-wrap justify-center gap-4 w-full p-5 bg-black/5 rounded-lg";
            itemClass += " w-1/3 sm:w-1/5"; // 2 columns on mobile, 5 on desktop
            imageSizeClass =
              "w-24 sm:w-28 h-16 object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]";
          } else if (sponsorItem.title === "Platform Partner") {
            gridClass += " grid-cols-1";
            imageSizeClass = "w-16 sm:w-20 h-24 object-contain baler-website";
          }

          return (
            <div
              className="mb-0 flex flex-col items-center justify-center"
              key={sponsorItem.title}
            >
              <div className={gridClass}>
                {sponsorItem.sponsors.length === 0 ? (
                  <div className="text-center">Coming Soon...</div>
                ) : (
                  sponsorItem.sponsors.map(
                    (sponsor: Sponsor, index: number) => (
                      <div className={itemClass} key={index}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={sponsor.link}
                          className="flex flex-col items-center justify-center"
                        >
                          <Image
                            src={sponsor.logo}
                            width={500}
                            height={500}
                            className={imageSizeClass}
                            alt={sponsor.alt}
                          />
                          <span className="text-white">
                            {sponsor.description}
                          </span>
                        </a>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    // </PageSection>
  );
};

export default Sponsors;
