"use client";
import { Key, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import ArcadeHeader from "../ui/ArcadeHeader";
import { useTransform, useScroll, motion } from "framer-motion";
import useScreenSize from "@/app/hooks/WidthDetect";
import PageSection from "@/app/hooks/PageSection";

// import { Key } from 'react';
// import { motion } from 'framer-motion';
const images = [
  "1.webp",
  "2.webp",
  "3.webp",
  "4.webp",
  "5.webp",
  "6.webp",
  "7.webp",
  "8.webp",
  "9.webp",
  "10.webp",
  "11.webp",
  "12.webp",
];

// Define type for dimension state
interface Dimension {
  width: number;
  height: number;
}

// Define type for Column component props
// interface ColumnProps {
//   images: string[];
//   y: any;
// }

export default function ScrollGallery() {
  const gallery = useRef<HTMLDivElement | null>(null); // Correct typing for the gallery reference
  const [dimension, setDimension] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });
  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  const { isSmallScreen, isMediumScreen } = useScreenSize();



  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <PageSection id="gallery">
      <section className={styles.main}>
        <div className="mb-12">
          <ArcadeHeader text="Gallery" />
        </div>
        <div
          ref={gallery}
          className={styles.gallery}
        >
          {/* Mobile: Single Column with all images */}
          {isSmallScreen ? (
            <Column
              images={images}
              y={0}
            />
          ) : (
            /* Desktop: Multi-column parallax layout */
            <>
              <Column
                images={[images[0], images[1], images[2]]}
                y={y as unknown as number}
              />
              <Column
                images={[images[3], images[4], images[5]]}
                y={y2 as unknown as number}
              />
              {isMediumScreen ? (
                <Column
                  images={[images[6], images[7], images[8]]}
                  y={y3 as unknown as number}
                />
              ) : (
                <>
                  <Column
                    images={[images[6], images[7], images[8]]}
                    y={y3 as unknown as number}
                  />
                  <Column
                    images={[images[9], images[10], images[11]]}
                    y={y4 as unknown as number}
                  />
                </>
              )}
            </>
          )}
        </div>
        <div className={styles.spacer}></div>
      </section>
    </PageSection>
  );
}

const Column = ({ images, y }: { images: string[]; y: number }) => {
  return (
    <motion.div className={styles.column} style={{ y }}>
      {images.map((src, i: Key) => {
        return (
          <div key={i} className={styles.imageContainer}>
            <Image src={`/images/${src}`} alt="image" fill className="object-cover" />
          </div>
        );
      })}
    </motion.div>
  );
};
