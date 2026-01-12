// app/Timeline.js or components/Timeline.js
"use client";

import React, { useEffect } from 'react';
// import BinaryText from "../Animations/BinaryText";
import PageSection from '../hooks/PageSection';
// import { useScroll, motion } from 'framer-motion';
import { useRef } from 'react';
import { timeline } from '../constants/timeline';
import gsap from 'gsap';
import { ScrollTrigger, MotionPathPlugin } from 'gsap/all';
import MiddleTimelineBox from './Middle_Timeline _Text Box';
import PacmanPathMobileSVG from './PacmanPathMobileSVG';
import ArcadeHeader from './ui/ArcadeHeader';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
import PacmanPathSVG from './PacmanPathSVG';
// import useTextScramble from "../Animations/text";
// import { useInView } from 'react-intersection-observer';




const Timeline = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pacman Chomp Animation Shape
      const pacman_mobile_closed = "M39.056 11.4991C37.1199 7.47643 33.8656 4.19748 29.8069 2.1799C25.7482 0.162314 21.1163 -0.478974 16.6425 0.357277C12.1687 1.19353 8.10777 3.45968 5.10088 6.79797C2.094 10.1363 0.312415 14.3565 0.0373966 18.7925C-0.237622 23.2285 1.00959 27.6275 3.58213 31.295C6.15468 34.9625 9.90601 37.6897 14.2439 39.0459C18.5818 40.4021 23.2591 40.3102 27.5375 38.7846C31.8158 37.259 35.4515 34.3866 37.8705 30.6209L20.5 20L39.056 11.4991Z";

      // Desktop Closed Shape (Approximate closed mouth at 710, 20)
      const pacman_desktop_closed = "M729.167 11.7332C727.257 7.62855 723.982 4.2737 719.873 2.21275C715.763 0.151797 711.061 -0.494394 706.528 0.378977C701.995 1.25235 697.898 3.59406 694.9 7.02433C691.902 10.4546 690.18 14.7723 690.013 19.2771C689.846 23.7819 691.244 28.2096 693.98 31.8422C696.716 35.4748 700.629 38.0992 705.086 39.2898C709.542 40.4804 714.28 40.1673 718.531 38.4014C722.782 36.6355 726.297 33.5202 728.506 29.5609L710.5 20L729.167 11.7332Z";

      // Mobile Animation
      gsap.to(".pattern-rect-mobile", {
        attr: { d: pacman_mobile_closed },
        duration: 0.2, 
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true, 
      });

      // Desktop/Tab Animation
      gsap.to([".pattern-rect-desktop", ".pattern-rect-tab"], {
          attr: { d: pacman_desktop_closed },
          duration: 0.2,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
      });

      // --- Desktop Animation ---
      const desktopPath = document.querySelector("#path-desktop") as SVGPathElement;
      const desktopPacman = document.querySelector(".pattern-rect-desktop");
      const desktopSvg = document.querySelector(".desktop-svg");

      if (desktopPath && desktopPacman && desktopSvg) {
          const length = desktopPath.getTotalLength();
          gsap.set(desktopPath, { strokeDasharray: 10 });
          
          gsap.fromTo(desktopPath,
              { strokeDashoffset: 0 },
              {
                  strokeDashoffset: length,
                  duration: 10,
                  ease: "none",
                  scrollTrigger: {
                      trigger: desktopSvg,
                      start: "top 30%",
                      end: "bottom bottom",
                      scrub: 2,
                  },
              }
          );

          gsap.to(desktopPacman, {
              motionPath: {
                  path: desktopPath,
                  align: desktopPath,
                  alignOrigin: [0.5, 0.5],
                  autoRotate: true,
                  start: 0,
                  end: 1,
              },
              transformOrigin: "50% 50%",
              duration: 5,
              ease: "none",
              immediateRender: true,
              scrollTrigger: {
                  trigger: desktopSvg,
                  start: "top 30%",
                  end: "bottom bottom",
                  scrub: 2,
              },
          });
      }

      // --- Tab Animation ---
      const tabPath = document.querySelector("#path-tab") as SVGPathElement;
      const tabPacman = document.querySelector(".pattern-rect-tab");
      const tabSvg = document.querySelector(".tab-svg");

      if (tabPath && tabPacman && tabSvg) {
          const length = tabPath.getTotalLength();
          gsap.set(tabPath, { strokeDasharray: 10 });

          gsap.fromTo(tabPath,
              { strokeDashoffset: 0 },
              {
                  strokeDashoffset: length,
                  duration: 10,
                  ease: "none",
                  scrollTrigger: {
                      trigger: tabSvg, 
                      start: "top 20%",
                      end: "bottom bottom",
                      scrub: 2,
                  },
              }
          );

          gsap.to(tabPacman, {
              motionPath: {
                  path: tabPath,
                  align: tabPath,
                  alignOrigin: [0.5, 0.5],
                  autoRotate: true,
                  start: 0, 
                  end: 1,
              },
              transformOrigin: "50% 50%",
              duration: 5,
              ease: "none",
              immediateRender: true,
              scrollTrigger: {
                  trigger: tabSvg,
                  start: "top 20%",
                  end: "bottom bottom",
                  scrub: 2,
                  markers: false,
              },
          });
      }

      // --- Mobile (Phone) Animation ---
      const mobilePath = document.querySelector("#path-mobile") as SVGPathElement;
      const mobilePacman = document.querySelector(".pattern-rect-mobile");
      const mobileSvg = document.querySelector(".mobile-svg");

      if (mobilePath && mobilePacman && mobileSvg) {
          const length = mobilePath.getTotalLength();
          gsap.set(mobilePath, { strokeDasharray: 10 });

          gsap.fromTo(mobilePath,
              { strokeDashoffset: 0 },
              {
                  strokeDashoffset: length,
                  duration: 10,
                  ease: "none",
                  scrollTrigger: {
                      trigger: mobileSvg,
                      start: "top 20%",
                      end: "bottom 80%",
                      scrub: 3,
                  },
              }
          );

          gsap.to(mobilePacman, {
              motionPath: {
                  path: mobilePath,
                  align: mobilePath,
                  alignOrigin: [0.5, 0.5],
                  autoRotate: true,
                  start: 0, 
                  end: 1,
              },
              transformOrigin: "50% 50%",
              duration: 10,
              immediateRender: true,
              ease: "none",
              scrollTrigger: {
                  trigger: mobileSvg,
                  start: "top 20%",
                  end: "bottom 80%",
                  scrub: 3,
                  markers: false,
              },
          });
      }

      // Desktop Timeline Box Animations
      const desktopTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".desktop-svg",
          start: "top 30%",
          end: "bottom bottom",
          scrub: 3,
        }
      });

      const desktopBoxes = [
        ".second-timeline-box",
        ".first-timeline-box", 
        ".fourth-timeline-box",
        ".third-timeline-box",
        ".sixth-timeline-box",
        ".fifth-timeline-box"
      ];

      desktopBoxes.forEach((box) => {
         const els = gsap.utils.toArray(box);
         if (els.length > 0) {
           desktopTl.fromTo(els, 
             { y: 50, opacity: 0 },
             { y: 0, opacity: 1, duration: 1 },
             ">-.5" 
           );
         }
      });

      // Tab Timeline Box Animations
      const tabTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".tab-svg",
          start: "top 20%",
          end: "bottom bottom",
          scrub: 3,
        }
      });

      const tabBoxes = [
        ".second-timeline-box-tab",
        ".first-timeline-box-tab",
        ".fourth-timeline-box-tab",
        ".third-timeline-box-tab",
        ".sixth-timeline-box-tab",
        ".fifth-timeline-box-tab"
      ];

      tabBoxes.forEach((box, index) => {
        const els = gsap.utils.toArray(box);
        if (els.length > 0) {
          const isLeft = index % 2 !== 0;
          const xStart = isLeft ? -100 : 100;

          tabTl.fromTo(els,
            { x: xStart, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
            ">-.5"
          );
        }
      });

      // Mobile (Phone) Timeline Box Animations
      const mobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".mobile-svg",
          start: "top 20%",
          end: "bottom 80%",
          scrub: 3,
        }
      });

      const mobileBoxes = gsap.utils.toArray(".mobile-timeline-box");
      if (mobileBoxes.length > 0) {
        mobileBoxes.forEach((box: any) => {
            mobileTl.fromTo(box,
              { x: 50, opacity: 0 },
              { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
              ">-.5"
            );
        });
      }

    }, containerRef); // Scope to container

    return () => ctx.revert(); // Cleanup on unmount
  }, []);




  return (
    <PageSection id="timeline">
      <div className="my-2 mb-8 md:text-[3rem]">
            <ArcadeHeader text="Timeline" />
          </div>
      <div className="mb-16" ref={containerRef}>
        <div className="border-2 border-[#222] rounded-[2rem] shadow-[0_0_30px_rgba(34,197,94,0.4)] bg-black overflow-hidden relative scale-85 origin-top">
          {/* Desktop View */}
          <div className="main-bar relative w-full h-[999px] z-20 hidden lg:block">
            {/* Background SVG */}
            <div className="absolute top-0 left-0 w-full h-full z-0 overflow-x-hidden pointer-events-none select-none transform-gpu">
               <PacmanPathSVG 
                 className_svg="desktop-svg w-full h-full" 
                 className_path="w-full h-full " 
                 pathId="path-desktop"
                 pacmanClass="pattern-rect-desktop"
               />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex justify-between">
                {/* Left Side (Odd Items) */}
                <div className="left-side w-1/2 h-full flex flex-col gap-[3rem] items-end pr-[10%]">
                    <MiddleTimelineBox
                        className="first-timeline-box mb-10 mt-[10rem]"
                        title="3rd March"
                        subtitle="Registration Start"
                    />
                    <MiddleTimelineBox
                        className="third-timeline-box mt-[3.5rem]"
                        title="16th-26th March"
                        subtitle="Approvals Roll out"
                    />
                     <MiddleTimelineBox
                        className="fifth-timeline-box mt-[3.5rem]"
                        title="30th March"
                        subtitle="Submission of Projects"
                    />
                </div>

                {/* Right Side (Even Items) */}
                <div className="right-side w-1/2 h-full flex flex-col gap-[1.2rem] items-start pl-[10%]">
                     <MiddleTimelineBox
                        className="second-timeline-box mt-[3rem]"
                        title="25th March"
                        subtitle="Registration End"
                    />
                    <MiddleTimelineBox
                        className="fourth-timeline-box mt-[6rem]"
                        title="29th March"
                        subtitle="Hackathon Starts"
                    />
                    <MiddleTimelineBox
                        className="sixth-timeline-box mt-[7rem]"
                        title="30th March"
                        subtitle="Hackathon Ends"
                    />
                </div>
            </div>
          </div>

          {/* Tab View */}
          <div className="tab-bar relative w-full h-[1600px] z-20 hidden md:block lg:hidden">
            {/* Background SVG */}
             <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none transform-gpu">
               <PacmanPathSVG 
                 className_svg="tab-svg w-full h-full" 
                 className_path="w-full h-full " 
                 pathId="path-tab"
                 pacmanClass="pattern-rect-tab"
                 preserveAspectRatio="xMidYMid slice"
               />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex justify-between pointer-events-none">
                {/* Left Side */}
                <div className="left-side w-1/2 h-full flex flex-col mt-[5rem] pl-[5%] gap-[5rem] items-end pr-[2%] pointer-events-auto">
                    <MiddleTimelineBox
                        className="first-timeline-box-tab mb-5 mt-[7rem] transform scale-125 pl-[%] origin-right"
                        title="3rd March"
                        subtitle="Registration Start"
                    />
                    <MiddleTimelineBox
                        className="third-timeline-box-tab mt-[15rem] transform scale-125 pl-[12%] origin-right"
                        title="16th-26th March"
                        subtitle="Approvals Roll out"
                    />
                     <MiddleTimelineBox
                        className="fifth-timeline-box-tab mt-[20rem] transform scale-125 pl-[12%] origin-right"
                        title="30th March"
                        subtitle="Submission of Projects"
                    />
                </div>

                {/* Right Side */}
                <div className="right-side w-1/2 h-full flex flex-col gap-[1rem] items-start pl-[2%] pr-[5%] pointer-events-auto">
                     <MiddleTimelineBox
                        className="second-timeline-box-tab mt-[25rem] transform scale-125 origin-left"
                        title="25th March"
                        subtitle="Registration End"
                    />
                    <MiddleTimelineBox
                        className="fourth-timeline-box-tab mt-[25rem] transform scale-125 origin-left"
                        title="29th March"
                        subtitle="Hackathon Starts"
                    />
                    <MiddleTimelineBox
                        className="sixth-timeline-box-tab mt-[22rem] transform scale-125 origin-left"
                        title="30th March"
                        subtitle="Hackathon Ends"
                    />
                </div>
            </div>
          </div>
          {/*Mobile View*/}
          <div className='relative max-w-[48rem] h-[920px] md:hidden   justify-center '>
              <PacmanPathMobileSVG 
                className_svg="mobile-svg absolute  md:hidden left-[10px] max-w-1/7 h-[920px] transform scale-90 origin-top-left stroke-green-600" 
                className_path=" w-[100%]  flex flex-col items-center justify-center  h-[920px] stroke-green-600" 
                pathId="path-mobile"
                pacmanClass="pattern-rect-mobile"
              />
               <div className="z-10 absolute  flex flex-col gap-[2.5rem] w-full h-[920px] md:hidden font-sf-pixelate">
                   {timeline.map((item, index) => (
                         <div key={index} className="relative left-[60px] w-[calc(100%-80px)]">
                            <MiddleTimelineBox
                              className="w-full transform scale-90 origin-top-left mobile-timeline-box"
                              title={item.date}
                              subtitle={item.title}
                            />
                         </div>
                   ))}
               </div>
            </div>


          </div>
        </div>
      
      
     
    </PageSection>
  );
};

export default Timeline;

// import { use, useEffect } from "react";
// import "./style.css"; // Adjust path as needed
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// import MiddleTimelineBox from "./components/Middle_Timeline _Text Box";

// gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// export default function Timeline() {
  // useEffect(() => {
  //   const svg = document.querySelector("svg");
  //   const path = svg.querySelector("path");
  //   const length = path.getTotalLength();

  //   var pacman_1 =
  //     "M40.7895 17.1414C40.0511 12.1531 37.4095 7.62063 33.3931 4.45076C29.3766 1.28089 24.2815 -0.292655 19.127 0.0449074C13.9725 0.38247 9.13867 2.60625 5.5925 6.27138C2.04633 9.93652 0.0492951 14.7728 0.000899533 19.8126C-0.047496 24.8525 1.85631 29.7244 5.33148 33.4537C8.80665 37.183 13.5969 39.4948 18.744 39.9265C23.8912 40.3582 29.0156 38.8781 33.0922 35.7822C37.1688 32.6863 39.897 28.2029 40.7311 23.2289L20.5 20L40.7895 17.1414Z";
  //   var pacman_2 =
  //     "M39.056 11.4991C37.1199 7.47643 33.8656 4.19748 29.8069 2.1799C25.7482 0.162314 21.1163 -0.478974 16.6425 0.357277C12.1687 1.19353 8.10777 3.45968 5.10088 6.79797C2.094 10.1363 0.312415 14.3565 0.0373966 18.7925C-0.237622 23.2285 1.00959 27.6275 3.58213 31.295C6.15468 34.9625 9.90601 37.6897 14.2439 39.0459C18.5818 40.4021 23.2591 40.3102 27.5375 38.7846C31.8158 37.259 35.4515 34.3866 37.8705 30.6209L20.5 20L39.056 11.4991Z";
  //   gsap.to(".pattern-rect", {
  //     attr: { d: pacman_2 },
  //     duration: 0.5,
  //     ease: "power1.inOut",
  //     repeat: -1,
  //     scrub: true,
  //   });

  //   gsap.set(path, { strokeDasharray: 10 });

    // gsap.fromTo(".first-timeline-box",
    //   {
    //     y: 50,
    //     opacity: 0,
    //   },
    //   {
    //     scrollTrigger: {
    //       trigger: ".first-timeline-box",
    //       start: "top 24%",
    //       end: "bottom center",
    //       toggleActions: "play none none reverse",
    //       markers: true,
    //     },
    //     y: 0,
    //     opacity: 1,
    //     duration: 2,
    //   });
    // gsap.fromTo(".second-timeline-box",
    //   {
    //     y: 50,
    //     opacity: 0,
    //   },
    //   {
    //     scrollTrigger: {
    //       trigger: ".second-timeline-box",
    //       start: "top 35%",
    //       end: "bottom center",
    //       toggleActions: "play none none reverse",
    //       markers: true,
    //     },
    //     y: 0,
    //     opacity: 1,
    //     duration: 2,
    //   });
    // gsap.fromTo(".third-timeline-box",
    //   {
    //     y: 50,
    //     opacity: 0,
    //   },
    //   {
    //     scrollTrigger: {
    //       trigger: ".third-timeline-box",
    //       start: "top 52%",
    //       end: "bottom center",
    //       toggleActions: "play none none reverse",
    //       markers: true,
    //     },
    //     y: 0,
    //     opacity: 1,
    //     duration: 2,
    //   });
    // gsap.fromTo(".fourth-timeline-box",
    //   {
    //     y: 50,
    //     opacity: 0,
    //   },
    //   {
    //     scrollTrigger: {
    //       trigger: ".fourth-timeline-box",
    //       start: "top 67%",
    //       end: "bottom center",
    //       toggleActions: "play none none reverse",
    //       markers: true,
    //     },
    //     y: 0,
    //     opacity: 1,
    //     duration: 2,
    //   });
    // gsap.fromTo(".fifth-timeline-box",
    //   {
    //     y: 50,
    //     opacity: 0,
    //   },
    //   {
    //     scrollTrigger: {
    //       trigger: ".fifth-timeline-box",
    //       start: "top 70%",
    //       end: "bottom bottom",
    //       toggleActions: "play none none reverse",
    //       markers: true,
    //     },
    //     y: 0,
    //     opacity: 1,
    //     duration: 2,
    //   });
    // gsap.fromTo(".sixth-timeline-box",
    //   {
    //     y: 50,
    //     opacity: 0,
    //   },
    //   {
    //     scrollTrigger: {
    //       trigger: ".sixth-timeline-box",
    //       start: "top 90%",
    //       end: "bottom bottom",
    //       toggleActions: "play none none reverse",
    //       markers: true,
    //     },
    //     y: 0,
    //     opacity: 1,
    //     duration: 2,
    //   });
  //   gsap.fromTo(
  //     path,
  //     {

  //       strokeDashoffset: 0,
  //     },
  //     {

  //       strokeDashoffset: length,
  //       duration: 10,
  //       ease: "none",
  //       scrollTrigger: {
  //         trigger: "svg",
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: 2,
  //         markers: true,
  //       },
  //     }
  //   );

  //   gsap.to(".pattern-rect", {
  //     motionPath: {
  //       path: "#path",
  //       align: "#path",
  //       alignOrigin: [0.5, 0.5],
  //       autoRotate: true,
  //     },
  //     transformOrigin: "50% 50%",
  //     duration: 5,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: "svg",
  //       start: "top top",
  //       end: "bottom bottom",
  //       scrub: 2,
  //       markers: true,
  //     },
  //   });
  // }, []);

//   return (
    
      
//       {/* <section className="timeline-section">
        // <MiddleTimelineBox
        //   className="first-timeline-box"
        //   title="3rd March"
        //   subtitle="Registration Start"
        //   postion_top="167px"
        //   postion_left="45px"
        // />
        // <MiddleTimelineBox
        //   className="second-timeline-box"
        //   title="25th March"
        //   subtitle="Registration End"
        //   postion_top="285px"
        //   postion_left="727px"
        // />
        // <MiddleTimelineBox
        //   className="third-timeline-box"
        //   title="16th – 26th March"
        //   subtitle="Approvals Roll Out"
        //   postion_top="451px"
        //   postion_left="45px"
        // />
        // <MiddleTimelineBox
        //   className="fourth-timeline-box"
        //   title="29th March"
        //   subtitle="Hackathon Starts"
        //   postion_top="627px"
        //   postion_left="1093px"
        // />
        // <MiddleTimelineBox
        //   className="fifth-timeline-box"
        //   title="30th March"
        //   subtitle="Submission of Pro."
        //   postion_top="677px"
        //   postion_left="275px"

        // />
        // <MiddleTimelineBox
        //   className="sixth-timeline-box"
        //   title="30th March"
        //   subtitle="Hackathon Ends"
        //   postion_top="946px"
        //   postion_left="740px"
        // />
//         <img src="/Android Compact - 4.png" alt="" /> */}


// {/* 
//         <div className="svg-container item-center justify-center">
//           <svg 
//             className=""
//             width="650"
//             height="1090"
//             viewBox="0 0 597 1024"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >

//             <g filter="url(#filter0_d_0_1)">
//               <path
//                 id="path"
//                 d="M120.907 0V56.0746H231.5V188.992H3.5V322.429H231.5V457.424H3.5V594.495H231.5V738.316V738.835H117.5H3.5V886.291H117.5V946"
//                 stroke="#75FF3A"
//                 strokeWidth="7"
//                 strokeDasharray="14 14"
//               />
//             </g>
//             <path
//               className="pattern-rect"
//               d="M40.7895 17.1414C40.0511 12.1531 37.4095 7.62063 33.3931 4.45076C29.3766 1.28089 24.2815 -0.292655 19.127 0.0449074C13.9725 0.38247 9.13867 2.60625 5.5925 6.27138C2.04633 9.93652 0.0492951 14.7728 0.000899533 19.8126C-0.047496 24.8525 1.85631 29.7244 5.33148 33.4537C8.80665 37.183 13.5969 39.4948 18.744 39.9265C23.8912 40.3582 29.0156 38.8781 33.0922 35.7822C37.1688 32.6863 39.897 28.2029 40.7311 23.2289L20.5 20L40.7895 17.1414Z" fill="#4BC715" />
//             <defs>
//               <filter
//                 id="filter0_d_0_1"
//                 x="0"
//                 y="-24"
//                 width="597"
//                 height="1102"
//                 filterUnits="userSpaceOnUse"
//                 colorInterpolationFilters="sRGB"
//               >
//                 <feFlood floodOpacity="0" result="BackgroundImageFix" />
//                 <feColorMatrix
//                   in="SourceAlpha"
//                   type="matrix"
//                   values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
//                   result="hardAlpha"
//                 />
//                 <feOffset dx="4" dy="4" />
//                 <feGaussianBlur stdDeviation="15.5" />
//                 <feComposite in2="hardAlpha" operator="out" />
//                 <feColorMatrix
//                   type="matrix"
//                   values="0 0 0 0 0.293089 0 0 0 0 0.780769 0 0 0 0 0.0840827 0 0 0 1 0"
//                 />
//                 <feBlend
//                   mode="normal"
//                   in2="BackgroundImageFix"
//                   result="effect1_dropShadow_0_1"
//                 />
//                 <feBlend
//                   mode="normal"
//                   in="SourceGraphic"
//                   in2="effect1_dropShadow_0_1"
//                   result="shape"
//                 />
//               </filter>
//             </defs>
//           </svg>
//         </div> */}
//         {/* Add your timeline content here */}
//       {/* </section > */}
    
//   );
// }