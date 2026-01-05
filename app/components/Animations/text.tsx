'use client';
import { useEffect, useRef, useState } from 'react';

class TextScramble {
  el: HTMLDivElement;
  chars: string;
  frame: number;
  frameRequest!: number;
  queue: { from: string; to: string; start: number; end: number; char?: string }[];
  resolve!: () => void;

  constructor(el: HTMLDivElement) {
    this.el = el;
    this.chars = '01';
    this.frame = 0;
    this.queue = [];
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));

    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span className="text-green-500" >${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar(): string {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const useTextScramble = (phrases: string[], duration: number = 800) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect(); // Stop observing once onscreen
          }
        });
      },
      { threshold: 0.5 }, // Adjust the threshold as needed
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      observer.disconnect(); // Cleanup on component unmount
    };
  }, []); // Run effect only once on mount

  useEffect(() => {
    const el = textRef.current;
    if (el && isIntersecting) {
      const fx = new TextScramble(el);

      let counter = 0;
      const next = () => {
        fx.setText(phrases[counter]).then(() => {
          setTimeout(() => {
            setIsIntersecting(false);
          }, duration);
        });
        counter = (counter + 1) % phrases.length;
      };

      next();
    }
  }, [isIntersecting, phrases, duration]);

  return textRef;
};

export default useTextScramble;
