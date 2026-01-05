import React, { useEffect, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  svgMapping: { [key: string]: string };
  maxDelay: number;
}

const TextScramble: React.FC<TextScrambleProps> = ({ text, svgMapping, maxDelay }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrambleText = (node: HTMLDivElement) => {
      const charsObj = text.split('').map((char) => ({
        char,
        delay: char === ' ' ? 0 : Math.floor(Math.random() * (maxDelay + 1)),
      }));

      let timerId = setInterval(() => {
        const scramblChars = charsObj.map((obj) => {
          if (obj.delay === 0) return svgMapping[obj.char] || obj.char;
          if (obj.delay > 0) {
            obj.delay--;
            return svgMapping[obj.char] || obj.char;
          }
        });
        node.innerHTML = scramblChars.join('');
      }, 50);

      setTimeout(() => {
        clearInterval(timerId);
      }, maxDelay * 1000);
    };

    if (nodeRef.current) {
      scrambleText(nodeRef.current);
    }
  }, [text, svgMapping, maxDelay]);

  return <div ref={nodeRef} />;
};

const MyComponent: React.FC = () => {
  const TEXT = 'Hello World';
  const MAX_DELAY = 40;

  const svgMapping = {
    H: '<svg width="20" height="20"><text x="0" y="15" font-size="12" fill="red">H</text></svg>',
    e: '<svg width="20" height="20"><text x="0" y="15" font-size="12" fill="blue">e</text></svg>',
    l: '<svg width="20" height="20"><text x="0" y="15" font-size="12" fill="yellow">l</text></svg>',
    o: '<svg width="20" height="20"><text x="0" y="15" font-size="12" fill="green">o</text></svg>',
    ' ': ' ', // Space
  };

  return (
    <div>
      <TextScramble text={TEXT} svgMapping={svgMapping} maxDelay={MAX_DELAY} />
    </div>
  );
};

export default MyComponent;
