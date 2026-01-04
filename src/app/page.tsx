'use client';

import { useState } from 'react';
import SpaceInvadersLoading from '@/components/SpaceInvadersLoading';
import HelloWorld from '@/components/HelloWorld';
import PixelTransition from '@/components/PixelTransition';


export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transitionActive, setTransitionActive] = useState<boolean>(false);

  // When loading finishes, we wait a moment for the exit transition to be solid
  const handleLoadingComplete = () => {
    // Adding 0.2s delay before loading content as requested
    setTimeout(() => {
      setIsLoading(false);
      // After switching to HelloWorld, we reveal it by clearing the transition
      setTimeout(() => {
        setTransitionActive(false);
      }, 500);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <PixelTransition isActive={transitionActive} />

      {isLoading ? (
        <SpaceInvadersLoading
          onLoadingComplete={handleLoadingComplete}
          onTransitionChange={setTransitionActive}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen p-8">
          <HelloWorld />
        </div>
      )}
    </div>
  );
}