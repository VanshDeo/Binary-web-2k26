"use client"

// import Gallary from "./components/gallery/Index";
import ScrollFlipCard from "./components/ScrollFlipCard";
import Timeline from "./components/Timeline";
import AboutSection from "./components/AboutSection";
import { motion } from "motion/react";
import ScrollGallery from "./components/horizontal-gallery";

export default function Home() {
  return (
    <>
      <h1 className="text-white">Binary 2k26</h1>

      <ScrollFlipCard />      
      <Timeline />

      <section className="h-screen bg-black flex items-center justify-center z-100">
        <AboutSection />
      </section>

      {/* <ScrollGallery /> */}


      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            >
            <ScrollGallery />
      </motion.div>

            
    </>
  );
}
