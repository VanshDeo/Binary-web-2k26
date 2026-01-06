declare module 'react-powerglitch' {
  import * as React from 'react';

  export type UseGlitchOptions = any;

  export function useGlitch(options?: UseGlitchOptions): {
    ref: React.RefObject<HTMLElement> | null;
    play?: () => void;
    pause?: () => void;
  };

  const PowerGlitch: React.ComponentType<any>;
  export default PowerGlitch;
}
