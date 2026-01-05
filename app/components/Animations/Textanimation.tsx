import React from 'react';
import { animate, motion } from 'framer-motion';

interface TypeAnimationProps {
  text: string;
  className?: string;
}

const quote = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.9,
      staggerchildren: 0.08,
    },
  },
};

const singleword = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
    },
  },
};

const TypeAnimation2: React.FC<TypeAnimationProps> = ({ text, className = '' }) => {
  return (
    <div
      className={`mx-auto flex w-full items-center justify-center overflow-hidden py-2 text-center ${className}`}
    >
      <motion.h1
        className="inline-block w-full capitalize"
        variants={quote}
        initial="initial"
        animate="animate"
      >
        {text.split(' ').map((word, index) => (
          <motion.span
            key={word + '-' + index}
            className="inline-block"
            variants={singleword}
            initial="initial"
            animate="animate"
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
};

export default TypeAnimation2;
