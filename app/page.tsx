"use client";

import { useState } from "react";
import SpaceInvadersLoading from "./components/preloader/SpaceInvadersLoading";
import PixelTransition from "./components/preloader/PixelTransition";

import Gallary from "./components/gallary";
import ScrollFlipCard from "./components/ScrollFlipCard";
import Tracks from "./components/Tracks";
import Mentors from "./components/Mentors";
import Timeline from "./components/Timeline";
import AboutSection from "./components/AboutSection";
import Navbar from "./components/Navbar";
import FAQs from "./components/Faq";
import Footer from "./components/Footer";
import CommunityPartners from "./components/CommunityPartners";
import Sponsors from "./components/Sponsors";
import Hero from './components/Hero';
import { useInView } from 'react-intersection-observer';


export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transitionActive, setTransitionActive] = useState<boolean>(false);

  const [heroTopRef, heroTopInView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
    initialInView: true,
  });

  // When loading finishes, we wait a moment for the exit transition to be solid
  const handleLoadingComplete = () => {
    // Adding 0.2s delay before loading content as requested
    setTimeout(() => {
      setIsLoading(false);
      // After switching to HelloWorld, we reveal it by clearing the transition
      setTimeout(() => {
        setTransitionActive(false);
      }, 500);
    }, 200);
  };

  return (
    <>
      <div className="min-h-screen text-white relative overflow-x-hidden">
        <PixelTransition isActive={transitionActive} />

        {isLoading ? (
          <SpaceInvadersLoading
            onLoadingComplete={handleLoadingComplete}
            onTransitionChange={setTransitionActive}
          />
        ) : (
          <>
            <Navbar />
            {/* <ScrollFlipCard /> */}
            <Hero heroTopRef={heroTopRef} />
            <AboutSection />
            <Timeline />
            <Tracks />
            <Gallary />
            <Mentors />
            <Sponsors />
            <CommunityPartners />
            <FAQs />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}
