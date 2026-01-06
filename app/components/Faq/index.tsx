"use client";
import React, { useState } from "react";
import PageSection from "@/app/hooks/PageSection";
import { faqItems } from "@/app/constants/faq";
import BinaryText from "@/app/components/Animations/BinaryText";
import ArcadeHeader from "../ui/ArcadeHeader";
import TypeAnimation from "../Animations/Textanimation";
import useTextScramble from "../Animations/text";

import { motion, AnimatePresence } from "framer-motion";
const FAQs = () => {
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(
    null
  );

  return (
    <PageSection>
      <div id="faqs" className="mb-20 text-white sm:mb-20">
        <div>
          <div className="mt-[96px] md:mt-[116px]">
            <ArcadeHeader text="Have a question?" />
          </div>
          <div className="mx-auto mt-8 min-w-full space-y-4 font-pixelate font-[1rem] md:mt-16 md:w-[calc(50vw)] md:font-[2rem]">
            <ul className="mx-auto max-w-7xl divide-y-[0.1px] divide-[#393939] rounded-xl shadow-md">
              {faqItems.map((faq, index) => {
                return (
                  <li key={index} className="group">
                    <div
                      onClick={() => {
                        setExpandedItemIndex((prevIndex) =>
                          prevIndex === index ? null : index
                        );
                      }}
                      className="flex items-center justify-between px-5 py-5 font-bold marker:content-none hover:cursor-pointer"
                    >
                      <span className="text-base md:text-lg max-w-[72vw] text-white/85">
                        {faq.question}
                      </span>

                      <svg
                        className={`h-5 w-5 text-gray-400 transition group-hover:text-gray-300 group-active:text-gray-200 ${expandedItemIndex === index ? "rotate-90" : ""
                          }`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        ></path>
                      </svg>
                    </div>

                    <AnimatePresence>
                      {expandedItemIndex === index && (
                        <motion.div
                          className="bg-gr0 pb-4 text-sm md:text-base"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.05,
                            ease: "easeInOut",
                          }}
                        >
                          <p className="px-4 text-white/85">{`${faq.answer}`}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </PageSection>
  );
};

export default FAQs;
