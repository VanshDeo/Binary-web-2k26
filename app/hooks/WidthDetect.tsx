import { useState, useEffect } from "react";

function useScreenSize(thresholds: { small: number; medium: number } = { small: 622, medium: 1000 }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width < 600);
      setIsMediumScreen(width >= 600 && width < 1000);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [thresholds]);

  return { isSmallScreen, isMediumScreen };
}

export default useScreenSize;
