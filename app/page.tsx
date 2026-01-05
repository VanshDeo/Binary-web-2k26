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

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transitionActive, setTransitionActive] = useState<boolean>(false);

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
      <div className="min-h-screen bg-black text-white relative">
        <PixelTransition isActive={transitionActive} />

        {isLoading ? (
          <SpaceInvadersLoading
            onLoadingComplete={handleLoadingComplete}
            onTransitionChange={setTransitionActive}
          />
        ) : (
          <>
            <Navbar />
            <h1 className="text-white">Binary 2k26</h1>
            <ScrollFlipCard />
            <section className="h-screen bg-black flex items-center justify-center z-100">
              <AboutSection />
            </section>
            <Tracks />
            <Mentors />
            <Timeline />
            <Gallary />
            <FAQs />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}
