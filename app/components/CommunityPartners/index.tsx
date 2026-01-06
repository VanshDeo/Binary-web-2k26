"use client";

import React, { useEffect, useState } from "react";
// import Slider from 'react-slick';
import { communityPartnersItems } from "@/app/constants/communityPartners";
import Image from "next/image";
import PageSection from "@/app/hooks/PageSection";
import BinaryText from "../Animations/BinaryText";
import ArcadeHeader from "../ui/ArcadeHeader";
import styled from "styled-components";
// import { CustomNextArrow, CustomPrevArrow } from '../Mentors';

import { StaticImageData } from "next/image";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

// Swiper imports (replaces react-slick)
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

interface MemberComponentProps {
  url: string;
  imageUrl: string; // use string for public folder paths
}

const Section = styled.section<{ theme: { body: string } }>`
  min-height: fit-content;
  width: full;
  background-color: ${(props) => props.theme.body};
  position: relative;
`;

const MemberComponent: React.FC<MemberComponentProps> = ({
  url = "",
  imageUrl = "",
}) => {
  // ensure proper public path (leading slash required)
  const src = imageUrl?.toString().startsWith("/")
    ? imageUrl.toString()
    : `/${imageUrl}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-center items-center"
    >
      <Image
        src={src}
        alt="Community Partner"
        width={500}
        height={500}
        className="w-64 h-28 sm:w-64 sm:h-36 object-contain drop-shadow-[0_5px_10px_rgba(14,180,32,0.5)]"
      />
    </a>
  );
};

const CommunityPartners = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <PageSection
      id="community-partners"
      className={isMobile ? `min-h-fit` : ""}
    >
      <Section>
        <div className="mt-[36px] md:mt-[64px]">
          <ArcadeHeader text="Community Partners" />
        </div>

        {isMobile ? (
          <div className="mx-auto mt-20 md:mt-10">
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 1500,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              loop
              slidesPerView={2} // default to show 2 slides during autoplay
              slidesPerGroup={1} // move 1 slide each autoplay tick
              spaceBetween={16}
              className="ml-8 mr-8 flex items-center justify-center lg:ml-[4%] lg:mr-[4%]"
              breakpoints={{
                0: { slidesPerView: 2 }, // ensure 2 slides on smallest widths during autoplay
                480: { slidesPerView: 2 },
                900: { slidesPerView: 2 },
                1100: { slidesPerView: 3 },
                1400: { slidesPerView: 4 },
              }}
            >
              {communityPartnersItems.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="flex justify-center items-center"
                >
                  <MemberComponent url={item.url} imageUrl={item.imageUrl} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {communityPartnersItems.map((item, index) => {
              const lastRow = communityPartnersItems.length % 4;
              if (
                lastRow === 0 ||
                index < communityPartnersItems.length - lastRow
              ) {
                return (
                  <span className="col-span-3" key={index}>
                    <MemberComponent url={item.url} imageUrl={item.imageUrl} />
                  </span>
                );
              } else if (index >= communityPartnersItems.length - lastRow) {
                if (lastRow === 1) {
                  return (
                    <span className="col-span-12" key={index}>
                      <MemberComponent
                        url={item.url}
                        imageUrl={item.imageUrl}
                      />
                    </span>
                  );
                } else if (lastRow === 2) {
                  return (
                    <span className="col-span-6" key={index}>
                      <MemberComponent
                        url={item.url}
                        imageUrl={item.imageUrl}
                      />
                    </span>
                  );
                } else if (lastRow === 3) {
                  return (
                    <span className="col-span-4" key={index}>
                      <MemberComponent
                        url={item.url}
                        imageUrl={item.imageUrl}
                      />
                    </span>
                  );
                }
              }
            })}
          </div>
        )}
      </Section>
    </PageSection>
  );
};

export default CommunityPartners;
