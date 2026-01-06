
// 'use client'

// import { useRef } from "react";
// import { useScroll, useTransform, motion } from "framer-motion";
// import styles from "./styles.module.scss";
// import Image from "next/image";

// //... (slider1 and slider2 arrays remain the same)
// interface SliderItem {
//   color: string;
//   src: string;
// }

// const slider1: SliderItem[] = [
//   {
//     color: "#e3e5e7",
//     src: "c2.jpg",
//   },
//   {
//     color: "#d6d7dc",
//     src: "decimal.jpg",
//   },
//   {
//     color: "#e3e3e3",
//     src: "funny.jpg",
//   },
//   {
//     color: "#21242b",
//     src: "google.jpg",
//   },
// ];

// const slider2: SliderItem[] = [
//   {
//     color: "#d4e3ec",
//     src: "maven.jpg",
//   },
//   {
//     color: "#e5e0e1",
//     src: "panda.jpg",
//   },
//   {
//     color: "#d7d4cf",
//     src: "powell.jpg",
//   },
//   {
//     color: "#e1dad6",
//     src: "wix.jpg",
//   },
// ];

// const Index = () => {
//   const container = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: container,
//     offset: ["start end", "end start"],
//   });

//   // FIX: Change 'x' to 'y' for vertical movement
//   // Adjust these values (e.g., -200 to 200) to control scroll speed/direction
//   const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
//   const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);

//   return (
//     <div ref={container} className={styles.slidingImages}>
//       {/* Apply vertical transform (y) instead of horizontal (x) */}
//       <motion.div style={{ y: y1 }} className={styles.slider}>
//         {slider1.map((project, index) => (
//           <div
//             key={index}
//             className={styles.project}
//             style={{ backgroundColor: project.color }}
//           >
//             <div className={styles.imageContainer}>
//               <Image 
//                 fill={true} 
//                 alt={"image"} 
//                 src={`/images/${project.src}`} 
//                 sizes="(max-width: 768px) 100vw, 33vw" // FIX: Performance warning
//               />
//             </div>
//           </div>
//         ))}
//       </motion.div>

//       <motion.div style={{ y: y2 }} className={styles.slider}>
//         {slider2.map((project, index) => (
//           <div
//             key={index}
//             className={styles.project}
//             style={{ backgroundColor: project.color }}
//           >
//             <div className={styles.imageContainer}>
//               <Image 
//                 fill={true} 
//                 alt={"image"} 
//                 src={`/images/${project.src}`} 
//                 sizes="(max-width: 768px) 100vw, 33vw" // FIX: Performance warning
//               />
//             </div>
//           </div>
//         ))}
//       </motion.div>
//     </div>
//   );
// };

// export default Index;

'use client'

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import styles from "./styles.module.scss";
import Image from "next/image";
import ArcadeHeader from "../ui/ArcadeHeader";

// Split your images into 4 columns
const slider1 = [{ src: "c2.jpg" }, { src: "decimal.jpg" }];
const slider2 = [{ src: "funny.jpg" }, { src: "google.jpg" }];
const slider3 = [{ src: "maven.jpg" }, { src: "panda.jpg" }];
const slider4 = [{ src: "powell.jpg" }, { src: "wix.jpg" }];

const Index = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  // Column 1 & 3: Move Down
  const y1 = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  // Column 2 & 4: Move Up
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const y4 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const columns = [
    { data: slider1, y: y1 },
    { data: slider2, y: y2 },
    { data: slider3, y: y3 },
    { data: slider4, y: y4 }
  ];

  return (
    <section id="gallery" className="flex flex-col gap-8 py-20 bg-black">
      <ArcadeHeader text="Gallery" />
      <div ref={container} className={styles.slidingImages}>
        {columns.map((column, i) => (
          <motion.div key={i} style={{ y: column.y }} className={styles.slider}>
            {column.data.map((project, index) => (
              <div key={index} className={styles.project}>
                <div className={styles.imageContainer}>
                  <Image
                    fill
                    alt="gallery image"
                    src={`/images/${project.src}`}
                    sizes="25vw"
                    className={styles.img}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Index;