"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import styles from "./styles.module.css";
import Image from "next/image";
import PageSection from "../../hooks/PageSection";

interface SliderItem {
  color: string;
  src: string;
}

const slider1: SliderItem[] = [
  {
    color: "#e3e5e7",
    src: "8.jpg",
  },
  {
    color: "#d6d7dc",
    src: "5.jpg",
  },
  {
    color: "#e3e3e3",
    src: "6.jpg",
  },
  {
    color: "#21242b",
    src: "7.jpg",
  },
];

const slider2: SliderItem[] = [
  {
    color: "#d4e3ec",
    src: "maven.jpg",
  },
  {
    color: "#e5e0e1",
    src: "panda.jpg",
  },
  {
    color: "#d7d4cf",
    src: "3.jpg",
  },
  {
    color: "#e1dad6",
    src: "4.jpg",
  },
];

const Gallary = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <PageSection id="gallery" disableMinHeight className="bg-black py-24 text-white">
      <div className="flex flex-col gap-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-green-400">Highlights</p>
          <h2 className="text-4xl font-bold font-mono text-green-500">&lt;Gallery /&gt;</h2>
        </div>

        <div ref={container} className={styles.slidingImages}>
          <motion.div style={{ x: x1 }} className={styles.slider}>
            {slider1.map((project, index) => (
              <div
                key={index}
                className={styles.project}
                style={{ backgroundColor: project.color }}
              >
                <div className={styles.imageContainer}>
                  <Image fill alt="gallery image" src={`/images/${project.src}`} />
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div style={{ x: x2 }} className={styles.slider}>
            {slider2.map((project, index) => (
              <div
                key={index}
                className={styles.project}
                style={{ backgroundColor: project.color }}
              >
                <div className={styles.imageContainer}>
                  <Image fill alt="gallery image" src={`/images/${project.src}`} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageSection>
  );
};

export default Gallary;
