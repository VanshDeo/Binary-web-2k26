'use client';

import { cn } from '@/lib/utils';
import { ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const BinaryText = ({
  className,
  children,
  reveal,
}: {
  className?: string;
  children: ReactNode;
  reveal?: boolean;
}) => {
  const text = children as string;
  const letters = '01010110111101001001';
  const [headlineText, setHeadlineText] = useState<string>(text);

  const scrambleReveal = () => {
    let iteration = 0;
    let requestId: number | null = null;
    const { length } = headlineText;

    const scrambleText = () => {
      setHeadlineText((prevText) => {
        const scrambledText = prevText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * length)];
          })
          .join('');

        iteration += 1 / 9;

        if (iteration >= length) {
          setHeadlineText(text);
          cancelAnimationFrame(requestId!);
        }

        return scrambledText;
      });

      setTimeout(() => {
        requestId = requestAnimationFrame(scrambleText);
      }, 9);
    };

    requestId = requestAnimationFrame(scrambleText);
  };

  const { ref, inView } = useInView({
    triggerOnce: false,
    fallbackInView: true,
  });

  useEffect(() => {
    // if (inView) scrambleReveal();
  });

  return (
    <span ref={ref} className={cn('block', className)}>
      {headlineText}
    </span>
  );
};

export default BinaryText;
