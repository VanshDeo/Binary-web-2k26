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

import { pixelifySans } from '@/app/utils/pixelifySans.utils';

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
      <Section className="flex flex-col min-h-[50vh]">
        <div className="mt-[36px] md:mt-[64px] mb-12">
          <ArcadeHeader text="Community Partners" />
        </div>

        <div className="flex items-center justify-center min-h-20 md:min-h-50">
          <p className={`text-4xl md:text-4xl font-bold text-white uppercase tracking-widest ${pixelifySans.className}`}>
            Coming Soon!
          </p>
        </div>
      </Section>
    </PageSection>
  );
};

export default CommunityPartners;
